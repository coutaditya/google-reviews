import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Autocomplete, Skeleton, TextField, Button, Box, Grid, Typography } from '@mui/material';
import { useRecoilValue, useRecoilState } from 'recoil';
import { myEditorsChoiceMoviesAtom, userAtom } from '../store/atoms/atoms';
import { TOKEN_NAME } from '../constants/constants';
import DisplayResult from '../components/DisplayResult';

const MyPicks = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const user = useRecoilValue(userAtom);

    const [fetching, setFetching] = useState(false);
    const [myEditorsChoiceMovies, setMyEditorsChoiceMovies] = useRecoilState(myEditorsChoiceMoviesAtom);

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/v1/user/editor/my_picked_movies", {
                headers: {
                    'Authorization': "Bearer " + localStorage.getItem(TOKEN_NAME)
                }
            });
            setMyEditorsChoiceMovies(res.data.movies);
            console.log(res.data.movies);
        } catch (error) {
            console.error("Error fetching my picked movies:", error);
        }
    };

    useEffect(() => {
        console.log(user);
        if (user) {
            setFetching(true);
            setTimeout(async () => {
                await fetchData();
                setFetching(false);
            }, 2000);
        }
    }, [user]);

    // fetch all movies to be displayed in the autocomplete list
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/v1/user/movies");
                const allMovies = res.data.movies;
                const filteredMovies = allMovies.filter(
                    (movie) => !myEditorsChoiceMovies.some((editorMovie) => editorMovie._id === movie._id)
                );
                setMovies(filteredMovies);
                console.log(filteredMovies);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };

        fetchMovies();
    }, [myEditorsChoiceMovies]);

    const handleAddMovie = async () => {
        if (selectedMovie) {
            try {
                await axios.put("http://localhost:3000/api/v1/user/editor/add_movie", { movieId: selectedMovie._id }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(TOKEN_NAME)}`
                    }
                });
                alert("Movie added successfully to your picks!");
                // Refresh the list of my picked movies
                await fetchData(); 
            } catch (error) {
                console.error(error.response.data.error);
                alert(`Error adding movie to editor's pick: ${error.response.data.error}`);
            }
        } else {
            alert("Please select a movie to add.");
        }
    };

    const skeletonArray = Array.from({ length: 9 }, (_, index) => index + 1);

    return (
        <>
            <Box sx={{ padding: 5 }}>
                <Typography variant="h4" align="center" sx={{ marginBottom: 5 }}>
                    My Picks
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={8} md={6}>
                        <Autocomplete
                            options={movies}
                            getOptionLabel={(movie) => movie.name}
                            onChange={(event, newValue) => setSelectedMovie(newValue)}
                            renderInput={(params) => <TextField {...params} label="Select a movie to add to editor's choice" variant="outlined" />}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleAddMovie}>
                            Add
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Box>
                {fetching ? 
                    <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-around", padding: 5 }}>
                        {skeletonArray.map((index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Skeleton variant="rounded" width="90%" height={200} sx={{ padding: 2 }} />
                            </Grid>
                        ))}
                    </Grid>
                    : 
                    <DisplayResult movies={myEditorsChoiceMovies}/>}
            </Box>
        </>
    );
};

export default MyPicks;
