import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, IconButton, Tooltip } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'
import { TOKEN_NAME } from '../constants/constants';
import { useSetRecoilState } from 'recoil';
import { wishlistedMoviesAtom } from '../store/atoms/atoms';

const CardContainer = styled(Grid)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
}));

const ButtonStyle = styled(IconButton)({
  position: 'absolute',
  top: '2px',
  right: '2px',
  zIndex: 0,
  backgroundColor: 'transparent'
});

const itemsPerPage = 10;

const ActionButton = ({ movie, pageName }) => {
  const setWishlistedMovies = useSetRecoilState(wishlistedMoviesAtom)
  // const set

  const refreshList = async (endpoint) => {
    try{
      const res = await axios.get(`http://localhost:3000/api/v1/user/${endpoint}`,{
        headers: {
            'Authorization': "Bearer "+localStorage.getItem(TOKEN_NAME)
        }
    })
    setWishlistedMovies(res.data.wishlist)
    } catch(err) {
      console.log(err)
    }
  }

  const handleClick = async (movie, endpoint, successMessage) => {
    console.log(movie)
    try{
      let res;
      if(pageName==="mypicks"){
        res = await axios.put(`http://localhost:3000/api/v1/user/${endpoint}`, { movieId: movie._id }, {
          headers: {
            'Authorization': "Bearer "+localStorage.getItem(TOKEN_NAME)
          }
        })
        await refreshList("editor/my_picked_movies")
      }
      else{
        res = await axios.put(`http://localhost:3000/api/v1/user/${endpoint}`, { movieId: movie._id }, {
          headers: {
            'Authorization': "Bearer "+localStorage.getItem(TOKEN_NAME)
          }
        })
        await refreshList("wishlist")
      } 
      console.log(res)
      
      alert(successMessage)
      
    } catch(err){
      console.log(err.response.data.error)
      if(err.response.data.error==="Invalid Token"){
        alert("Log in to add movies to your wishlist")
      }
      else{
        alert(err.response.data.error)
      }
    }
  };

  if(pageName==="wishlist") 
    return  <Tooltip title="Remove from wishlist" arrow>
              <ButtonStyle onClick={async () => { await handleClick(movie, "remove_movie", "Movie removed from your wishlist")}}>
                <CloseIcon />
              </ButtonStyle>
            </Tooltip>
  else if(pageName==="mypicks")
    return  <Tooltip title="Remove from your picks" arrow>
              <ButtonStyle onClick={async () => { await handleClick(movie, "editor/remove_movie", "Movie removed from your picks")}}>
                <CloseIcon />
              </ButtonStyle>
            </Tooltip>
  else
  return  <Tooltip title="Add to wishlist" arrow>
            <ButtonStyle onClick={async () => { await handleClick(movie, "add_movie", "Movie added to your wishlist")}}>
              <AddIcon />
            </ButtonStyle>
          </Tooltip> 
}

const PaginatedCardList = ({ movies, pageName }) => {
  const [page, setPage] = useState(1);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(movies.length, startIndex + itemsPerPage);
  const paginatedData = movies.length === 0 ? movies : movies.slice(startIndex, endIndex);

  useEffect(() => console.log(`pagename = ${pageName}`), [])

  return (
    <div>
      <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-around", padding: 5 }}>
        {paginatedData.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <CardContainer>
              <Card>
                <CardContent>
                  <ActionButton movie={item} pageName={pageName}/>
                  <Typography variant="h5" component="h2" gutterBottom>
                    <strong>{item.name}</strong>
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Language: {item.language}
                  </Typography>
                  <Typography variant="body2" component="p" gutterBottom>
                    {item.description}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Genres: {item.genre_ids.join(', ')}
                  </Typography>
                  <Typography color="textSecondary">
                    <strong>Google Rating: {item.google_rating} </strong>
                  </Typography>
                </CardContent>
              </Card>
            </CardContainer>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={Math.ceil(movies.length / itemsPerPage)}
        page={page}
        onChange={handleChange}
        variant="outlined"
        shape="rounded"
        size="large"
        sx={{ display: "flex", justifyContent: "space-around", padding: 5 }}
      />
    </div>
  );
};

export default PaginatedCardList;
