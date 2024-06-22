import { Button, Box, Skeleton, Grid, Typography } from '@mui/material';
import axios from "axios";
import DisplayResult from '../components/DisplayResult';
import {  useRecoilState, useRecoilValue } from 'recoil';
import { moviesAtom, userAtom, wishlistedMoviesAtom } from '../store/atoms/atoms';
import { useEffect, useState } from 'react';
import { TOKEN_NAME } from '../constants/constants';

export function Wishlist() {
    const [fetching, setFetching] = useState(false)
    const [wishlistedMovies, setWishlistedMovies] = useRecoilState(wishlistedMoviesAtom)
    const user = useRecoilValue(userAtom)

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/v1/user/wishlist",{
                headers: {
                    'Authorization': "Bearer "+localStorage.getItem(TOKEN_NAME)
                }
            })
            setWishlistedMovies(res.data.wishlist)
            console.log(`${res.data.wishlist}`)
        } catch(err) {
            console.log(err.response.data.message)
        }
    }

    useEffect(()=>{
        console.log(`user atom:`)
        console.log(user)
        try{
            if(user.token) {
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
            {(user.token) ? (fetching) ? 
                <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-around", padding: 5 }}>
                    {skeletonArray.map((index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Skeleton variant="rounded" width="90%" height={200} sx={{ padding: 2 }} />
                        </Grid>
                    ))}
                </Grid>
                : 
                <DisplayResult movies={wishlistedMovies} pageName="wishlist"/>
             : <Typography align="center" sx={{ marginTop: 2, marginBottom: 2 }}>Sign in or Sign up to wishlist movies here</Typography>}
        </div>
    );
}
