const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID } = graphql;

const movies = [
    { id: '1', name: 'one', genre: 'oneone' },
    { id: '2', name: 'two', genre: 'twotwo' },
    { id: 3, name: 'three', genre: 'threethree' },
    { id: 4, name: 'four', genre: 'fourfour' },
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


const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
    }),
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return movies.find(movie => movie.id == args.id);
            },
        },
    }
});

module.exports = new GraphQLSchema({
    query: Query,
});
