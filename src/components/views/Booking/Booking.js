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
import styles from './Booking.module.scss';

const filterBookings = (other, booking) => {
  const bookingStart = new Date(booking.date + ' ' + booking.hour).getTime();
  const bookingEnd = bookingStart + booking.duration * 60 * 60 * 1000;
  const otherStart = other.repeat ?
    new Date(booking.date + ' ' + other.hour).getTime()
    :
    new Date(other.date + ' ' + other.hour).getTime();
  const otherEnd = otherStart + other.duration * 60 * 60 * 1000;
  return booking.table !== other.table || bookingStart >= otherEnd || bookingEnd <= otherStart;
};

const isBookingChangeAllowed = (otherBookings, booking) => {
  const notOverlappingBookings = otherBookings.filter(other =>
    filterBookings(other, booking)
  );
  return otherBookings.length === notOverlappingBookings.length;
};

const compareNewToOriginal = (oldBooking, newBooking) =>
  Object.keys(oldBooking).find(key => {
    if(oldBooking[key] instanceof Array){
      return oldBooking[key].find(item => newBooking[key].indexOf(item) === -1) || oldBooking[key].length < newBooking[key].length;
    } else {
      return oldBooking[key] !== newBooking[key];
    }
  });

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

let originalCurrentBooking;


const Booking = ({ match: {params: {id}}, location: {state}, putEditedBookingOnAPI }) => {

  if(originalCurrentBooking === undefined){
    originalCurrentBooking = state ? JSON.parse(JSON.stringify(state.booking)) : null;
  }

  const [isDisabled, setActive] = useState(true);
  const [currentBooking, setCurrentBooking] = useState(state ? state.booking : null);
  const [others, setOthers] = useState(state ? state.others : null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const setBookingTime = time => {
    if(time.getTime() < roundTime(new Date()).getTime()){
      setCurrentBooking({
        ...currentBooking,
      });
    } else{
      const dateString = `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, 0)}-${String(time.getDate()).padStart(2, 0)}`;
      const timeString= `${String(time.getHours()).padStart(2, 0)}:${String(time.getMinutes()).padStart(2, 0)}`;
      setCurrentBooking({
        ...currentBooking,
        date: dateString,
        hour: timeString,
      });
    }
  };

  const handleBookingDurationChange = (event, newValue) =>
    setCurrentBooking({
      ...currentBooking,
      duration: newValue,
    });

  const handleTableChange = (event) =>
    setCurrentBooking({
      ...currentBooking,
      table: event.target.value * 1,
    });

  const handlePeopleChange = (event) =>
    setCurrentBooking({
      ...currentBooking,
      ppl: event.target.value,
    });

  const handleStartersChange = (event) => {
    if(event.target.checked && currentBooking.starters.indexOf(event.target.name) === -1){
      setCurrentBooking({
        ...currentBooking,
        starters: [...currentBooking.starters, event.target.name],
      });
    } else if(!event.target.checked && currentBooking.starters.indexOf(event.target.name) !== -1){
      const starters = [...currentBooking.starters];
      starters.splice(starters.indexOf(event.target.name), 1);
      setCurrentBooking({
        ...currentBooking,
        starters: [...starters],
      });
    }
  };

  const handleAddressChange = (event) => {
    setCurrentBooking({
      ...currentBooking,
      address: event.target.value,
    });
  };

  const handlePhoneChange = (event) => {
    setCurrentBooking({
      ...currentBooking,
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
        const bookingsOnly = promises[0].data;
        const eventsOnly = promises[1].data;
        const bookingToBeCurrent = bookingsOnly.find(booking =>
          booking.id === id * 1
        );
        originalCurrentBooking = JSON.parse(JSON.stringify(bookingToBeCurrent));
        setCurrentBooking(bookingToBeCurrent);
        setOthers(bookingsOnly.filter(booking =>
          booking.id !== id * 1
        ).concat(eventsOnly));
        setIsLoading(false);
      })
      .catch(err => {
        setIsError(err.message || true);
      });
  };

  const submitChanges = () => {
    if (!isDisabled && compareNewToOriginal(originalCurrentBooking, currentBooking)){
      if(isBookingChangeAllowed(others, currentBooking)){
        putEditedBookingOnAPI(currentBooking);
        setCurrentBooking(null);
      } else {
        setCurrentBooking(JSON.parse(JSON.stringify(originalCurrentBooking)));
        alert('Sorry, this table is taken at that time.\nTry another table or date or hour.');
      }
    }
    setActive(!isDisabled);
  };

  useEffect(() => {
    if(!currentBooking){
      fetchBookingsFromAPI();
    }
  });

  if(isLoading || !currentBooking){
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
          {`Table booking of id ${id} details`}
        </Typography>
        <Grid container spacing={3}>
          <Grid item className={styles.gridItem} xs={12} md={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                inputVariant='outlined'
                label='Booking date&time start'
                value={new Date(currentBooking.date + ' ' + currentBooking.hour)}
                onChange={setBookingTime}
                minutesStep={30}
                disablePast
                disabled={isDisabled ? true : false}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item className={styles.gridItem} xs={12} md={6}>
            <div className={styles.slider}>
              <Typography gutterBottom>
                Booking duration
              </Typography>
              <Slider
                value={currentBooking.duration}
                onChange={handleBookingDurationChange}
                valueLabelDisplay="auto"
                step={1}
                marks={generateMarks(stepsNumber)}
                min={1}
                max={stepsNumber}
                color="secondary"
                disabled={isDisabled ? true : false}
              />
            </div>
          </Grid>
          <Grid item className={styles.gridItem} xs={12} md={4}>
            <FormControl component="fieldset">
              <Typography gutterBottom>
                Table
              </Typography>
              <RadioGroup name="table" value={currentBooking.table} onChange={handleTableChange}>
                {tablesList.map(table => (
                  <FormControlLabel
                    key={table}
                    value={table}
                    control={<Radio />}
                    label={`table ${table}`}
                    disabled={isDisabled ? true : false}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item className={styles.gridItem} xs={12} md={4}>
            <TextField
              label="People"
              type="number"
              value={currentBooking.ppl}
              onChange={handlePeopleChange}
              variant="outlined"
              disabled={isDisabled ? true : false}
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
                      checked={currentBooking.starters.indexOf(starter) !== -1}
                      onChange={handleStartersChange}
                      name={starter}
                    />}
                    label={starter[0].toUpperCase() + starter.slice(1)}
                    disabled={isDisabled ? true : false}
                    key={starter}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item className={styles.gridItem} xs={12} md={4}>
            <TextField
              label="Address"
              value={currentBooking.address}
              onChange={handleAddressChange}
              variant="outlined"
              disabled={isDisabled ? true : false}
            />
          </Grid>
          <Grid item className={styles.gridItem} xs={12} md={4}>
            <TextField
              label="Phone"
              value={currentBooking.phone}
              onChange={handlePhoneChange}
              variant="outlined"
              disabled={isDisabled ? true : false}
            />
          </Grid>
          <Grid item className={styles.gridItem} xs={12} md={4}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={submitChanges}
            >
              {isDisabled ? 'Edit' : 'Save'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }
};

Booking.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  putEditedBookingOnAPI: PropTypes.func,
};

export default Booking;
