import { NextFunction, Request, Response, Router } from 'express';
import mongoClient from 'mongodb';
import bcrypt from 'bcryptjs';
import MongoDBHelper from '../helpers/mongodb.helper';
import settings from '../settings';
import paginate from 'jw-paginate';
import fileUpload, { UploadedFile } from 'express-fileupload';

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

api.get('/getAll/:pageNumber/:pageSize/:criterio', async(req: Request, res: Response, next: NextFunction) => {
    
    const { pageNumber, pageSize, criterio } = req.params;

    mongo.setDataBase('dbmtwdm');
    const skips = parseInt(pageSize) * (parseInt(pageNumber) - 1);
    const data: any[] = [];
    let result = {
        totalRows: 0,
        data,
        pager: {} 
    } 

    const search = new RegExp(criterio, 'mi');
    const count: any = await mongo.db.collection('user').find({fullName: search}).toArray();
    result.totalRows = count.length;
    result.data = await mongo.db.collection('user').find({fullName: search}).skip(skips).limit(parseInt(pageSize)).toArray();

    result.pager = paginate(result.totalRows, parseInt(pageNumber), parseInt(pageSize), 5);

    res.status(200).json({
        status: 'success',
        code: 200,
        environment: settings.api.environment,
        msg: `Se obtuvieron resultados para el criterio ${criterio}`,
        data: result
    });
});

api.post('/getById', async(req: Request, res: Response, next: NextFunction) => {
    const { uid } = req.body;
    const _id = new mongoClient.ObjectID(uid);

    mongo.setDataBase('dbmtwdm');
    const user: any = await mongo.db.collection('user').findOne({_id});

    res.status(200).json({
        status: 'success',
        code: 200,
        environment: settings.api.environment,
        msg: `Se encontro el registro con Id ${uid}`,
        data: user
    });
});

api.post('/getByEmail', async(req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    mongo.setDataBase('dbmtwdm');
    const user: any = await mongo.db.collection('user').findOne({email});

    res.status(200).json({
        status: 'success',
        code: 200,
        environment: settings.api.environment,
        msg: `Se encontro el correo ${email}`,
        data: user
    });
});

api.post('/upload', async(req: Request, res: Response, next: NextFunction) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            status: 'Bad Request',
            code: 400,
            environment: settings.api.environment,
            msg: `Es necesario adjuntar por lo menos 1 archivos`
        });
    }
    
    // Multiples Archivos en un Arreglo
    let files:any = req.files.attachments;

    files.forEach((file:any) => {
        file.mv(`./uploads/${file.name}`, (err: any) => {
            if (err) {
                return res.status(500).json({
                    status: 'Internal Server Error',
                    code: 500,
                    environment: settings.api.environment,
                    msg: `Ocurrio un error al intentar guardar el archivo en el servidor`
                });
            }
        });    
    });


    
    // Un solo archivo
    // let fileError = req.files.error;

    // // Use the mv() method to place the file somewhere on your server
    // fileError.mv(`./uploads/${fileError.name}`, (err: any) => {
    //     if (err) {
    //         return res.status(500).json({
    //             status: 'Internal Server Error',
    //             code: 500,
    //             environment: settings.api.environment,
    //             msg: `Ocurrio un error al intentar guardar el archivo en el servidor`
    //         });
    //     }
    // });   

    res.status(200).json({
        status: 'success',
        code: 200,
        environment: settings.api.environment,
        msg: `El archivo se cargo de forma correcta`
    });    

});


api.post('/add', async(req: Request, res: Response, next: NextFunction) => {
    const { email, password, fullName, photo } = req.body;
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(password, salt);


    // Insert User on MongoDB
    mongo.setDataBase('dbmtwdm')
    const result: any = await mongo.db.collection('user').insertOne({
        email, password: hash, fullName, photo
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

api.put('/edit', async(req: Request, res: Response, next: NextFunction) => {
    const { uid, email, fullName, photo } = req.body;
    const _id = new mongoClient.ObjectID(uid);

    mongo.setDataBase('dbmtwdm');
    const user: any = await mongo.db.collection('user').findOneAndUpdate(
        { _id },
        {
            $set: { email, fullName, photo }
        }
    );

    res.status(200).json({
        status: 'success',
        code: 200,
        environment: settings.api.environment,
        msg: `Datos del usuario ${fullName} modificados de forma correcta`,
        data: user
    });
});

api.delete('/remove', async(req: Request, res: Response, next: NextFunction) => {
    // TO DO Logic Remove with findOneAndUpdate

    const { uid } = req.body;
    const _id = new mongoClient.ObjectID(uid);

    mongo.setDataBase('dbmtwdm');
    const user: any = await mongo.db.collection('user').deleteOne({_id});

    res.status(200).json({
        status: 'success',
        code: 200,
        environment: settings.api.environment,
        msg: `El registro con Id ${uid} ha sido eliminado`,
        data: user
    });

}); 


export default api;