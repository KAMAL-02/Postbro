import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cookieExtractor = (req: any) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET!,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log("JWT payload:", jwt_payload);
    try {
      console.log("JWT payload ID:", jwt_payload.id);
      const user = await prisma.user.findUnique({
        where: { id: jwt_payload.id },
      });
      if (user) return done(null, user);
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
