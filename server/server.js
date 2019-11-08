import express from "express";
import bodyParser from "body-parser";
import { ApolloServer } from "apollo-server-express";
import path from 'path';
import omit from 'lodash';

import verifyToken from '../utils/verifyToken';

import schema from "../graphql/executableSchema";

import { config } from "../config";
import { db } from "../db/connect";

const dbUri = config.DB_URI;

// Initialize express
const app = express();

// Connect db
db.connect(dbUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// Initialize body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Apollo server
const server = new ApolloServer({
  schema,
  formatError: err => ({
    message: err.message,
    status: err.status
  }),
  introspection: true,
  context: async ({ req, res }) => {
    const user = await verifyToken(req, res);
    console.log(user);
    return { user };
  }
});


const apiPath = "/graphql";
server.applyMiddleware({ app, apiPath });

app.use('/img/', express.static(path.join(__dirname, '../uploads')));

// PORT
const PORT = process.env.PORT || 3900;
// Listen server
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
