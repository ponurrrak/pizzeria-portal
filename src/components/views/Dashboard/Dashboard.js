import React from 'react';
import {Link} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import styles from './Dashboard.module.scss';

const todayString = new Date().toDateString();

const bookings = [
  {
    date: todayString,
    hour: '23:00',
    table: 2,
    duration: 2,
    id: 3,
  },
  {
    date: '2021-12-27',
    hour: '22:00',
    table: 3,
    repeat: 'daily',
    duration: 2,
    id: 2,
  },
  {
    date: todayString,
    hour: '22:00',
    table: 1,
    duration: 1,
    id: 1,
  },
  {
    date: todayString,
    hour: '16:30',
    table: 1,
    duration: 2,
    id: 4,
  },
];

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

const getEndTime = time => (
  new Date(time.getFullYear(), time.getMonth(), time.getDate() + 1)
);

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

const renderStatistics = totalOrderAmount => (
  <List>
    <ListItem>
      <ListItemIcon>
        <CheckBoxIcon color="secondary"/>
      </ListItemIcon>
      <ListItemText primary="Orders completed: 45" />
    </ListItem>
    <ListItem>
      <ListItemIcon>
        <MonetizationOnIcon color="secondary"/>
      </ListItemIcon>
      <ListItemText primary={`On total amount: ${totalOrderAmount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })}`} />
    </ListItem>
    <ListItem>
      <ListItemIcon>
        <FormatListNumberedIcon color="secondary"/>
      </ListItemIcon>
      <ListItemText primary="Orders in progress: 6" />
    </ListItem>
  </List>
);

const Dashboard = () => {
  const timeNow = new Date();
  const minLoopTime = getStartTime(timeNow).getTime();
  const maxLoopTime = getEndTime(timeNow).getTime();
  const totalOrderAmount = 4737;
  return (
    <Paper className={styles.component}>
      <Grid
        container
        alignItems="flex-end"
        justifyContent="space-between"
      >
        <Grid item className={styles.gridItem}>
          <Typography gutterBottom variant='h4'>
            Today&apos;s bookings and events
          </Typography>
        </Grid>
        <Grid item className={styles.gridItem}>
          <Typography gutterBottom variant='h5'>
            Today&apos;s statistics
          </Typography>
          {renderStatistics(totalOrderAmount)}
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
          {generateTableBody(bookings, minLoopTime, maxLoopTime)}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default Dashboard;
