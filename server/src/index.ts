import express from 'express';
import bodyparser from 'body-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import mongodb from 'mongodb';
import bcrypt from 'bcrypt';

dotenv.config();
const app = express();
const mongodbClient = mongodb.MongoClient;
app.use(bodyparser.json());
app.use(cors());
app.options('*', cors());

// console.log(process.env.JWT_SECRET);

if (!process.env.MONGODB_SERVER || !process.env.MONGODB_DB) {
    throw 'Mongo DB server not configured.';
}

if (!process.env.PASSWORD_SALT) {
    throw 'Salt not configured.';
}

app.post('/login', async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.sendStatus(401);
        return;
    }

    const user = await findOne('users', {
        email: req.body.email,
        password: await hashPassword(req.body.password),
    });

    if (!user) {
        res.sendStatus(401);
        return;
    }

    const token = jwt.sign(user.email, process.env.JWT_SECRET as string);
    res.json({
        token: token,
    });
});

app.get('/me', async (req, res) => {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    //decode JWT
    const email = jwt.decode(
        req.headers.authorization.split(' ').pop() as string,
    );

    if (!email) {
        res.sendStatus(401);
        return;
    }

    const user = await findOne('users', {
        email: email,
    });

    res.json({
        id: user._id,
        email: user.email,
        admin: user.admin,
    });
});

app.get('/add-admin', async (req, res) => {
    const email = `${Math.random()
        .toString(36)
        .substring(7)}@${Math.random().toString(36).substring(7)}.com`;
    const pass = Math.random().toString(36).substring(7);
    const result = await insert('users', {
        email: email,
        password: await hashPassword(pass),
        admin: true,
    });

    res.send(`email: ${email}<br />pass: ${pass}`);
});

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, process.env.PASSWORD_SALT as string);
}

async function findOne(collection: string, query: Record<any, any>) {
    const client = await mongodbClient.connect(
        process.env.MONGODB_SERVER as string,
        {
            useUnifiedTopology: true,
        },
    );

    if (!client) {
        throw new Error('Failed to connect to mongoDB server.');
    }

    const db = client.db(process.env.MONGODB_DB);
    const result = await db.collection(collection).findOne(query);
    client.close();
    return result;
}

async function insert(collection: string, query: Record<any, any>) {
    const client = await mongodbClient.connect(
        process.env.MONGODB_SERVER as string,
        {
            useUnifiedTopology: true,
        },
    );

    if (!client) {
        throw new Error('Failed to connect to mongoDB server.');
    }

    const db = client.db(process.env.MONGODB_DB);
    const result = await db.collection(collection).insertOne(query);
    client.close();
    return result;
}

app.listen(3001, () => console.log('App started.'));
