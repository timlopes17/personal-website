import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Button } from '@mui/material'
import { darkTheme, lightTheme } from '../Themes';
import { ThemeProvider } from '@mui/material/styles';

const Movies = () => {
    const [useDarkTheme, setUseDarkTheme] = useState(true)

    

    return(
        <ThemeProvider theme={useDarkTheme ? darkTheme : lightTheme}>
            <div className="flex flex-col h-screen">
                <div id="first-div" className="flex-1 min-h-screen min-w-screen bg-mygray text-white flex flex-col items-center justify-center">
                  
                </div>
            </div>
        </ThemeProvider>
    )
}

export default Movies