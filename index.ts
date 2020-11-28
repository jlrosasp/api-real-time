// Imports
import express, { Request, Response } from 'express';
import MongoDBHelper from './helpers/mongodb.helper';
import settings from './settings';
import apiProduct from './routes/product.route';
import apiAuth from './routes/auth.route';
import apiUser from './routes/user.route';
// MongoDB Connect
const mongo = MongoDBHelper.getInstance();
// Express App
const app = express();
// Serialization on JSON Format
app.use(express.json());
// Routes for API
app.use('/v1/product', apiProduct);
app.use('/v1/auth', apiAuth);
app.use('/v1/user', apiUser);
// Start Servers
const startServers = async () => {
    // Connect to MongoDB
    await mongo.connect('dbmtwdm');
    if (mongo.stateConnection === 'success') {
        // Listen Express Server
        app.listen(settings.api.port, () => {
            console.log(`Servidor Express corriendo en puerto ${settings.api.port}`);
        }); 
    } else {
        console.log('Lo sentimos no se puede arrancar el servidor de express hasta que arranque MongoDB');
    }

};
// Execute startServers Function
startServers();