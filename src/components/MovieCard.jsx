import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material'

function MovieCard({ title, year, rating, description, imageUrl, gpt=false }) {
  return (
    <Card raised style={{ marginTop: '10px' }}>
      <Box display="flex">
        <CardMedia
          component="img"
          alt={title}
          height="140"
          image={imageUrl}
          title="Movie Poster"
          style={{ width: 'auto', maxWidth: gpt ? '200px' : '150px', maxHeight: '200px' }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {year ? `${title} (${year})` : `${title}`}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
          {rating && <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Typography variant="body1">
              Rating: {rating}
            </Typography>
          </Box> }
        </CardContent>
      </Box>
    </Card>
  );
}

export default MovieCard;