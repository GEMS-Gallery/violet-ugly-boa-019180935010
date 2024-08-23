import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Paper, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { backend } from 'declarations/backend';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [kittenImages, setKittenImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchKittenImages = async () => {
      const images = await Promise.all(
        Array(10).fill(0).map(() => 
          fetch('/api/get_unsplash_image?query=kitten')
            .then(res => res.json())
            .then(data => data.url)
        )
      );
      setKittenImages(images);
    };
    fetchKittenImages();
  }, []);

  const handleNumberClick = (num: string) => {
    setDisplay((prev) => (prev === '0' ? num : prev + num));
  };

  const handleOperationClick = (op: string) => {
    if (firstOperand === null) {
      setFirstOperand(parseFloat(display));
      setOperation(op);
      setDisplay('0');
    } else {
      handleEqualsClick();
      setOperation(op);
    }
  };

  const handleEqualsClick = async () => {
    if (firstOperand !== null && operation) {
      setLoading(true);
      try {
        const result = await backend.calculate(operation, firstOperand, parseFloat(display));
        setDisplay(result.toString());
        setFirstOperand(null);
        setOperation(null);
      } catch (error) {
        setDisplay('Error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperation(null);
  };

  const handleBackspace = () => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={3} style={{ padding: '20px', maxWidth: '300px', margin: 'auto' }}>
        <TextField
          fullWidth
          variant="outlined"
          value={display}
          InputProps={{ readOnly: true }}
          style={{ marginBottom: '20px' }}
        />
        <Grid container spacing={1}>
          {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'].map((num, index) => (
            <Grid item xs={3} key={num}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleNumberClick(num)}
                className="kitten-button"
                style={{ backgroundImage: `url(${kittenImages[index % 10]})` }}
              >
                <span>{num}</span>
              </Button>
            </Grid>
          ))}
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleBackspace}
            >
              <BackspaceIcon />
            </Button>
          </Grid>
          {['+', '-', '*', '/'].map((op) => (
            <Grid item xs={3} key={op}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleOperationClick(op)}
              >
                {op}
              </Button>
            </Grid>
          ))}
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleEqualsClick}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : '='}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleClear}
            >
              C
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
};

export default App;