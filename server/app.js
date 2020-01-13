const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();
const PORT = 3005;

mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds263368.mlab.com:63368/graphql-tutorial', { useMongoClient: true });

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`));
dbConnection.once('open', () => console.log('Connected to DB!'));

app.listen(PORT, err => {
    err ? console.log(err) : console.log('Server started!');
});