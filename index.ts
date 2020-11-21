import express, { Request, Response } from 'express';
import settings from './settings';

// Express App
const app = express();
// Mocks
const mockUsers: any[] = [
    { username: 'jlrosasp', email: 'jlrosasp@gamil.com', fullName: 'Jose Luis Rosas Peimbert' },
    { username: 'ofrancol', email: 'ofrancol@gamil.com', fullName: 'Oscar Ivan Franco Lopez' },
    { username: 'rgonzalez', email: 'rgonzalez@gamil.com', fullName: 'Rom Gonzalez Ornelas' },
];
// Serialization on JSON Format
app.use(express.json());

// Rutas de la API
app.get('/testing', (req: Request, res: Response) => {

    res.status(200).json({
        status: 'success',
        code: 200,
        environment: settings.api.environment,
        msg: 'API funcionando de forma correcta !!!'
    });

});

app.get('/getUsers', (req: Request, res: Response) => {

    res.status(200).json(mockUsers);

});

app.get('/getUser/:userName', (req: Request, res: Response) => {

    const { userName } = req.params;

    res.status(200).json({
        userName
    });

});

app.post('/addUser', (req: Request, res: Response) => {

    const {
        userName,
        password,
        email,
        fullName
    } = req.body;

    res.status(201).json({
        status: 'success',
        msj: 'Registro insertado de forma correcta en la Base de Datos !!!',
        userName,
        password,
        email,
        fullName
    });

});

// Listen Express Server
app.listen(settings.api.port, () => {
    console.log(`Servidor Express corriendo en puerto ${settings.api.port}`);
});