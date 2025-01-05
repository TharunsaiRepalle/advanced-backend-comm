import { createClient } from "redis";

const client = createClient(); 
client.on('error',(err) => console.error('Redis client error', err));

async function processSubmission(submission : string) {
    const { problemId , code , language } = JSON.parse(submission);

    console.log(`problem submission for problemId ${problemId}`);
    console.log(`code: ${code}`)
    console.log(`language: ${language}`)

    //here add actual processing language.
    await new Promise(resolve => setTimeout(resolve,1000));
    console.log(`finished processing problem with problemId ${problemId}`)
}


async function startWorker() {
    try {
        await client.connect();
        console.log('Worker connected to Redis.');

        //main Problem
        while(true) {
            const response = await client.brPop("problems",0)
            //@ts-ignore
            await processSubmission(response?.element)
        }
    } catch(error) {
        console.error('Failed to connect Redis',error)
    }
}

startWorker() 
