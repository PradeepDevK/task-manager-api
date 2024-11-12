const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
process.env.NODE_ENV = 'test';

beforeAll(async() => {
    mongoServer = await MongoMemoryServer.create();
    const mongoURI = mongoServer.getUri();

    console.log("MongoDB URI for testing:", mongoURI);

    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");
});

afterAll(async() => {
    await mongoose.disconnect();
    await mongoServer.stop();

    console.log("Disconnected from MongoDB");
});

afterEach(async() => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
});