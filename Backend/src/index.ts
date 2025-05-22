import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes';
import limiter from './utils/rateLimit';
import logger from './utils/logger';
import cookieParser from "cookie-parser";
import http from 'http';
import { initWebSocketServer } from './controllers/request/realtimeController';

//test line
//Configuration
config();
const app = express();
const server = http.createServer(app);

//Middleware
app.use(cookieParser());
app.use(limiter);
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json());

//Routes
app.use('/api', apiRoutes);

//Route to test the server
app.get('/', (req, res) => {
    logger.info("Health check")
    res.send("Hello World!");
});

// Initialize WebSocket server
initWebSocketServer(server);

//Listen to the server
server.listen(process.env.PORT, () => {
    logger.info(`🚀 Server running on port ${process.env.PORT}`);
});