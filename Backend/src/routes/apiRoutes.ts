import { Router } from 'express';
import { sendApiRequest } from '../controllers/apiController';

const router = Router();

router.post('/request', sendApiRequest);

export default router;