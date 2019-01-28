import express, { Request, Response, NextFunction } from 'express';

export function wrap(fn: (request: Request, response: Response, next: NextFunction) => Promise<any>) {
    return (request: Request, response: Response, next: NextFunction) => fn(request, response, next).catch(next);
}
