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

const isBookingChangeAllowed = (booking, otherBookings) => {
  const notOverlappingBookings = otherBookings.filter(other => {
    const bookingStart = new Date(booking.date + ' ' + booking.hour).getTime();
    const bookingEnd = bookingStart + booking.duration * 60 * 60 * 1000;
    const otherStart = other.repeat ? new Date(booking.date + ' ' + other.hour).getTime() : new Date(other.date + ' ' + other.hour).getTime();
    const otherEnd = otherStart + other.duration * 60 * 60 * 1000;
    return booking.table !== other.table || bookingStart >= otherEnd || bookingEnd <= otherStart;
  });
  return otherBookings.length === notOverlappingBookings.length;
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

  const setBookingTime = time => {
    const dateString = `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, 0)}-${String(time.getDate()).padStart(2, 0)}`;
    const timeString= `${String(time.getHours()).padStart(2, 0)}:${String(time.getMinutes()).padStart(2, 0)}`;
    updateCurrentBooking({
      ...currentBooking,
      date: dateString,
      hour: timeString,
    });
  };

  const handleSliderValueChange = (event, newValue) =>
    updateCurrentBooking({
      ...currentBooking,
      duration: newValue,
    });

  const handleTableChange = (event) =>
    updateCurrentBooking({
      ...currentBooking,
      table: event.target.value * 1,
    });

  const handlePeopleChange = (event) =>
    updateCurrentBooking({
      ...currentBooking,
      ppl: event.target.value,
    });

  const handleStartersChange = (event) => {
    if(event.target.checked && currentBooking.starters.indexOf(event.target.name) === -1){
      updateCurrentBooking({
        ...currentBooking,
        starters: [...currentBooking.starters, event.target.name],
      });
    } else if(!event.target.checked && currentBooking.starters.indexOf(event.target.name) !== -1){
      currentBooking.starters.splice(currentBooking.starters.indexOf(event.target.name), 1);
      updateCurrentBooking({
        ...currentBooking,
        starters: [...currentBooking.starters],
      });
    }
  };

  const handleAddressChange = (event) => {
    updateCurrentBooking({
      ...currentBooking,
      address: event.target.value,
    });
  };

  const handlePhoneChange = (event) => {
    updateCurrentBooking({
      ...currentBooking,
      phone: event.target.value,
    });
  };

  const fetchBookingsFromAPI = () => {
    setLoading(true);
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
        updateCurrentBooking(bookingToBeCurrent);
        setOthers(bookingsOnly.filter(booking =>
          booking.id !== id * 1
        ).concat(eventsOnly));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || true);
      });
  };

  const submitChanges = () => {
    if (!isDisabled){
      if(isBookingChangeAllowed(currentBooking, others)){
        putEditedBookingOnAPI(currentBooking);
        updateCurrentBooking(null);
      } else {
        updateCurrentBooking(JSON.parse(JSON.stringify(originalCurrentBooking)));
        alert('Sorry, this table is taken at that time.\nTry another table or date or hour.');
      }
    }
    setActive(!isDisabled);
  };

  const [isDisabled, setActive] = useState(true);
  const [currentBooking, updateCurrentBooking] = useState(state ? state.booking : null);
  const [others, setOthers] = useState(state ? state.others : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if(!currentBooking){
      fetchBookingsFromAPI();
    }
  });

  if(loading || !currentBooking){
    return (
      <Paper className={styles.component}>
        <Typography gutterBottom variant='h4'>
          Loading...
        </Typography>
      </Paper>
    );
  } else if(error) {
    return (
      <Paper className={styles.component}>
        <Typography gutterBottom variant='h4'>
          Error! Details:
          <pre>{error}</pre>
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
                onChange={handleSliderValueChange}
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
