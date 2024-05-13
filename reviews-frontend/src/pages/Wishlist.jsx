import { useEffect, useState } from "react"
import axios from "axios"

export function Wishlist() {
    const [wishlistedMovies, setWishlistedMovies] = useState([])

    const fetchData = async () => {
        const token = localStorage.getItem('google-reviews-jwt-token')
        const res = await axios.get("http://localhost:3000/api/v1/user/wishlist",{
                headers: "Bearer "+token
        })
        console.log(res.data)
    }

    useEffect(()=>{
        

        try{
            fetchData()
        } catch(err){

        }
    }, [])

    return <div>Wishlist</div>
}