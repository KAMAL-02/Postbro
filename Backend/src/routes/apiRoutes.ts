import { Router } from 'express';
import { sendApiRequest } from '../controllers/request/apiController';
import { signup, login, logout } from '../controllers/auth/authController';
import passport from '../middleware/passport';
import { optionalAuth } from '../middleware/optionalAuth';
import { getHistory, deleteHistory, deleteAllHistory } from '../controllers/database/history';

const router = Router();

// REST API endpoints
router.post('/request', optionalAuth, sendApiRequest);

// WebSocket endpoints
// router.get('/websocket/connections', passport.authenticate("jwt", {session: false}), getActiveConnections);

// Auth endpoints
router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.post("/auth/logout", logout);

// History endpoints
router.get('/history',passport.authenticate("jwt", {session: false}), getHistory);
router.delete('/history/:id', passport.authenticate("jwt", {session: false}), deleteHistory);
router.delete('/history', passport.authenticate("jwt", {session: false}), deleteAllHistory);
// router.get('/history/:id', passport.authenticate("jwt", {session: false}), getHistoryById);

router.get('/me', passport.authenticate("jwt", {session: false}), (req, res) => {
    res.status(200).json({ user: req.user });
});


export default router;