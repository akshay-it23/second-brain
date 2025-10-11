import { NextFunction, Request, Response } from "express";
export interface AuthRequest extends Request {
    userId?: string;
}
export declare const userMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void;
