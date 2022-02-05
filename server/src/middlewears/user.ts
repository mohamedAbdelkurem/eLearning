import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../entities/User";

// middleware to chech if the user is authenticated
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get token from cookies
    const token = req.cookies.token;
    if (!token) return next();
    // if token exists,  verify if it's valid
    const { user }: any = jwt.verify(token, process.env.JWT_SECRET!);
    const foundUser = await User.findOne({ id: user });
    // return the user and call next
    res.locals.user = foundUser;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "unauthenticated" });
  }
};
