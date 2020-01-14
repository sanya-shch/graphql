const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

const Movies = require('../models/movie');
const Directors = require('../models/director');

// const movies = [
//     { id: '1', name: 'one', genre: 'oneone', directorId: '1' },
//     { id: '2', name: 'two', genre: 'twotwo', directorId: '2' },
//     { id: '3', name: 'three', genre: 'threethree', directorId: '3' },
//     { id: '4', name: 'four', genre: 'fourfour', directorId: '4' },
//     { id: '5', name: 'one2', genre: 'oneone2', directorId: '1' },
//     { id: '6', name: 'two2', genre: 'twotwo2', directorId: '1' },
//     { id: '7', name: 'three2', genre: 'threethree2', directorId: '3' },
//     { id: '8', name: 'four2', genre: 'fourfour2', directorId: '3' },
// ];
// const directors = [
//     { id: '1', name: 'Quentin Tarantino', age: 55 },
//     { id: '2', name: 'Michael Radford', age: 72 },
//     { id: '3', name: 'James McTeigue', age: 51 },
//     { id: '4', name: 'Guy Ritchie', age: 50 },
// ];
// // // Testing Query
// // query($id: ID) {
// //     movie(id: $id){
// //         id
// //         name
// //         genre
// //     }
// // }
// //
// // {
// //     "id": 3
// // }
// // // ******************
// // query($id: ID) {
// //     movie(id: $id){
// //         id
// //         name
// //         genre
// //         director {
// //             name
// //             age
// //         }
// //     }
// // }
// // // *******************
// // query {
// //     directors {
// //         id
// //         name
// //         age
// //     }
// // }
// // // *******************
// // query ($id: ID) {
// //     director (id: $id){
// //         id
// //         name
// //         movies {
// //             name
// //         }
// //     }
// // }

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                // return directors.find(director => director.id === parent.id);
                return Directors.findById(parent.directorId);
            }
        }
    }),
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies.filter(movie => movie.directorId === parent.id);
                return Movies.find({ directorId: parent.id });
            },
        },
    }),
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return movies.find(movie => movie.id === args.id);
                return Movies.findById(args.id);
            },
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return directors.find(director => director.id === args.id);
                return Directors.findById(args.id);
            },
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies;
                return Movies.find({});
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                // return directors;
                return Directors.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }, // name: { type: GraphQLString },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                const director = new Directors({
                    name: args.name,
                    age: args.age,
                });
                return director.save();
            },
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLID },
            },
            resolve(parent, args) {
                const movie = new Movies({
                    name: args.name,
                    genre: args.genre,
                    directorId: args.directorId,
                });
                return movie.save();
            },
        },
        deleteDirector: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Directors.findByIdAndRemove(args.id);
            }
        },
        deleteMovie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Movies.findByIdAndRemove(args.id);
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                return Directors.findByIdAndUpdate(
                    args.id,
                    { $set: { name: args.name, age: args.age } },
                    { new: true },
                );
            },
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLID },
            },
            resolve(parent, args) {
                return Movies.findByIdAndUpdate(
                    args.id,
                    { $set: { name: args.name, genre: args.genre, directorId: args.directorId } },
                    { new: true },
                );
            },
        },
    }
});
// mutation($name: String, $age: Int) {
//     addDirector(name: $name, age: $age) {
//         name
//         age
//     }
// }

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});