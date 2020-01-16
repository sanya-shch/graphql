const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = graphql;

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
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        rate: { type: GraphQLInt },
        // director: {
        //     type: DirectorType,
        //     resolve(parent, args) {
        //         // return directors.find(director => director.id === parent.id);
        //         return Directors.findById(parent.directorId);
        //     }
        // }
        director: {
            type: DirectorType,
            resolve({ directorId }, args) {
                return Directors.findById(directorId);
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
            resolve({ id }, args) {
                return Movies.find({ directorId: id });
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
            resolve(parent, { id }) {
                // return movies.find(movie => movie.id === args.id);
                return Movies.findById(id);
            },
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                // return directors.find(director => director.id === args.id);
                return Directors.findById(id);
            },
        },
        movies: {
            type: new GraphQLList(MovieType),
            args: { name: { type: GraphQLString } },
            resolve(parent, { name }) {
                return Movies.find({ name: { $regex: name, $options: "i" } });
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            args: { name: { type: GraphQLString } },
            resolve(parent, { name }) {
                return Directors.find({ name: { $regex: name, $options: "i" } });
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
            resolve(parent, { name, age }) {
                const director = new Directors({
                    name,
                    age,
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
                watched: { type: new GraphQLNonNull(GraphQLBoolean) },
                rate: { type: GraphQLInt },
            },
            resolve(parent, { name, genre, directorId, watched, rate }) {
                const movie = new Movies({
                    name,
                    genre,
                    directorId,
                    watched,
                    rate,
                });
                return movie.save();
            },
        },
        deleteDirector: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                return Directors.findByIdAndRemove(id);
            }
        },
        deleteMovie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                return Movies.findByIdAndRemove(id);
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, { id, name, age }) {
                return Directors.findByIdAndUpdate(
                    id,
                    { $set: { name, age } },
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
                watched: { type: new GraphQLNonNull(GraphQLBoolean) },
                rate: { type: GraphQLInt },
            },
            resolve(parent, { id, name, genre, directorId, watched, rate }) {
                return Movies.findByIdAndUpdate(
                    id,
                    { $set: { name, genre, directorId, watched, rate } },
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