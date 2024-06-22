import { Button, Box, Skeleton, Grid } from '@mui/material';
import GenreFilter from '../components/GenreFilter';
import axios from "axios";
import DisplayResult from '../components/DisplayResult';
import {  useRecoilState } from 'recoil';
import { filteredMoviesAtom, moviesAtom } from '../store/atoms/atoms';
import { useState } from 'react';

export function Search() {
    const [movies, setMovies] = useRecoilState(filteredMoviesAtom)
    const [moviesFetched, setMoviesFetched] = useState(false)
    const [fetching, setFetching] = useState(false)

    const fetchMovies = async () => {
        try {
            setMoviesFetched(true)
            setFetching(true)
            setTimeout(async () => {
                const res = await axios.get("http://localhost:3000/api/v1/user/movies?movie_count=50");
                setMovies(res.data['movies'])
                setFetching(false)
            }, 2000)
            
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    const skeletonArray = Array.from({ length: 9 }, (_, index) => index + 1);

    return (
        <div>
            <Box sx={{ display: "flex", justifyContent: "space-around", padding: 5 }}>
                <GenreFilter />
                <Button variant="outlined" onClick={fetchMovies}>Get Movies</Button>
            </Box>
            {(moviesFetched) ? (fetching) ? 
                <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-around", padding: 5 }}>
                    {skeletonArray.map((index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Skeleton variant="rounded" width="90%" height={200} sx={{ padding: 2 }} />
                        </Grid>
                    ))}
                </Grid>
                : 
                <DisplayResult movies={movies} pageName="search"/>
             : null}
        </div>
    );
}
