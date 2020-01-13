const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt } = graphql;

const movies = [
    { id: '1', name: 'one', genre: 'oneone', directorId: '1' },
    { id: '2', name: 'two', genre: 'twotwo', directorId: '2' },
    { id: '3', name: 'three', genre: 'threethree', directorId: '3' },
    { id: '4', name: 'four', genre: 'fourfour', directorId: '4' },
];
// // Testing Query
// query($id: ID) {
//     movie(id: $id){
//         id
//         name
//         genre
//     }
// }
//
// {
//     "id": 3
// }

const directors = [
    { id: '1', name: 'Quentin Tarantino', age: 55 },
    { id: '2', name: 'Michael Radford', age: 72 },
    { id: '3', name: 'James McTeigue', age: 51 },
    { id: '4', name: 'Guy Ritchie', age: 50 },
];
// query($id: ID) {
//     movie(id: $id){
//         id
//         name
//         genre
//         director {
//             name
//             age
//         }
//     }
// }

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                return directors.find(director => director.id === parent.id);
            }
        }
    }),
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
    }),
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return movies.find(movie => movie.id === args.id);
            },
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return directors.find(director => director.id === args.id);
            },
        },
    }
});

module.exports = new GraphQLSchema({
    query: Query,
});