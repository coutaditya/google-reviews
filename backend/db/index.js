const mongoose = require('mongoose');
const { MONGODB_CONNECTION_STRING } = require('../config');

mongoose.connect(MONGODB_CONNECTION_STRING)

const movieSchema = new mongoose.Schema({
    genres: [String],
    title: { 
        type: {
            original_language: String,
            overview: String,
            adult: Boolean,
            genre_ids: [Number],
            google_rating: String 
        }
    }
});

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    movieWishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    }],
    isEditor: {
        type: Boolean,
        default: false
    }
})

const editorsChoiceMovieSchema = new mongoose.Schema({
    editor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    }
})

const Movie = mongoose.model('Movie', movieSchema)
const User = mongoose.model('User', userSchema)
const EditorsChoiceMovie = mongoose.model('EditorsChoiceMovie', editorsChoiceMovieSchema)

module.exports = {
    Movie,
    User,
    EditorsChoiceMovie
}