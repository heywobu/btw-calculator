import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Slider from '@material-ui/core/Slider';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Brightness4Icon from '@material-ui/icons/Brightness4';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  display: {
    paddingBottom: theme.spacing(1),
  },
  keypad: {
  },
  numCol: {
  },
  numRow: {

  },
  numBtn: {
  },
  noBorder: {
    borderStyle: 'none',
  },
  tipCalc: {
    paddingTop: theme.spacing(2),
  }
}));

function NumberFormatCurrency(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator={'.'}
      decimalScale='2'
      fixedDecimalScale
      decimalSeparator={','}
    />
  );
}

NumberFormatCurrency.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

function App() {
  const classes = useStyles();
  const [state, setState] = useState({
    vatInc: 0,
    incInput: false,
    vatExcl: 0,
    exclInput: false,
    vatPercent: 0.21
  });
  const [dark, setDark] = useState(true);

  const darkTheme = createMuiTheme({
    palette: {
      type: dark ? 'dark' : 'light',
    },
  });

  const handleChange = name => (event, value) => {
    let { vatInc, incInput, vatExcl, exclInput, vatPercent } = state;

    if (!value && !event.target.value) return;
    switch (name) {
      case 'vatInc':
        incInput = true;
        vatInc = parseFloat(event.target.value);
        vatExcl = vatInc / (vatPercent + 1);
        break;
      case 'vatExcl':
        exclInput = true;
        vatExcl = parseFloat(event.target.value);
        vatInc = vatExcl * (vatPercent +1);
        break;
      case 'vatPercent':
        vatPercent = value / 100;
        if (vatInc || vatExcl) {
          incInput = true;
          exclInput = true;
          vatExcl = vatInc / (vatPercent + 1);
          vatInc = vatExcl * (vatPercent + 1);
        }
        break;
      default:
        incInput = false;
        exclInput = false;
    }
    

    if (vatInc < 0) return;
    if (vatExcl < 0) return;
    if (vatPercent < 0) return;

    setState({
      ...state,
      vatInc: vatInc,
      incInput: incInput,
      vatExcl: vatExcl,
      exclInput: exclInput,
      vatPercent: vatPercent
    });
  };

  const vat_PERCENT = 0.21;
  const marks = [
    {
      value: 3,
      label: '3%',
    },
    {
      value: 12,
      label: '12%',
    },
    {
      value: 21,
      label: '21%',
    },
  ]

  function handleClick(name) {
    let { vatInc, vatExcl, vatPercent } = state;
    switch (name) {
      case 'reset':
        vatInc = 0;
        vatExcl = 0;
        vatPercent = vat_PERCENT;
        break;
      case 'down':
        {
          let vat = vatInc * vatPercent;
          vatExcl = vatInc - vat;
          let total = vatInc;
          if (!total) return;
          total = total % 1 !== 0 ? Math.floor(total) : Math.floor(total) - 1;
        }
        break;
      case 'up':
        {
          let vat = vatInc * vatPercent;
          vatExcl = vatInc - vat;
          let total = vatInc;
          if (!total) return;
          total = total % 1 !== 0 ? Math.floor(total) + 1 : Math.floor(total) + 1;
        }
        break;
      case 'dark':
        setDark(!dark);
        break;
      default:
    }

    setState({
      ...state,
      vatInc: vatInc,
      vatExcl: vatExcl,
      vatPercent: vatPercent,
    });
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='xs' className={classes.root}>
        <Container>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Grid container justify='space-between' >
              <Grid item xs={3} >
                <Typography variant='h4' component='h1'>BTW</Typography>
              </Grid>
              <Grid item xs={3} >
                <Button aria-label="Dark mode" fullWidth onClick={() => handleClick('dark')}><Brightness4Icon /></Button>
              </Grid>
              <Grid item xs={3}>
                <Button aria-label="Reset" fullWidth onClick={() => handleClick('reset')}>Reset</Button>
              </Grid>
            </Grid>
            <TextField
              id="vatInc"
              label='Prijs incl BTW'
              margin="normal"
              variant="outlined"
              fullWidth
              value={state.vatInc > 0 ? state.vatInc : ''}
              onChange={handleChange(!state.exclInput ? 'vatInc' : '')}
              InputProps={
                state.vatInc > 0 ? {
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  inputComponent: NumberFormatCurrency,
                } : { inputComponent: NumberFormatCurrency, }
              }
            />
            <TextField
              id="vatExcl"
              label='Prijs excl BTW'
              margin="normal"
              variant="outlined"
              fullWidth
              onChange={handleChange(!state.incInput ? 'vatExcl': '')}
              value={state.vatExcl > 0 ? state.vatExcl : ''}
              InputProps={
                state.vatExcl > 0 ? {
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  inputComponent: NumberFormatCurrency,
                } : { inputComponent: NumberFormatCurrency, }
              }
            />
            <TextField
              id="vat"
              label={`BTW (${(state.vatPercent * 100).toFixed(2)}%)`}
              margin="normal"
              variant="outlined"
              disabled
              fullWidth
              value={state.vatPercent > 0 ? state.vatPercent : ''}
              onChange={handleChange('vat')}
              InputProps={
                state.vat > 0 ? {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputComponent: NumberFormatCurrency,
                } :
                  {
                    inputComponent: NumberFormatCurrency,
                  }
              }
            />
            <Slider
              id='vatSlider'
              valueLabelDisplay="auto"
              valueLabelFormat={() => parseInt(state.vatPercent * 100) + '%'}
              step={1}
              marks={marks}
              min={0}
              max={30}
              value={parseInt(state.vatPercent * 100)}
              onChange={handleChange('vatPercent')}
            />
          </ThemeProvider>
        </Container>
      </Container>
    </React.Fragment>
  );
}

export default App;
