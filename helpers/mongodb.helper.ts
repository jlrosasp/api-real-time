import { MongoClient, MongoClientOptions } from 'mongodb';
import api from '../routes/product.route';
import settings from '../settings';

export default class MongoDBHelper {

    public db: any;
    public stateConnection: string = '';

    private static _instance: MongoDBHelper;
    private cnn: any;
    private dbUri: string;
    constructor(isAuth: boolean = false) {
        if (isAuth) {
            this.dbUri = `mongodb://${settings.mongodb.userName}:${settings.mongodb.password}@${settings.mongodb.host}:${settings.mongodb.port}`;
        } else {
            this.dbUri = `mongodb://${settings.mongodb.host}:${settings.mongodb.port}`;
        }
    };

    public static getInstance(isAuth: boolean = false) {
        return this._instance || (this._instance = new this(isAuth));
    }
    public async connect(dataBase: string, options: MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true }) {
        
        const result = await MongoClient.connect(this.dbUri, options)
            .then((cnn: any) => {
                return { status: 'success', cnn, err: null, msg: 'Conexión a MongoDB realizada de forma correcta !!!' };
            })
            .catch((err: any) => {
                return { status: 'error', cnn: null, err, msg: 'Ocurrio un Error al intentar establecer conexión con MongoDB' };
            });


        this.stateConnection = result.status;
        if(result.status === 'success') {
            console.log(`Servidor MongoDB corriendo en puerto ${settings.mongodb.port}`);
            this.cnn = result.cnn;
            this.db = this.cnn.db(dataBase);
        } else {
            this.cnn = null;
            this.db = null;
        }

    }
    public setDataBase(dataBase: string) {
        this.db = this.cnn.db(dataBase);
    }
    public async disconnect() {
        this.cnn.close();
    }

}