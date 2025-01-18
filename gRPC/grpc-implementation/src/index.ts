import path from 'path';
import * as grpc from '@grpc/grpc-js';
import { GrpcObject , ServiceClientConstructor } from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const packageDefination = protoLoader.loadSync(path.join(__dirname,'../src/a.proto'));

const personProto = grpc.loadPackageDefinition(packageDefination);

const Persons = [
    {
        name: "John",
        age: 45
    },
     {
        name: "Alice",
        age: 50
     }
]

//@ts-ignore
function addPerson(call , callback) {
    console.log(call);
    let person = {
        name : call.request.name,
        age: call.request.age
    }

    Persons.push(person);
    callback(null,person)
}

//@ts-ignore
function getPersonByNameHandler(call , callback) {
    const name = call.request.name;
    const person = Persons.find(x => x.name === name);
    callback(null , person);
}

const server = new grpc.Server();

server.addService((personProto.AddressBookService as ServiceClientConstructor).service, { addPerson : addPerson});

//@ts-ignore
// server.addService(personProto.AddressBookService.service , { 
//     Addperson: addPerson,
//     GetPersonByName : getPersonByNameHandler,
// })

server.bindAsync('0.0.0.0:50051',grpc.ServerCredentials.createInsecure() ,() => {
    server.start();
})