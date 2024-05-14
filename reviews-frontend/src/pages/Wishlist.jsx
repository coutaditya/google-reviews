import { Button, Box, Skeleton, Grid } from '@mui/material';
import GenreFilter from '../components/GenreFilter';
import axios from "axios";
import DisplayResult from '../components/DisplayResult';
import {  useRecoilState } from 'recoil';
import { moviesAtom } from '../store/atoms/atoms';
import { useEffect, useState } from 'react';

export function Wishlist() {
    const [moviesFetched, setMoviesFetched] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [wishlistedMovies, setWishlistedMovies] = useState([])

    const fetchData = async () => {
        const token = localStorage.getItem('google-reviews-jwt-token')
        console.log(token)
        const res = await axios.get("http://localhost:3000/api/v1/user/wishlist",{
            headers: {
                'Authorization': "Bearer "+token
            }
        })
        setWishlistedMovies(res.data.wishlist)
        console.log(res.data.wishlist)
    }

    useEffect(()=>{
        try{
            setMoviesFetched(true)
            setFetching(true)
            setTimeout(async()=>{
                fetchData()
                setFetching(false)
            }, 2000)
        } catch(err){

        }
    }, [])

    const skeletonArray = Array.from({ length: 9 }, (_, index) => index + 1);

    return (
        <div>
            {(moviesFetched) ? (fetching) ? 
                <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-around", padding: 5 }}>
                    {skeletonArray.map((index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Skeleton variant="rounded" width="90%" height={200} sx={{ padding: 2 }} />
                        </Grid>
                    ))}
                </Grid>
                : 
                <DisplayResult movies={wishlistedMovies}/>
             : null}
        </div>
    );
}
