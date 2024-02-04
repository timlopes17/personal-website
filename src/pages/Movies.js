import React, { useState, useEffect } from 'react';
import { Button, Autocomplete, Box, TextField, CssBaseline, Grid, Typography  } from '@mui/material'
import { darkTheme } from '../Themes';
import { ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import MovieCard from '../components/MovieCard';

const Movies = () => {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedMovie1, setSelectedMovie1] = useState(null);
    const [selectedMovie2, setSelectedMovie2] = useState(null);
    const [recMovie, setRecMovie] = useState(null)
    const [gptMovie, setGptMovie] = useState(null)
    const [gptLoading, setGptLoading] = useState(false)

    const areBothMoviesSelected = selectedMovie1 && selectedMovie2;
    
    useEffect(() => {
        document.title = "Movie Matchmaker";
        setLoading(true)
        fetch('https://api-67g7vi5kza-ue.a.run.app/api/movies')
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
        setRecMovie(null)
        setGptMovie(null)
        setGptLoading(false)
        fetch('https://api-67g7vi5kza-ue.a.run.app/api/recommend', {
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
            console.log(data);
            setRecMovie(data)
          })
          .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
          });
    };

    const handleChatGPTCombineClick = () => {
        setRecMovie(null)
        setGptMovie(null)
        setGptLoading(true)
        fetch('https://api-67g7vi5kza-ue.a.run.app/api/gpt_movie', {
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
            console.log(data);
            setGptLoading(false)
            setGptMovie(data)
          })
          .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
          });
    };

    return(
        <ThemeProvider theme={darkTheme}>
            <CssBaseline /> {/* This applies the dark background */}
            <div className="flex flex-col">
                <div id="first-div" className="flex-1 min-h-screen min-w-screen bg-mygray text-white flex flex-col items-center justify-center">
                    <Typography variant="h3" gutterBottom>
                        Movie Matchmaker
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
                            width: '100%' // Set a specific width
                        }}
                        onChange={(event, newValue) => {
                                    setSelectedMovie1(newValue);
                                    setRecMovie(null)
                                    setGptMovie(null)
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
                            width: '100%' // Set a specific width
                        }}
                        onChange={(event, newValue) => {
                                    setSelectedMovie2(newValue);
                                    setRecMovie(null)
                                    setGptMovie(null)
                                }}
                        />
                        <Button variant="outlined" fullWidth onClick={handleCombineClick} disabled={!areBothMoviesSelected}>
                            Combine
                        </Button>
                        <Button variant="outlined" fullWidth color="secondary" onClick={handleChatGPTCombineClick} disabled={!areBothMoviesSelected}>
                            ChatGPT Combine
                        </Button>
                        { recMovie && areBothMoviesSelected && (
                            <div style={{margin: "10px"}}>
                            <MovieCard title={recMovie[0].title} year={recMovie[0].release_date ? recMovie[0].release_date.split('-')[0] : '-'} 
                            rating={recMovie[0].vote_avg} description={recMovie[0].description} 
                            imageUrl={`https://image.tmdb.org/t/p/original${recMovie[0].image}`}/>
                            
                            <MovieCard title={recMovie[1].title} year={recMovie[1].release_date ? recMovie[1].release_date.split('-')[0] : '-'} 
                            rating={recMovie[1].vote_avg} description={recMovie[1].description} 
                            imageUrl={`https://image.tmdb.org/t/p/original${recMovie[1].image}`}/>

                            <MovieCard title={recMovie[2].title} year={recMovie[2].release_date ? recMovie[2].release_date.split('-')[0] : '-'} 
                            rating={recMovie[2].vote_avg} description={recMovie[2].description} 
                            imageUrl={`https://image.tmdb.org/t/p/original${recMovie[2].image}`}/>
                            </div>
                        )}

                        { gptMovie && !gptLoading && areBothMoviesSelected && (
                            <div style={{margin: "10px"}}>
                                <MovieCard title={gptMovie.title} description={gptMovie.description} imageUrl={gptMovie.imageUrl} year={null} rating={null} gpt={true}/>
                            </div>
                        )}

                        {gptLoading && (
                            <div style={{margin: "10px", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <CircularProgress/>
                            </div>
                        )}

                    </Box>
                  )}
            </div>
            </div>
        </ThemeProvider>
    )
}

export default Movies