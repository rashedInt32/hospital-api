import express from "express";
import bodyParser from "body-parser";
import { ApolloServer } from "apollo-server-express";

import schema from "../graphql/executableSchema";

import { config } from "../config";
import { db } from "../db/connect";

const dbUri = config.DB_URI;

// Initialize express
const app = express();

// Connect db
db.connect(dbUri, {
  useNewUrlParser: true,
  useCreateIndex: true
});

// Initialize body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Apollo server
const server = new ApolloServer({
  schema,
  formatError: err => {
    // Don't give the specific errors to the client.
    if (err.message.startsWith("Database Error: ")) {
      return new Error("Internal server error");
    }

    // Otherwise return the original error.  The error can also
    // be manipulated in other ways, so long as it's returned.
    return err;
  }
});

const path = "/graphql";
server.applyMiddleware({ app, path });

// PORT
const PORT = process.env.PORT || 3900;
// Listen server
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
