import { Button, Box, Skeleton, Grid, Typography } from '@mui/material';
import GenreFilter from '../components/GenreFilter';
import axios from "axios";
import DisplayResult from '../components/DisplayResult';
import {  useRecoilState, useRecoilValue } from 'recoil';
import { moviesAtom, userAtom, wishlistedMoviesAtom } from '../store/atoms/atoms';
import { useEffect, useState } from 'react';
import { TOKEN_NAME } from '../constants/constants';

export function Wishlist() {
    // const [moviesFetched, setMoviesFetched] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [wishlistedMovies, setWishlistedMovies] = useRecoilState(wishlistedMoviesAtom)
    const user = useRecoilValue(userAtom)

    const fetchData = async () => {
        const res = await axios.get("http://localhost:3000/api/v1/user/wishlist",{
            headers: {
                'Authorization': "Bearer "+localStorage.getItem(TOKEN_NAME)
            }
        })
        setWishlistedMovies(res.data.wishlist)
        console.log(res.data.wishlist)
    }

    useEffect(()=>{
        console.log(user)
        try{
            if(user) {
                setFetching(true)
                setTimeout(async()=>{
                    fetchData()
                    setFetching(false)
                }, 2000)
            } 
        } catch(err){

        }
    }, [user])

    const skeletonArray = Array.from({ length: 9 }, (_, index) => index + 1);

    return (
        <div>
            {(user) ? (fetching) ? 
                <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-around", padding: 5 }}>
                    {skeletonArray.map((index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Skeleton variant="rounded" width="90%" height={200} sx={{ padding: 2 }} />
                        </Grid>
                    ))}
                </Grid>
                : 
                <DisplayResult movies={wishlistedMovies}/>
             : <Typography>Sign in or Sign up to wishlist movies here</Typography>}
        </div>
    );
}
