import { Request, Response, NextFunction } from "express";
interface CustomError extends Error {
    statusCode?: number;
    status?: number;
    code?: string;
}
export declare const errorGuard: (err: CustomError, req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=errorGuard.d.ts.map