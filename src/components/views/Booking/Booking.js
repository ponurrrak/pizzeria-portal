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
import PropTypes from 'prop-types';
import styles from './Booking.module.scss';

const booking = {
  date: '2021-12-27',
  hour: '23:00',
  table: 2,
  duration: 2,
  id: 3,
  starters: [
    'water',
    'bread',
  ],
  ppl: 4,
  phone: '666666666',
  address: 'London Zdroj 6',
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


const Booking = ({match}) => {
  const [isDisabled, setActive] = useState(true);
  const [bookingTime, setBookingTime] = useState(new Date(booking.date + 'T' + booking.hour));
  const [sliderValue, setSliderValue] = useState(booking.duration);
  const handleSliderValueChange = (event, newValue) => {
    setSliderValue(newValue);
  };
  const [selectedTable, setSelectedTable] = useState(booking.table);
  const handleTableChange = (event) => {
    setSelectedTable(event.target.value * 1);
  };
  const [people, setPeople] = useState(booking.ppl);
  const handlePeopleChange = (event) => {
    setPeople(event.target.value);
  };
  const [starters, setStarters] = useState({
    water: booking.starters.indexOf('water') !== -1,
    cola: booking.starters.indexOf('cola') !== -1,
    bread: booking.starters.indexOf('bread') !== -1,
  });
  const handleStartersChange = (event) => {
    setStarters({ ...starters, [event.target.name]: event.target.checked });
  };
  const [address, setAddress] = useState(booking.address);
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };
  const [phone, setPhone] = useState(booking.phone);
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };
  return (
    <Paper className={styles.component}>
      <h2 className={styles.header}>
        {`Table booking of id ${match.params.id} details`}
      </h2>
      <Grid container spacing={3}>
        <Grid item className={styles.gridItem} xs={12} md={6}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              inputVariant='outlined'
              label='Booking date&time start'
              value={bookingTime}
              onChange={setBookingTime}
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
              value={sliderValue}
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
            <RadioGroup name="table" value={selectedTable} onChange={handleTableChange}>
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
            value={people}
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
                    checked={starters[starter]}
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
            value={address}
            onChange={handleAddressChange}
            variant="outlined"
            disabled={isDisabled ? true : false}
          />
        </Grid>
        <Grid item className={styles.gridItem} xs={12} md={4}>
          <TextField
            label="Phone"
            value={phone}
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
            onClick={()=>setActive(!isDisabled)}
          >
            {isDisabled ? 'Edit' : 'Save'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

Booking.propTypes = {
  match: PropTypes.object,
};

export default Booking;
