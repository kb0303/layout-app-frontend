import express from 'express';
import cors from 'cors'
import './env.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToMongoDb } from './config/mongodb.js';
import IntroRouter from './src/features/introduction/intro.routes.js';
// import bodyParser from 'body-parser';

const server = express();

const __filename = fileURLToPath(import.meta.url); // Define __filename using fileURLToPath
const __dirname = path.dirname(__filename); // Define __dirname using path.dirname

// loading environment variables

// CORS Policy Configuration
server.use(cors());

server.use(express.json());

// Serve static files from the 'uploads' directory
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// for all requests related to data of draggable component1.
server.use("/api/data1", IntroRouter)

// Default request handler
server.get("/", (req, res) => {
	res.send("Welcome to Draggy")
})

const port = process.env.PORT || 8080;
server.listen(port, () => {
	console.log(`Server is listening on port: ${port}`);
	connectToMongoDb();
});

export default server;
