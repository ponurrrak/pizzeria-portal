import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import {api} from '../../../settings';
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
import PropTypes from 'prop-types';
import styles from './BookingNew.module.scss';

const filterBookings = (previousBooking, newBooking) => {
  const newBookingStart = new Date(newBooking.date + ' ' + newBooking.hour).getTime();
  const newBookingEnd = newBookingStart + newBooking.duration * 60 * 60 * 1000;
  const previousStart = previousBooking.repeat ?
    new Date(newBooking.date + ' ' + previousBooking.hour).getTime()
    :
    new Date(previousBooking.date + ' ' + previousBooking.hour).getTime();
  const previousEnd = previousStart + previousBooking.duration * 60 * 60 * 1000;
  return newBooking.table !== previousBooking.table || newBookingStart >= previousEnd || newBookingEnd <= previousStart;
};

const isNewBookingAllowed = (previousBookings, newBooking) => {
  const notOverlappingBookings = previousBookings.filter(previous =>
    filterBookings(previous, newBooking)
  );
  return previousBookings.length === notOverlappingBookings.length;
};

const roundTime = time => {
  const timeRounded = new Date(time);
  if(time.getMinutes() < 30){
    timeRounded.setMinutes(30);
  } else {
    timeRounded.setMinutes(60);
  }
  timeRounded.setSeconds(0);
  timeRounded.setMilliseconds(0);
  return timeRounded;
};

const generateDateString = time =>
  `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, 0)}-${String(time.getDate()).padStart(2, 0)}`;

const generateTimeString = time =>
  `${String(time.getHours()).padStart(2, 0)}:${String(time.getMinutes()).padStart(2, 0)}`;

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


const BookingNew = ({ location: { state }, addNewBooking }) => {

  const timeNowRounded = roundTime(new Date());
  const bookingDefaults = {
    date: generateDateString(timeNowRounded),
    hour: generateTimeString(timeNowRounded),
    table: 1,
    duration: 1,
    ppl: 1,
    starters: [],
    address: '',
    phone: '',
  };

  const [newBooking, setNewBooking] = useState(bookingDefaults);
  const [previousBookings, setPreviousBookings] = useState(state ? state : null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const setBookingTime = time => {
    if(time.getTime() < roundTime(new Date()).getTime()){
      setNewBooking({
        ...newBooking,
      });
    } else {
      const dateString = generateDateString(time);
      const timeString= generateTimeString(time);
      setNewBooking({
        ...newBooking,
        date: dateString,
        hour: timeString,
      });
    }
  };

  const handleBookingDurationChange = (event, newValue) =>
    setNewBooking({
      ...newBooking,
      duration: newValue,
    });

  const handleTableChange = (event) =>
    setNewBooking({
      ...newBooking,
      table: event.target.value * 1,
    });

  const handlePeopleChange = (event) =>
    setNewBooking({
      ...newBooking,
      ppl: event.target.value,
    });

  const handleStartersChange = (event) => {
    if(event.target.checked && newBooking.starters.indexOf(event.target.name) === -1){
      setNewBooking({
        ...newBooking,
        starters: [...newBooking.starters, event.target.name],
      });
    } else if(!event.target.checked && newBooking.starters.indexOf(event.target.name) !== -1){
      const starters = [...newBooking.starters];
      starters.splice(starters.indexOf(event.target.name), 1);
      setNewBooking({
        ...newBooking,
        starters: [...starters],
      });
    }
  };

  const handleAddressChange = (event) => {
    setNewBooking({
      ...newBooking,
      address: event.target.value,
    });
  };

  const handlePhoneChange = (event) => {
    setNewBooking({
      ...newBooking,
      phone: event.target.value,
    });
  };

  const fetchBookingsFromAPI = () => {
    setIsLoading(true);
    const promiseBookings = Axios.get(`${api.url}/api/${api.bookings}`);
    const promiseEvents = Axios.get(`${api.url}/api/${api.events}`);
    const promiseAll = Promise.all([promiseBookings, promiseEvents]);
    promiseAll
      .then(promises => {
        const data = promises[0].data.concat(promises[1].data);
        setPreviousBookings(data);
        setIsLoading(false);
      })
      .catch(err => {
        setIsError(err.message || true);
      });
  };

  const printMessage = (bookingID) => {
    alert('The reservation has given id ' + bookingID);
    setPreviousBookings(null);
  };

  const submitNewBooking = () => {
    if(isNewBookingAllowed(previousBookings, newBooking)){
      addNewBooking(newBooking, printMessage);
      setNewBooking(bookingDefaults);
    } else {
      alert('Sorry, this table is taken at that time.\nTry another table or date or hour.');
    }
  };

  useEffect(() => {
    if(!previousBookings){
      fetchBookingsFromAPI();
    }
  });

  if(isLoading || !previousBookings){
    return (
      <Paper className={styles.component}>
        <Typography gutterBottom variant='h4'>
          Loading...
        </Typography>
      </Paper>
    );
  } else if(isError) {
    return (
      <Paper className={styles.component}>
        <Typography gutterBottom variant='h4'>
          Error! Details:
          <pre>{isError}</pre>
        </Typography>
      </Paper>
    );
  } else {
    return (
      <Paper className={styles.component}>
        <Typography variant='h4' className={styles.header}>
          Start new booking
        </Typography>
        <Grid container spacing={3}>
          <Grid item className={styles.gridItem} xs={12} md={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                inputVariant='outlined'
                label='Booking date&time start'
                value={new Date(newBooking.date + ' ' + newBooking.hour)}
                onChange={setBookingTime}
                minutesStep={30}
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
                value={newBooking.duration}
                onChange={handleBookingDurationChange}
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
              <RadioGroup name="table" value={newBooking.table} onChange={handleTableChange}>
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
              value={newBooking.ppl}
              onChange={handlePeopleChange}
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
                      checked={newBooking.starters.indexOf(starter) !== -1}
                      onChange={handleStartersChange}
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
              value={newBooking.address}
              onChange={handleAddressChange}
            />
          </Grid>
          <Grid item className={styles.gridItem} xs={12} md={4}>
            <TextField
              label="Phone"
              variant="outlined"
              value={newBooking.phone}
              onChange={handlePhoneChange}
            />
          </Grid>
          <Grid item className={styles.gridItem} xs={12} md={4}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={submitNewBooking}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }
};


BookingNew.propTypes = {
  location: PropTypes.object,
  addNewBooking: PropTypes.func,
};

export default BookingNew;
