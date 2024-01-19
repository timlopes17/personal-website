import React, { useState, useEffect } from 'react';
import { Button, Autocomplete, Box, TextField, CssBaseline, Grid, Typography, createFilterOptions  } from '@mui/material'
import { darkTheme, lightTheme } from '../Themes';
import { ThemeProvider } from '@mui/material/styles';

const Movies = () => {
    const [useDarkTheme, setUseDarkTheme] = useState(true)
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedMovie1, setSelectedMovie1] = useState(null);
    const [selectedMovie2, setSelectedMovie2] = useState(null);
    const [recMovie, setRecMovie] = useState(null)

    const areBothMoviesSelected = selectedMovie1 && selectedMovie2;
    
    useEffect(() => {
        setLoading(true)
        fetch('http://127.0.0.1:5000/api/movies')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setMovies(data);
            setLoading(false)
        })
        .catch(error => {
            console.log(error)
        });
    }, []);    

    const getImageUrl = (imagePath) => `https://image.tmdb.org/t/p/original${imagePath}`;

    const filterOptions = (options, { inputValue }) => {
        const inputWords = inputValue.trim().toLowerCase().split(/\s+/).filter(word => word);
      
        return options.filter(option => {
          const titleWords = option.title.toLowerCase().split(/\s+/);
          const year = option.release_date.substring(0, 4);
      
          return inputWords.every(inputWord =>
            titleWords.some(titleWord => titleWord === inputWord) || year === inputWord
          );
        }).slice(0, 10); // Limit results to 10
      };

    const handleCombineClick = () => {
        fetch('http://127.0.0.1:5000/api/recommend', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              movie_id1: selectedMovie1.movie_id,
              movie_id2: selectedMovie2.movie_id
            })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
          })
          .then(data => {
            console.log(data); // Process your recommendations here
            setRecMovie(data)
          })
          .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
          });
    };

    const handleChatGPTCombineClick = () => {
        console.log('ChatGPT Combine movies');
        // Implement the logic for ChatGPT to combine movies
    };

    return(
        <ThemeProvider theme={useDarkTheme ? darkTheme : lightTheme}>
            <CssBaseline /> {/* This applies the dark background */}
            <div className="flex flex-col h-screen">
                <div id="first-div" className="flex-1 min-h-screen min-w-screen bg-mygray text-white flex flex-col items-center justify-center">
                    <Typography variant="h3" gutterBottom>
                        Movie Combiner
                    </Typography>
                    {loading ? (<span>Loading...</span>) : (
                    <Box sx={{ width: '100%', maxWidth: '600px', p: 2, '& > *': { mb: 1 } }}>
                        <Autocomplete
                        options={movies}
                        getOptionLabel={(option) => option.title}
                        filterOptions={filterOptions}
                        renderOption={(props, option) => (
                            <li {...props} key={option.id || `${option.title}-${option.release_date}`}>
                                <Grid container alignItems="center" spacing={2}>
                                <Grid item>
                                    <img
                                    src={getImageUrl(option.image)}
                                    alt={option.title}
                                    onError={(e) => {
                                        e.target.onerror = null; // prevents looping
                                        e.target.src = 'path_to_placeholder_image'; // Placeholder image
                                    }}
                                    style={{ width: '50px', height: 'auto' }}
                                    />
                                </Grid>
                                <Grid item xs style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <Typography variant="body1" noWrap>
                                    {`${option.title} (${option.release_date.split('-')[0]})`}
                                    </Typography>
                                </Grid>
                                </Grid>
                            </li>
                        )}
                        renderInput={(params) => <TextField {...params} label="Movie 1" variant="outlined" />}
                        style={{
                            backgroundColor: 'lightgrey', // A lighter background color
                            width: '100%' // Set a specific width
                        }}
                        onChange={(event, newValue) => {
                                    setSelectedMovie1(newValue);
                                }}
                        />

                        <Autocomplete
                        options={movies}
                        getOptionLabel={(option) => option.title}
                        filterOptions={filterOptions}
                        renderOption={(props, option) => (
                            <li {...props} key={option.movie_id}>
                                <Grid container alignItems="center" spacing={2}>
                                <Grid item>
                                    <img
                                    src={getImageUrl(option.image)}
                                    alt={option.title}
                                    onError={(e) => {
                                        e.target.onerror = null; // prevents looping
                                        e.target.src = 'path_to_placeholder_image'; // Placeholder image
                                    }}
                                    style={{ width: '50px', height: 'auto' }}
                                    />
                                </Grid>
                                <Grid item xs style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <Typography variant="body1" noWrap>
                                    {`${option.title} (${option.release_date.split('-')[0]})`}
                                    </Typography>
                                </Grid>
                                </Grid>
                            </li>
                        )}
                        renderInput={(params) => <TextField {...params} label="Movie 2" variant="outlined" />}
                        style={{
                            backgroundColor: 'lightgrey', // A lighter background color
                            width: '100%' // Set a specific width
                        }}
                        onChange={(event, newValue) => {
                                    setSelectedMovie2(newValue);
                                }}
                        />
                        <Button variant="contained" fullWidth onClick={handleCombineClick} disabled={!areBothMoviesSelected}>
                            Combine
                        </Button>
                        <Button variant="contained" fullWidth color="secondary" onClick={handleChatGPTCombineClick} disabled={!areBothMoviesSelected}>
                            ChatGPT Combine
                        </Button>

                    </Box>
                  )}
            </div>
            </div>
        </ThemeProvider>
    )
}

export default Movies