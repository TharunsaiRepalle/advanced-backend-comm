import express from 'express';
import bodyParser from 'body-parser';

const app = express();

//PARSES JSON BODIES.
app.use(bodyParser.json());

//SIMPLE METHOD.
function add(a: string, b: string): Number {
    return parseInt(a) + parseInt(b);
}

//HANDLE JSON RPC REQUESTS.
app.post('/rpc', (req, res) => {
    const { jsonrpc, method, params, id } = req.body;

    if (jsonrpc !== '2.0' && !method && !Array.isArray(params)) {
        res.status(400).json({
            jsonrpc: "2.0", error: {
                code: -32600,
                message: 'Invalid payload!!'
            }
        })
        return;
    }

    //EXECUTE THE METHOD.
    let result;
    switch (method) {
        case 'add':
            result = add(params[0], params[1]);
            break;

        default:
            res.status(404).json({
                code: -32600,
                message: 'method not found!'
            })
            return;
    }

    //SEND BACK THE RESPONSE.
    res.status(200).json({ jsonrpc : '2.0' , result , id });
})

app.listen(3000, () => {
    console.log("app running on port: 3000")
})