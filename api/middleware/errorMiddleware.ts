import { NextFunction, Response, Request, ErrorRequestHandler } from "express";

export default () => (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(500).send(err.message);
};
