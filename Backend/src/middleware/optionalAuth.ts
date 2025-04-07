import passport from "../middleware/passport";
import { Request, Response, NextFunction } from "express";

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: false }, (err: any, user: any, info: any) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};