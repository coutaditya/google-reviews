import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/system';

const CardContainer = styled(Grid)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const itemsPerPage = 10;

const PaginatedCardList = ({movies}) => {
  const [page, setPage] = useState(1);
  console.log(movies)

  const handleChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(movies.length, startIndex + itemsPerPage);
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
