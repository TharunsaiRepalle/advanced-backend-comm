const protobuf = require('protobufjs');

//LOAD THE PROTOCAL BUFFER SCHEMA
protobuf.load('a.proto').then(root => {
    //OBTAIN THE PERSON MESSAGE TYPE.
    const Person = root.lookupType('Person');

    //Create a new person instance.
    const person = { name: "Alice" , age: 21};

    //Serialize Person to the Buffer.
    const buffer = Person.encode(person).finish();
    
    //write buffer to file.
    require('fs').writeFileSync('person.bin',buffer);

    console.log('Person Serilaized and saved to person.bin');

    //Read the buffer from the file.
    const data = require('fs').readFileSync('person.bin');

    //De-Serialize buffer back to a person object.
    const deserializedPerson = Person.decode(data);

    console.log('Person deserialized from person.bin', deserializedPerson);
}).catch(console.error);

