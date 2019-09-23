import express from 'express';
import bodyParser from 'body-parser';

import { config } from '../config';

import { db } from '../db/connect';

const dbUri = config.DB_URI;

// Initialize express
const app = express();


// Connect db
db.connect(dbUri, {useNewUrlParser: true});

// Initialize body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => res.json({ msg: "hello " }));

// PORT
const PORT = process.env.PORT || 3900;
// Listen server
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`))
