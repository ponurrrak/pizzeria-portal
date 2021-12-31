import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, DatePicker, TimePicker } from '@material-ui/pickers';
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
import styles from './EventsNew.module.scss';

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

const EventsNew = () => {
  const timeNow = new Date();
  const [bookingDate, setBookingDate] = useState(timeNow);
  const [bookingTime, setBookingTime] = useState(timeNow);
  const [selectedTable, setSelectedTable] = useState(1);
  const handleTableChange = (event) => {
    setSelectedTable(event.target.value * 1);
  };
  return (
    <Paper className={styles.component}>
      <h2 className={styles.header}>
        Start new event
      </h2>
      <Grid container spacing={3}>
        <Grid item className={styles.gridItem} xs={12} md={4}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              inputVariant='outlined'
              label='Event first date'
              value={bookingDate}
              onChange={setBookingDate}
              disablePast
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item className={styles.gridItem} xs={12} md={4}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <TimePicker
              inputVariant='outlined'
              label='Event start time'
              value={bookingTime}
              onChange={setBookingTime}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item className={styles.gridItem} xs={12} md={4}>
          <div className={styles.slider}>
            <Typography gutterBottom>
              Event duration
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
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="table 1"
              />
              <FormControlLabel
                value={2}
                control={<Radio />}
                label="table 2"
              />
              <FormControlLabel
                value={3}
                control={<Radio />}
                label="table 3"
              />
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
              <FormControlLabel
                control={<Checkbox
                  name="water"
                />}
                label="Water"
              />
              <FormControlLabel
                control={<Checkbox
                  name="cola"
                />}
                label="Cola"
              />
              <FormControlLabel
                control={<Checkbox
                  name="bread"
                />}
                label="Bread"
              />
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

export default EventsNew;
