import { Router, Request, Response, NextFunction } from 'express';
import MongoDBHelper from '../helpers/mongodb.helper';
import settings from '../settings';
import paginate from 'jw-paginate';

const api = Router();
const mongo = MongoDBHelper.getInstance();

api.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.status(200).json({
        status: 'success',
        code: 200,
        environment: settings.api.environment,
        msg: 'API Product Works Successfully !!!'
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
    const count: any = await mongo.db.collection('product').find({descripcion: search}).toArray();
    result.totalRows = count.length;
    result.data = await mongo.db.collection('product').find({descripcion: search}).skip(skips).limit(parseInt(pageSize)).toArray();

    result.pager = paginate(result.totalRows, parseInt(pageNumber), parseInt(pageSize), 5);

    res.status(200).json({
        status: 'success',
        code: 200,
        environment: settings.api.environment,
        msg: `Se obtuvieron resultados para el criterio ${criterio}`,
        data: result
    });
});


api.get('/getById', async(req: Request, res: Response, next: NextFunction) => {
    
});

api.post('/add', async(req: Request, res: Response, next: NextFunction) => {

});

api.post('/edit', async(req: Request, res: Response, next: NextFunction) => {

});

api.post('/remove', async(req: Request, res: Response, next: NextFunction) => {

});

export default api;