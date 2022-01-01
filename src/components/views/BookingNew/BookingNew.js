import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import styles from './BookingNew.module.scss';

const stepsNumber = 5;

const generateMarks = stepsNumber => {
  const marks = [
    {
      value: 1,
      label: '1 hour',
    },
  ];
  for(let i=2; i<=stepsNumber; i++){
    marks.push(
      {
        value: i,
        label: i + 'hours',
      }
    );
  }
  return marks;
};

const tablesList = Array.from({length: 3}, (item, index) => index + 1);
const startersList = ['water', 'cola', 'bread'];

const BookingNew = () => {
  const [bookingTime, setBookingTime] = useState(new Date());
  const [selectedTable, setSelectedTable] = useState(1);
  const handleTableChange = (event) => {
    setSelectedTable(event.target.value * 1);
  };
  return (
    <Paper className={styles.component}>
      <h2 className={styles.header}>
        Start new booking
      </h2>
      <Grid container spacing={3}>
        <Grid item className={styles.gridItem} xs={12} md={6}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              inputVariant='outlined'
              label='Booking date&time start'
              value={bookingTime}
              onChange={setBookingTime}
              disablePast
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item className={styles.gridItem} xs={12} md={6}>
          <div className={styles.slider}>
            <Typography gutterBottom>
              Booking duration
            </Typography>
            <Slider
              defaultValue={1}
              valueLabelDisplay="auto"
              step={1}
              marks={generateMarks(stepsNumber)}
              min={1}
              max={stepsNumber}
              color="secondary"
            />
          </div>
        </Grid>
        <Grid item className={styles.gridItem} xs={12} md={4}>
          <FormControl component="fieldset">
            <Typography gutterBottom>
              Table
            </Typography>
            <RadioGroup name="table" value={selectedTable} onChange={handleTableChange}>
              {tablesList.map(table => (
                <FormControlLabel
                  key={table}
                  value={table}
                  control={<Radio />}
                  label={`table ${table}`}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item className={styles.gridItem} xs={12} md={4}>
          <TextField
            label="People"
            type="number"
            defaultValue={1}
            variant="outlined"
          />
        </Grid>
        <Grid item className={styles.gridItem} xs={12} md={4}>
          <FormControl component="fieldset">
            <Typography gutterBottom>
              Starters
            </Typography>
            <FormGroup>
              {startersList.map(starter => (
                <FormControlLabel
                  control={<Checkbox
                    name={starter}
                  />}
                  label={starter[0].toUpperCase() + starter.slice(1)}
                  key={starter}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid item className={styles.gridItem} xs={12} md={4}>
          <TextField
            label="Address"
            variant="outlined"
          />
        </Grid>
        <Grid item className={styles.gridItem} xs={12} md={4}>
          <TextField
            label="Phone"
            variant="outlined"
          />
        </Grid>
        <Grid item className={styles.gridItem} xs={12} md={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BookingNew;
