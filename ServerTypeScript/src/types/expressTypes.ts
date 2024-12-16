import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    userId: string;
}

export interface AuthenticatedRequestOptional extends Request {
    userId?: string;
}