import logger from "../../utils/logger";
import WebSocket from "ws";
import http from "http";
import { v4 as uuidv4 } from "uuid";
import { finalizeWebSocketHistory, saveWebSocketMessage } from "../../services/saveRealtime";

// Store active WebSocket connections
const activeConnections = new Map();

// Initialize WebSocket server in a separate function that can be called from index.ts
const initWebSocketServer = (server: http.Server) => {
  const wss = new WebSocket.Server({ noServer: true });

  // Handle upgrade requests to establish WebSocket connections only if the URL matches
  // This prevents the server from accepting WebSocket connections on other routes
  server.on("upgrade", (request, socket, head) => {
    if (request.url === "/api/websocket") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        console.log("WebSocket connection established");
        wss.emit("connection", ws, request);
      });
    }
  });

  // Handle new WebSocket connections from clients
  wss.on("connection", (clientWs) => {
    let targetWs: WebSocket | null = null;
    let connectionId: string = uuidv4();
    let targetUrl: string = "";

    // Handle messages from client
    clientWs.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());

        // Command to connect to a target WebSocket server
        if (data.type === "connect") {
          targetUrl = data.url;
          const headers = data.headers || {};
          
          logger.info(`Connecting to WebSocket at ${targetUrl}`);
          
          if (targetWs) {
            targetWs.close();
            targetWs = null;
          }

          // Connect to the target WebSocket server
          try {
            targetWs = new WebSocket(targetUrl, { headers });
            
            // Store the connection
            activeConnections.set(connectionId, {
              clientWs,
              targetWs,
              url: targetUrl,
              startTime: Date.now(),
              userId: data.userId || null,
              messageCount: { sent: 0, received: 0 },
              sessionId: null // Will be populated after session creation
            });

            // Create a realtime session in the database
            if (data.userId) {
              finalizeWebSocketHistory({
                userId: data.userId,
                url: targetUrl,
                startTime: Date.now(),
                messageCount: { sent: 0, received: 0 }
              }).then(session => {
                const conn = activeConnections.get(connectionId);
                if (conn) {
                  conn.sessionId = session.id;
                }
              }).catch(err => {
                logger.error(`Failed to create WebSocket session: ${err.message}`);
              });
            }

            // Handle messages from target WebSocket server
            targetWs.on("message", (targetMessage) => {
              const conn = activeConnections.get(connectionId);
              if (conn) {
                conn.messageCount.received++;
                
                // Save received message
                if (conn.userId && conn.sessionId) {
                  const timestamp = Date.now();
                  saveWebSocketMessage({
                    sessionId: conn.sessionId,
                    direction: 'received',
                    data: targetMessage.toString(),
                    timestamp
                  }).catch(err => {
                    logger.error(`Failed to save received WebSocket message: ${err.message}`);
                  });
                }
              }
              
              // Forward message to client so that it can be seen in the UI
              clientWs.send(JSON.stringify({
                type: "message",
                direction: "received",
                data: targetMessage.toString(),
                timestamp: Date.now()
              }));
            });

            // Handle target WebSocket connection open when the connection is established
            targetWs.on("open", () => {
              logger.info(`WebSocket connection established to ${targetUrl}`);
              clientWs.send(JSON.stringify({
                type: "status",
                status: "connected",
                url: targetUrl,
                timestamp: Date.now()
              }));
            });

            // Handle target WebSocket errors
            targetWs.on("error", (error) => {
              logger.error(`WebSocket error for ${targetUrl}: ${error.message}`);
              clientWs.send(JSON.stringify({
                type: "error",
                message: error.message,
                timestamp: Date.now()
              }));
            });

            // Handle target WebSocket close
            targetWs.on("close", (code, reason) => {
              logger.info(`WebSocket connection closed for ${targetUrl}: ${code} - ${reason}`);
              clientWs.send(JSON.stringify({
                type: "status",
                status: "disconnected",
                code,
                reason: reason.toString(),
                timestamp: Date.now()
              }));
              
              // Save connection history
              const conn = activeConnections.get(connectionId);
              if (conn && conn.userId) {
                finalizeWebSocketHistory(conn).catch(err => {
                  logger.error(`Failed to save WebSocket history on close: ${err.message}`);
                });
              }
              
              activeConnections.delete(connectionId);
            });

          } catch (err) {
            const error = err as Error;
            logger.error(`Failed to connect to WebSocket at ${targetUrl}: ${error.message}`);
            clientWs.send(JSON.stringify({
              type: "error",
              message: `Failed to connect: ${error.message}`,
              timestamp: Date.now()
            }));
          }
        }
        
        // Command to send a message to the target WebSocket server
        else if (data.type === "send" && targetWs) {
          logger.info(`Sending message to ${targetUrl}`);
          
          const conn = activeConnections.get(connectionId);
          if (conn) {
            conn.messageCount.sent++;
            
            // Save sent message if user is authenticated
            if (conn.userId && conn.sessionId) {
              const timestamp = Date.now();
              saveWebSocketMessage({
                sessionId: conn.sessionId,
                direction: 'sent',
                data: data.message,
                timestamp
              }).catch(err => {
                logger.error(`Failed to save sent WebSocket message: ${err.message}`);
              });
            }
          }
          
          targetWs.send(data.message);
          
          // Echo back to client for logging
          clientWs.send(JSON.stringify({
            type: "message",
            direction: "sent",
            data: data.message,
            timestamp: Date.now()
          }));
        }
        
        // Command to disconnect from the target WebSocket server
        else if (data.type === "disconnect" && targetWs) {
          logger.info(`Disconnecting from ${targetUrl}`);
          
          // Save connection history
          const conn = activeConnections.get(connectionId);
          if (conn && conn.userId) {
            finalizeWebSocketHistory(conn).catch(err => {
              logger.error(`Failed to save WebSocket history on disconnect: ${err.message}`);
            });
          }
          
          targetWs.close(1000, "Client requested disconnect");
          targetWs = null;
          activeConnections.delete(connectionId);
          
          clientWs.send(JSON.stringify({
            type: "status",
            status: "disconnected",
            code: 1000,
            reason: "Client requested disconnect",
            timestamp: Date.now()
          }));
        }
        
      } catch (error) {
        logger.error(`Error processing WebSocket message: ${(error as Error).message}`);
        clientWs.send(JSON.stringify({
          type: "error",
          message: `Error processing message: ${(error as Error).message}`,
          timestamp: Date.now()
        }));
      }
    });

    // Handle client disconnection
    clientWs.on("close", () => {
      logger.info(`Client WebSocket connection closed`);
      
      if (targetWs) {
        // Save connection history
        const conn = activeConnections.get(connectionId);
        if (conn && conn.userId) {
          finalizeWebSocketHistory(conn).catch(err => {
            logger.error(`Failed to save WebSocket history on client disconnect: ${err.message}`);
          });
        }
        
        targetWs.close();
        targetWs = null;
        activeConnections.delete(connectionId);
      }
    });
  });

  logger.info("WebSocket server initialized");
  return wss;
};

// HTTP endpoint to get active WebSocket connections
// const getActiveConnections = (req: Request, res: Response) => {
//   const user = req.user as any;
  
//   // Ensure only authenticated users can see connections
//   if (!user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
  
//   const connections = Array.from(activeConnections.values()).map(conn => ({
//     url: conn.url,
//     startTime: conn.startTime,
//     messageCount: conn.messageCount,
//     duration: Date.now() - conn.startTime
//   }));
  
//   return res.status(200).json(connections);
// };

export { initWebSocketServer };