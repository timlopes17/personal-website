import React, { useRef, useEffect, useState, useCallback } from 'react';
import SankeyChart from '../components/SankeyChart';
import { TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, CssBaseline, Typography, Tooltip, InputAdornment, Autocomplete, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove'
import { darkTheme } from '../Themes';
import { ThemeProvider } from '@emotion/react';
import { useDropzone } from 'react-dropzone';
import { sankeyJustify } from 'd3-sankey';

function MyDropzone({ onFilesAdded }) {
    const onDrop = useCallback(acceptedFiles => {
        onFilesAdded(acceptedFiles)
    }, [onFilesAdded])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} style={{border: '2px dashed gray', borderRadius: '5px', padding: '20px', textAlign: 'center', color: 'gray', cursor: "pointer"}}>
        <input {...getInputProps()} />
        {
            <p>Upload budget json</p>
        }
        </div>
    );
}

function Budget() {
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState(['Transportation', 'Utilities', 'Subscriptions']);
    const [itemValue, setItemValue] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    })
    const [sankeyData, setSankeyData] = useState({ nodes: [], links: [] });

    useEffect(() => {
        document.title = "Budget Balance";
    }, []);

    useEffect(() => {
        console.log(items)
        setSankeyData(createSankeyData(items));
    }, [items]);

    const downloadItems = (event) => {
        event.preventDefault();

        event.stopPropagation();

        const fileName = "budget.json";
        const json = JSON.stringify(items, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    const itemExists = (name) => items.some(item => item.name.toLowerCase() === name.toLowerCase());

    const handleAddItem = (type) => {

        if (itemExists(itemName)) {
            setSnackbar({
                open: true, // or false, depending on your requirement
                message: 'Item already exists'
              });
        } else {
            if (!categories.includes(category)) {
                setCategories([...categories, category]);
            }
            setItems([...items, { name: itemName, category: category, value: itemValue, type: type }]);
            setItemName('');
            setCategory('');
            setItemValue('');
        }
    };
    
    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const replaceNullWithEmptyString = (arr) => {
        return arr.map(obj => {
            Object.keys(obj).forEach(key => {
                if (obj[key] === null) {
                    obj[key] = '';
                }
            });
            return obj;
        });
    };

    function isValidItemsArray(items) {
        const updatedItems = replaceNullWithEmptyString(items)
        // Example validation: Check if it's an array and all elements are objects with 'category' and 'amount'
        return Array.isArray(updatedItems) && updatedItems.every(item => 
          item.hasOwnProperty('name') && typeof item.category === 'string' &&
          item.hasOwnProperty('value') && typeof item.value === 'string' &&
          item.hasOwnProperty('type') && typeof item.type === 'string'
        );
      }

    const handleFilesAdded = (files) => {
        const file = files[0];

        const reader = new FileReader();
        reader.onload = (event) => {
        try {
            const json = JSON.parse(event.target.result);
            if (isValidItemsArray(json)) {
                setItems(json);
                setSnackbar(prevSnackbar => ({
                    ...prevSnackbar,
                    open: false
                  }));
            } else {
                console.log(json)
                console.error("Invalid JSON format");
                setSnackbar({
                    open: true, // or false, depending on your requirement
                    message: 'Invalid json'
                  });
                // Handle invalid format (show an error message, etc.)
            }
        } catch (error) {
            console.error("Error reading file:", error);
            setSnackbar({
                open: true, // or false, depending on your requirement
                message: 'Invalid File'
              });
            // Handle errors here
        }
        };
        reader.readAsText(file);
      };

      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSnackbar(prevSnackbar => ({
            ...prevSnackbar,
            open: false
          }));
      };

      const useTemplate = () => {
        fetch('/budget.json')
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(json => {
        if (isValidItemsArray(json)) {
            setItems(json);
            setSnackbar(prevSnackbar => ({
            ...prevSnackbar,
            open: false,
            message: ''
            }));
        } else {
            console.log(json);
            setSnackbar({
            open: true,
            message: 'Invalid JSON format'
            });
            // Handle invalid format (show an error message, etc.)
        }
        })
        .catch(error => {
        console.error("Error reading file:", error);
        setSnackbar({
            open: true,
            message: 'Invalid File'
        });
        // Handle errors here
        });
      }

      const createSankeyData = (items) => {
        const nodes = []
        const links = []

        items.forEach(item => {
            const itemName = item.name;
            const category = item.category || null;
            const value = Number(item.value)
            const incomeNode = "Income";
          
            // Ensure all nodes exist
            if (!nodes.some(node => node.name === itemName)) {
              nodes.push({ name: itemName });
            }
            if (category && !nodes.some(node => node.name === category)) {
              nodes.push({ name: category });
            }
            if (!nodes.some(node => node.name === incomeNode)) {
              nodes.push({ name: incomeNode });
            }
          
            if (item.type === 'income') {
              if (category) {
                links.push({
                  source: nodes.findIndex(node => node.name === itemName),
                  target: nodes.findIndex(node => node.name === category),
                  value: value
                });
                links.push({
                  source: nodes.findIndex(node => node.name === category),
                  target: nodes.findIndex(node => node.name === incomeNode),
                  value: value
                });
              } else {
                links.push({
                  source: nodes.findIndex(node => node.name === itemName),
                  target: nodes.findIndex(node => node.name === incomeNode),
                  value: value
                });
              }
            } else if (item.type === 'expense') {
              if (category) {
                links.push({
                  source: nodes.findIndex(node => node.name === incomeNode),
                  target: nodes.findIndex(node => node.name === category),
                  value: value
                });
                links.push({
                  source: nodes.findIndex(node => node.name === category),
                  target: nodes.findIndex(node => node.name === itemName),
                  value: value
                });
              } else {
                links.push({
                  source: nodes.findIndex(node => node.name === incomeNode),
                  target: nodes.findIndex(node => node.name === itemName),
                  value: value
                });
              }
            }
          });

        const totalIncome = items
        .filter(item => item.type === 'income')
        .reduce((acc, curr) => acc + Number(curr.value), 0);

        const totalExpenses = items
        .filter(item => item.type === 'expense')
        .reduce((acc, curr) => acc + Number(curr.value), 0);

        const leftover = totalIncome - totalExpenses;

        console.log(leftover, totalIncome, totalExpenses)

        // Add a new node for the leftover amount
        nodes.push({ name: 'Leftover' });

        // Find the index of the 'Income' and 'Leftover' nodes
        const incomeIndex = nodes.findIndex(node => node.name === 'Income');
        const leftoverIndex = nodes.findIndex(node => node.name === 'Leftover');

        // Add a link from 'Income' to 'Leftover' if there is any leftover amount
        if (leftover > 0) {
        links.push({
            source: incomeIndex,
            target: leftoverIndex,
            value: leftover
        });
        }

        console.log( {nodes, links} )

        
        
        return { nodes, links };
        
      }
    
      const clearItems = () => {
        setItems([])
      }

    return(
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div className="flex flex-col">
                <div id="first-div" className="flex-1 min-h-screen min-w-screen bg-mygray text-white flex flex-col items-center justify-center">
                    <Typography variant="h3" gutterBottom>
                        Budget Balance
                    </Typography>
                    <div style={{display: 'flex', alignItems: 'center',}}>
                    <TextField 
                        label="Item" 
                        value={itemName} 
                        onChange={(e) => setItemName(e.target.value)} 
                        InputLabelProps={{
                            style: { color: 'white', outlineColor: 'white'},
                        }}
                        inputProps={{
                            style: { color: 'white' },
                        }}
                    />
                    <Autocomplete
                        freeSolo
                        options={categories}
                        value={category}
                        onChange={(event, newValue) => {
                            setCategory(newValue === null ? '' : newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                            // This event can be triggered with 'null' when the input is cleared
                            setCategory(newInputValue === null ? '' : newInputValue);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Category" variant="outlined" style={{width: 175, marginRight: 10}}/>
                        )}
                    />
                    <TextField 
                        label="Amount" 
                        type="number"
                        value={itemValue} 
                        style={{width: 150}}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        onChange={(e) => setItemValue(e.target.value)} 
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                        inputProps={{
                            style: { color: 'white' },
                        }}
                    />
                    <Tooltip title="Add Income" placement="top">
                        <span>
                        <IconButton
                        color="success"
                        style={{padding: 10}}
                        onClick={() => handleAddItem('income')}
                        disabled={!itemName || !itemValue}
                        >
                            <AddIcon />
                        </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Add Expense" placement="top">
                        <span>
                        <IconButton
                        color="error"
                        style={{padding: 10}}
                        onClick={() => handleAddItem('expense')}
                        disabled={!itemName || !itemValue}
                        >
                        <RemoveIcon />
                        </IconButton>
                        </span>
                    </Tooltip>
                    </div>
                    
                    { items.length > 0 && sankeyData.links.length > 0 ? (
                    <div className="flex flex-row m-4">
                        <div className="flex flex-col items-center justify-center">
                            <List>
                                {items.map((item, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                    primary={`${item.name} ($${item.value})`}
                                    secondary={item.category}
                                    style={{color: item.type === 'income' ? '#26ff67' : '#ff264e'}}
                                    />
                                    <ListItemSecondaryAction>
                                    <Tooltip title="Remove" placement="top">
                                        <IconButton edge="end" onClick={() => handleRemoveItem(index)}>
                                        <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                ))}
                            </List> 
                            <Button variant="outlined" color="primary" type="button" onClick={downloadItems}>
                                Download JSON
                            </Button>
                            <Button variant="outlined" color="error" type="button" onClick={clearItems} style={{marginTop: 10}}>
                                Clear
                            </Button>
                        </div>
                        <div style={{margin: 10, marginLeft: 20}}>
                            <SankeyChart data={sankeyData} />
                        </div>
                    </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center m-4 space-y-2">
                            <MyDropzone onFilesAdded={handleFilesAdded} />
                            <Button variant="outlined" color="primary" type="button" onClick={useTemplate}>
                                Example
                            </Button>
                        </div>
                    )
                    }
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        open={snackbar.open}
                        autoHideDuration={4000}
                        onClose={handleClose}>
                        <Alert
                            onClose={handleClose}
                            severity="error"
                            variant="outlined"
                            sx={{ width: '100%' }}
                        >
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default Budget;