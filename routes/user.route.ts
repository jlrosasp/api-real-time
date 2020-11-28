import { NextFunction, Request, Response, Router } from 'express';
import MongoDBHelper from '../helpers/mongodb.helper';
import settings from '../settings';

const api = Router();
const mongo = MongoDBHelper.getInstance();

api.get('/', (req: Request, res: Response, next: NextFunction) => {
    
    res.status(200).json({
        status: 'success',
        code: 200,
        environment: settings.api.environment,
        msg: 'API User Works Successfully !!!'
    });
    
});

api.post('/add', async(req: Request, res: Response, next: NextFunction) => {
    const { email, password, fullName, photo } = req.body;

    // Insert User on MongoDB
    mongo.setDataBase('dbmtwdm')
    const result: any = await mongo.db.collection('user').insertOne({
        email, password, fullName, photo
    })
    .then((result: any) => {
        return {
            uid: result.insertedId,
            rowsAffected: result.insertedCount
        }
    })
    .catch((err: any) => {
        return err;
    });

    // Insert Log Data Base
    mongo.setDataBase('dblogs');
    await mongo.db.collection('logs.user').insertOne({
        fecha: Date(),
        accion: 'Inserción de usuario',
        endpoint: 'v1/user/add',
    });

    res.status(201).json({
        uid: result.uid,
        email,
        fullName,
        photo,
        rowsAffected: result.rowsAffected
    });
});

export default api;