import express, { Request, Response } from 'express'

import { createClient } from 'redis';

const app = express();
app.use(express.json());

const client = createClient();

client.on('error',(err) => console.error('Redis client error', err));

app.post('/submit', async function (req: Request, res: Response) {
    const  { problemId , code , language } = req.body;

    try {
        await client.lPush("problems", JSON.stringify({
            code , language , problemId
        }));
        res.status(200).send("Submission received and stored.")
    } catch (err) {
        console.error("Redis error:", err);
        res.status(500).send("failed to store submission")
    }

})

async function startServer() {
    try {
        await client.connect();
        console.log('connected to redis');

        app.listen(3000, () => {
            console.log('Server running on port 3000')
        })
    } catch (err) {
        console.error('Failed to connect redis', err)
    }
}

startServer()