import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/system';
import { useRecoilValue } from 'recoil';
import { moviesAtom } from '../store/atoms/atoms';

const CardContainer = styled(Grid)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const itemsPerPage = 10;

const data = [
  {
    id: 1,
    name: 'Godzilla x Kong: The New Empire',
    description:
      'Following their explosive showdown, Godzilla and Kong must reunite against a colossal undiscovered threat hidden within our world, challenging their very existence – and our own.',
    genre_ids: [28, 878, 12],
    google_rating: '4.6',
    language: 'en',
  },
  // Add more movie data as needed
];

const PaginatedCardList = () => {
  const [page, setPage] = useState(1);
  const movies = useRecoilValue(moviesAtom);
  console.log(movies)

  const handleChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(movies.length - 1, startIndex + itemsPerPage);
  const paginatedData = (movies.length == 0) ? movies : movies.slice(startIndex, endIndex);

  return (
    <div>
      <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-around", padding: 5 }}>
        {paginatedData.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <CardContainer>
              <Card>
                <CardContent>
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
