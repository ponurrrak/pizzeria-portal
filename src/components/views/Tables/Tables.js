import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import styles from './Tables.module.scss';

const tablesNumber = 3;

const loopTimeInterval = 30 * 60 * 1000;

const getStartTime = time => {
  const startTime = new Date(time);
  if(time.getMinutes() < 30){
    startTime.setMinutes(0);
  } else {
    startTime.setMinutes(30);
  }
  startTime.setSeconds(0);
  startTime.setMilliseconds(0);
  return startTime;
};

const getDefaultEndTime = time => (
  new Date(time.getFullYear(), time.getMonth(), time.getDate() + 1)
);

const getEndTime = time => {
  const endTime = new Date(time);
  if(time.getMinutes() > 0 && time.getMinutes() <= 30){
    endTime.setMinutes(30);
  } else if(time.getMinutes() > 30){
    endTime.setMinutes(60);
  }
  endTime.setSeconds(0);
  endTime.setMilliseconds(0);
  return endTime;
};

const generateTableBody = (bookings, minLoopTime, maxLoopTime) => {
  const rows = [];
  for(let time = minLoopTime; time < maxLoopTime; time = time + loopTimeInterval){
    let areThereBookingsToRender = false;
    const bookingIDsToRender = [];
    for(let table = 1; table <= tablesNumber; table++){
      const matchingBooking = bookings.find(booking => {
        let bookingStart = new Date(booking.date + ' ' + booking.hour).getTime();
        if(booking.repeat && time >= bookingStart){
          bookingStart = new Date(new Date(time).toDateString() + ' ' + booking.hour).getTime();
        }
        const bookingEnd = bookingStart + booking.duration * 60 * 60 * 1000;
        return booking.table === table && time >= bookingStart && time < bookingEnd;
      });
      if(matchingBooking){
        areThereBookingsToRender = true;
        bookingIDsToRender.push({
          id: matchingBooking.id,
          repeat: matchingBooking.repeat,
        });
      } else {
        bookingIDsToRender.push('');
      }
    }
    if (areThereBookingsToRender){
      rows.push(generateTableRow(time, bookingIDsToRender));
    }
  }
  return rows;
};


const generateTableRow = (time, bookingIDsToRender) => {
  const timeFrom = new Date(time);
  const timeTo = new Date(time + loopTimeInterval);
  const dateToRender = timeFrom.toDateString();
  const timeFromToRender = timeFrom.toTimeString().split(' ')[0];
  const timeToToRender = timeTo.toTimeString().split(' ')[0];
  return (
    <TableRow key={time}>
      <TableCell component="th" scope="row">
        {dateToRender}
      </TableCell>
      <TableCell component="th" scope="row">
        {timeFromToRender}
      </TableCell>
      <TableCell component="th" scope="row">
        {timeToToRender}
      </TableCell>
      {bookingIDsToRender.map(({id, repeat}, index) => (
        <TableCell key={index}>
          {id && (
            <Button component={Link} to={`/tables/${repeat ? 'events' : 'booking'}/${id}`}>
              {`${repeat ? 'event' : 'book'}: ${id}`}
            </Button>
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

const Tables = ( {bookingTables, loading: { active, error }, fetchBookingTables} ) => {
  const timeNow = new Date();
  const [startTime, handleStartTimeChange] = useState(getStartTime(timeNow));
  const [endTime, handleEndTimeChange] = useState(getDefaultEndTime(timeNow));
  useEffect(() => {
    fetchBookingTables();
  }, [fetchBookingTables]);
  const minLoopTime = getStartTime(startTime).getTime();
  const maxLoopTime = getEndTime(endTime).getTime();
  if(active || !bookingTables.length){
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
        <Grid
          container
          direction="row"
          justifyContent="space-around"
        >
          <Grid item className={styles.gridItem} xs={12} sm={6} md={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                inputVariant='outlined'
                label='Choose start date & time'
                value={startTime}
                onChange={handleStartTimeChange}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid className={styles.gridItem} item xs={12} sm={6} md={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                inputVariant='outlined'
                label='Choose end date & time'
                value={endTime}
                onChange={handleEndTimeChange}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid className={styles.gridItem} item xs={12} sm={6} md={3}>
            <Button variant="contained" color="primary" size="large" component={Link} to='/tables/booking/new'>
              New booking
            </Button>
          </Grid>
          <Grid item className={styles.gridItem} xs={12} sm={6} md={3}>
            <Button variant="contained" color="primary" size="large" component={Link} to='/tables/events/new'>
              New event
            </Button>
          </Grid>
        </Grid>
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time From</TableCell>
              <TableCell>Time To</TableCell>
              <TableCell>Table 1</TableCell>
              <TableCell>Table 2</TableCell>
              <TableCell>Table 3</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {generateTableBody(bookingTables, minLoopTime, maxLoopTime)}
          </TableBody>
        </Table>
      </Paper>
    );
  }
};

Tables.propTypes = {
  bookingTables: PropTypes.array,
  loading: PropTypes.shape({
    active: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.bool,PropTypes.string]),
  }),
  fetchBookingTables: PropTypes.func,
};

export default Tables;
