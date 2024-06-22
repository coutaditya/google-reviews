import { Button, Box, Skeleton, Grid, Typography } from '@mui/material';
import { useRecoilState, useRecoilValue } from "recoil";
import { editorsChoiceMoviesAtom, userAtom } from "../store/atoms/atoms";
import DisplayResult from '../components/DisplayResult';
import { useEffect, useState } from "react";
import axios from "axios";

export function Homepage () {
    const [fetching, setFetching] = useState(false);
    const [editorsChoiceMovies, setEditorsChoiceMovies] = useRecoilState(editorsChoiceMoviesAtom);
    const user = useRecoilValue(userAtom);

    const fetchData = async () => {
        const res = await axios.get("http://localhost:3000/api/v1/user/editor/movies");
        setEditorsChoiceMovies(res.data.movies);
        console.log("editor's choice movies:")
        console.log(res.data.movies);
    };

    useEffect(()=>{
        console.log(user);
        try {
            if (user) {
                setFetching(true);
                setTimeout(async()=>{
                    fetchData();
                    setFetching(false);
                }, 2000);
            } 
        } catch (err) {
            console.error(err);
        }
    }, [user]);

    const skeletonArray = Array.from({ length: 9 }, (_, index) => index + 1);

    return (
        <div>
            <Typography variant="h4" align="center" sx={{ marginTop: 5, marginBottom: 5 }}>
                Editor's Picks
            </Typography>
            {fetching ? 
                <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-around", padding: 5 }}>
                    {skeletonArray.map((index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Skeleton variant="rounded" width="90%" height={200} sx={{ padding: 2 }} />
                        </Grid>
                    ))}
                </Grid>
                : 
                <DisplayResult movies={editorsChoiceMovies}/>}
        </div>
    );
}
