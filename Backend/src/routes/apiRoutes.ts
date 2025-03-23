import { Router } from 'express';
import { sendApiRequest } from '../controllers/request/apiController';
import { signup, login } from '../controllers/auth/authController';
import passport from '../middleware/passport';

const router = Router();

router.post('/request', passport.authenticate("jwt", {session: false}), sendApiRequest);
router.post('/signup', signup);
router.post('/login', login);

export default router;