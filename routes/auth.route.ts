import { Router, Request, Response, NextFunction } from 'express';
import settings from '../settings';

const api = Router();

api.get('/', (req: Request, res: Response, next: NextFunction) => {
    
    res.status(200).json({
        status: 'success',
        code: 200,
        environment: settings.api.environment,
        msg: 'API Auth Works Successfully !!!'
    });

});

export default api;
