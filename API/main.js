import express from 'express';
import mongoose from 'mongoose';
import routes from './Routes/index';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';

let app = express();
app.use(cors());
app.use(bodyParser.json());

dotenv.config({ path: path.join(__dirname, '.env') });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

let conn = 'mongodb://localhost:27017/'
mongoose.connect(conn, {
    useNewUrlParser: true,
    autoIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    keepAlive: true,
    useCreateIndex: true,
    dbName: 'challenge_st'
});
mongoose.connection.on('error', (error) => {
    console.log(error);
    console.error.bind(console, 'connection error:');
});
mongoose.connection.on('connected', () => {
    console.log('Connected to the database.');
});

app.use(routes);

app.use((error, req, res, next) => {
    let status = error.statusCode || 400;
    let errors = error.errors;
    switch (error.name) {
        case 'UnauthorizedError':
            return res.status(401).json({
                message: 'You have no authorization to access this.',
                statusCode: 401
            });
        case 'ValidationError':
            return res.status(400).json({
                message: 'Validation error.',
                errors,
                statusCode: 400
            });
        default:
            return res.status(status).json({
                message: error.message,
                errors: error.message,
                statusCode: status
            });
    }
});

const port = 5001;
app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});

export { app }
