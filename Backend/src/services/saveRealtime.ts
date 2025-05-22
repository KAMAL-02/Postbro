import { PrismaClient, MessageDirection } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

interface WebSocketSessionData {
  url: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  messageCountSent: number;
  messageCountReceived: number;
}

interface WebSocketMessageData {
  sessionId: string;
  direction: 'sent' | 'received';
  data: string;
  timestamp?: number;
}

export const saveWebSocketSession = async (sessionData: WebSocketSessionData) => {
  try {
    const { url, userId, startTime, endTime, messageCountSent, messageCountReceived } = sessionData;
    
    const session = await prisma.realTimeSession.create({
      data: {
        url,
        userId: userId || null,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        messageCountSent,
        messageCountReceived
      }
    });
    
    logger.info(`Saved WebSocket session for ${url}${userId ? ` (user: ${userId})` : ''}`);
    return session;
  } catch (error) {
    logger.error(`Failed to save WebSocket session: ${(error as Error).message}`);
    throw new Error("Failed to save WebSocket session");
  }
};

export const updateWebSocketSession = async (sessionId: string, sessionData: Partial<WebSocketSessionData>) => {
  try {
    const updateData: any = {};
    
    if (sessionData.endTime) {
      updateData.endTime = new Date(sessionData.endTime);
    }
    
    if (sessionData.messageCountSent !== undefined) {
      updateData.messageCountSent = sessionData.messageCountSent;
    }
    
    if (sessionData.messageCountReceived !== undefined) {
      updateData.messageCountReceived = sessionData.messageCountReceived;
    }
    
    const updatedSession = await prisma.realTimeSession.update({
      where: { id: sessionId },
      data: updateData
    });
    
    logger.info(`Updated WebSocket session ${sessionId}`);
    return updatedSession;
  } catch (error) {
    logger.error(`Failed to update WebSocket session: ${(error as Error).message}`);
    throw new Error("Failed to update WebSocket session");
  }
};

export const saveWebSocketMessage = async (messageData: WebSocketMessageData) => {
  try {
    const { sessionId, direction, data, timestamp } = messageData;
    
    const message = await prisma.realTimeMessage.create({
      data: {
        sessionId,
        direction: direction === 'sent' ? MessageDirection.sent : MessageDirection.received,
        data,
        timestamp: timestamp ? new Date(timestamp) : new Date()
      }
    });
    
    logger.info(`Saved WebSocket ${direction} message for session ${sessionId}`);
    return message;
  } catch (error) {
    logger.error(`Failed to save WebSocket message: ${(error as Error).message}`);
    throw new Error("Failed to save WebSocket message");
  }
};

export const finalizeWebSocketHistory = async (connection: any) => {
  try {
    const { userId, url, startTime, messageCount } = connection;
    const endTime = Date.now();
    
    // Save the session
    const session = await saveWebSocketSession({
      url,
      userId,
      startTime,
      endTime,
      messageCountSent: messageCount.sent,
      messageCountReceived: messageCount.received
    });
    
    logger.info(`Finalized WebSocket history for session ${session.id}`);
    return session;
  } catch (error) {
    logger.error(`Failed to finalize WebSocket history: ${(error as Error).message}`);
    throw new Error("Failed to finalize WebSocket history");
  }
};