import { Router } from 'express';
import { sendApiRequest } from '../controllers/request/apiController';
import { signup, login, logout } from '../controllers/auth/authController';
import passport from '../middleware/passport';
import { optionalAuth } from '../middleware/optionalAuth';

const router = Router();

router.post('/request', optionalAuth, sendApiRequest);
router.post('/signup', signup);
router.post('/login', login);
router.post("/logout", logout);
router.get('/me', passport.authenticate("jwt", {session: false}), (req, res) => {
    res.status(200).json({ user: req.user });
});


export default router;