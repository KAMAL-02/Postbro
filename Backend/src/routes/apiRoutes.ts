import { Router } from 'express';
import { sendApiRequest } from '../controllers/request/apiController';
import { signup, login, logout } from '../controllers/auth/authController';
import passport from '../middleware/passport';
import { optionalAuth } from '../middleware/optionalAuth';
import { getHistory } from '../controllers/database/getHistory';

const router = Router();

router.post('/request', optionalAuth, sendApiRequest);

router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.post("/auth/logout", logout);

router.get('/history',passport.authenticate("jwt", {session: false}), getHistory);

router.get('/me', passport.authenticate("jwt", {session: false}), (req, res) => {
    res.status(200).json({ user: req.user });
});


export default router;