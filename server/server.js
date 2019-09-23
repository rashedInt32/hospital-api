import express from 'express';
import bodyParser from 'body-parser';
import throng from 'throng';
import { ApolloServer } from 'apollo-server-express';

import schema from '../graphql/executableSchema';

import { config } from '../config';
import { db } from '../db/connect';

const dbUri = config.DB_URI;

const WORKERS = process.env.WEB_CONCURRENCY || 1;

const startApp = () => {
  // Initialize express
  const app = express();

  // Connect db
  db.connect(dbUri, { useNewUrlParser: true });

  // Initialize body parser
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());


  // Apollo server
  const server = new ApolloServer({
    schema
  });

  const path = '/graphql';
  server.applyMiddleware({app, path})


  // PORT
  const PORT = process.env.PORT || 3900;
  // Listen server
  app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
};


throng(WORKERS, startApp);
