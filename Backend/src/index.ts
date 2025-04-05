import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes';
import limiter from './utils/rateLimit';
import logger from './utils/logger';


//Configuration
config();
const app = express();

//Middleware
app.use(limiter);
app.use(cors());
app.use(express.json());


//Routes
app.use('/api', apiRoutes);

//Route to test the server
app.get('/', (req, res) => {
    logger.info("Health check")
    res.send("Hello World!");
})

//Listen to the server
app.listen(process.env.PORT, () => {
    logger.info(`🚀 Server running on port ${process.env.PORT}`);
})