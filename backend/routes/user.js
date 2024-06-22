const { Router } = require("express")
const { Movie, User, EditorsChoiceMovie } = require("../db")
const router = Router()
const zod = require("zod")
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config")
const { authMiddleware } = require("../middleware")

const signupSchema = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    email: zod.string().email(),
    password: zod.string()
})

const signinSchema = zod.object({
    email: zod.string().email(),
    password: zod.string()
})

// initial call on each reload to get the isEditor value if token is present
router.get('/', authMiddleware, async (req, res) => {
    try{
        const user = await User.findOne({ _id: req.userId });

        res.json({
            isEditor: user.isEditor
        })
    } catch(err){
        console.log(err)
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get('/movies', async (req, res) => {
    let movie_count = req.query.movie_count || "50";

    if (isNaN(parseInt(movie_count))) {
        movie_count = "50"
    }
    
    const movies = await Movie.find({}).limit(movie_count)

    const transformedMovies = movies.map(movie => {
    const title = Object.keys(movie.toObject()).find(key => key !== '_id' && key !== 'genres');
    const movieData = movie.toObject()[title];
    return {
        _id: movie._id,
        name: title,
        description: movieData.overview,
        language: movieData.original_language,
        genre_ids: movieData.genre_ids,
        google_rating: movieData.google_rating
    };
    });

    res.json({
        movies: transformedMovies
    })
})

router.get('/editor/movies', async (req, res) => {
    try {
        const editorsChoiceMovies = await EditorsChoiceMovie.find().populate('movie');

        const transformedMovies = editorsChoiceMovies.map(editorChoice => {
            const movie = editorChoice.movie;
            const title = Object.keys(movie.toObject()).find(key => key !== '_id' && key !== 'genres');
            const movieData = movie.toObject()[title];
            return {
                _id: movie._id,
                name: title,
                description: movieData.overview,
                language: movieData.original_language,
                genre_ids: movieData.genre_ids,
                google_rating: movieData.google_rating
            };
        });

        res.json({
            movies: transformedMovies
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/signup", async (req, res) => {
    const { success } = signupSchema.safeParse(req.body)

    if(!success){
        return res.status(411).json({
            message: "Incorrect Inputs"
        })
    }

    const existingUser = await User.findOne({
        email: req.body.email
    })

    if(existingUser) {
        return res.status(411).json({
            message: "Username is already taken"
        })
    }

    let isEditor = false;

    if(req.body.hasOwnProperty('isEditor')) {
        isEditor = req.body.isEditor
    }

    const user = await User.create({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        movieWishlist: [],
        isEditor: isEditor
    })

    const userId = user._id
    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        message: "User created successfully",
        token: token,
        isEditor: isEditor
    })
})

router.post("/signin", async (req, res) => {
    const { success } = signinSchema.safeParse(req.body)

    if(!success) {
        return res.status(411).json({
            message: "Invalid Input"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if(!user){
        return res.status(411).json({
            message: "User does not exist"
        })
    }

    const userId = user._id

    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        message: "User signed in successfully",
        token: token,
        isEditor: user.isEditor
    })
})

router.get("/wishlist", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });
        const movies = user.movieWishlist;

        const transformedMovies = await Promise.all(movies.map(async (movieId) => {
            const movie = await Movie.findOne({ _id: movieId });
            if (movie) {
                const title = Object.keys(movie.toObject()).find(key => key !== '_id' && key !== 'genres');
                const movieData = movie.toObject()[title];
                return {
                    _id: movieId,
                    name: title,
                    description: movieData.overview,
                    language: movieData.original_language,
                    genre_ids: movieData.genre_ids,
                    google_rating: movieData.google_rating
                };
            }
        }));

        res.json({ wishlist: transformedMovies.filter(Boolean) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/editor/my_picked_movies', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });
        if (!user.isEditor) {
            return res.status(400).json({ error: "The user does not have editor permissions" });
        }

        const myEditorsChoiceMovies = await EditorsChoiceMovie.find({ editor: req.userId }).populate('movie');

        const transformedMovies = myEditorsChoiceMovies.map(editorChoice => {
            const movie = editorChoice.movie;
            const title = Object.keys(movie.toObject()).find(key => key !== '_id' && key !== 'genres');
            const movieData = movie.toObject()[title];
            return {
                _id: movie._id,
                name: title,
                description: movieData.overview,
                language: movieData.original_language,
                genre_ids: movieData.genre_ids,
                google_rating: movieData.google_rating
            };
        });

        res.json({
            movies: transformedMovies
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/add_movie", authMiddleware, async (req, res) => {
    try {
        const movieId = req.body.movieId;
        const user = await User.findOne({ _id: req.userId });

        if (user.movieWishlist.includes(movieId)) {
            return res.status(400).json({ error: "Movie already exists in the wishlist" });
        }

        const movie = await Movie.findOne({ _id: movieId });
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        await User.updateOne({ _id: req.userId }, { $push: { movieWishlist: movieId } });

        res.json({ message: "Movie added successfully to wishlist" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/remove_movie", authMiddleware, async (req, res) => {
    try {
        const movieId = req.body.movieId;
        const user = await User.findOne({ _id: req.userId });

        if (!user.movieWishlist.includes(movieId)) {
            return res.status(400).json({ error: "Movie not present in the wishlist" });
        }

        const movie = await Movie.findOne({ _id: movieId });
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        await User.updateOne({ _id: req.userId }, { $pull: { movieWishlist: movieId } });

        res.json({ message: "Movie deleted successfully from the wishlist" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.put("/editor/add_movie", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });
        if(!user.isEditor){
            return res.status(400).json({ error: "The user does not have editor permissions" });
        }

        const movieId = req.body.movieId;
        const  movieAlreadyPresent = await EditorsChoiceMovie.findOne({ movie: movieId });

        if (movieAlreadyPresent) {
            return res.status(400).json({ error: "Movie already exists in the editor's choice list" });
        }

        const movie = await Movie.findOne({ _id: movieId });
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        await EditorsChoiceMovie.create({
            editor: req.userId,
            movie: movieId
        });

        res.json({ message: "Movie added successfully to editor's choice list" });
    } catch (error) {
        console.log(error) 
        res.status(500).json({ error: "Internal server error" });
    }
})

router.put("/editor/remove_movie", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });
        if (!user.isEditor) {
            return res.status(400).json({ error: "The user does not have editor permissions" });
        }

        const movieId = req.body.movieId;
        const editorsChoiceMovie = await EditorsChoiceMovie.findOne({ editor: req.userId, movie: movieId });

        if (!editorsChoiceMovie) {
            return res.status(400).json({ error: "The movie is not in your editor's choice list or you did not add it" });
        }

        await EditorsChoiceMovie.deleteOne({ _id: editorsChoiceMovie._id });

        res.json({ message: "Movie removed successfully from editor's choice list" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router