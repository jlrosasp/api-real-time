import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import MongoDBHelper from '../helpers/mongodb.helper';
import settings from '../settings';

const api = Router();
const mongo = MongoDBHelper.getInstance();

api.get('/', (req: Request, res: Response, next: NextFunction) => {
    
    res.status(200).json({
        status: 'success',
        code: 200,
        environment: settings.api.environment,
        msg: 'API Auth Works Successfully !!!'
    });

});
api.post('/login', async(req: Request, res: Response, next: NextFunction) => {

    const { email, password } = req.body;
    mongo.setDataBase('dbmtwdm');

    // Encontro el correo electrónico
    const user:any = await mongo.db.collection('user').findOne({email})
        .then((result: any) => {
            return {
                status: 'success',
                data: result
            }
        })
        .catch((err: any) => {
            return {
                status: 'error',
                data: err
            }
        });

    if (user.status === 'success' && user.data != null) {
        // Procedemos a comprobar la contraseña
        if (bcrypt.compareSync(password, user.data.password)) {
            res.status(200).json({
                status: 'success',
                code: 200,
                environment: settings.api.environment,
                msg: 'Inicio de sesión realizado de forma exitosa !!!'
            });
        } else {
            res.status(401).json({
                status: 'Unauthorized',
                code: 401,
                environment: settings.api.environment,
                msg: 'Lo sentimos, es necesario estar autenticado para poder ingresar al sitio. Favor de verificar que su correo y contraseña sean correctos.'
            });
        };
    } else {
        res.status(401).json({
            status: 'Unauthorized',
            code: 401,
            environment: settings.api.environment,
            msg: 'Lo sentimos, es necesario estar autenticado para poder ingresar al sitio. Favor de verificar que su correo y contraseña sean correctos.'
        });
    }   

});

api.post('/getRolesByUser', (req: Request, res: Response, next: NextFunction) => {
    //TO DO
});

api.post('/passwordChange', (req: Request, res: Response, next: NextFunction) => {
    //TO DO
});

api.post('/passwordRecovery', (req: Request, res: Response, next: NextFunction) => {
    //TO DO
});

api.post('/logout', (req: Request, res: Response, next: NextFunction) => {
    //TO DO
});

export default api;
