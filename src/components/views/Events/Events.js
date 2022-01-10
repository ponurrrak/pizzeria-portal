import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
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
import styles from './Events.module.scss';

const event = {
  date: '2021-12-31',
  hour: '22:00',
  table: 1,
  duration: 4,
  id: 3,
  repeat: 'daily',
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

const Events = ({match}) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [bookingTime, setBookingTime] = useState(new Date(event.date + 'T' + event.hour));
  const [sliderValue, setSliderValue] = useState(event.duration);
  const handleEventDurationChange = (event, newValue) => {
    setSliderValue(newValue);
  };
  const [selectedTable, setSelectedTable] = useState(event.table);
  const handleTableChange = (event) => {
    setSelectedTable(event.target.value * 1);
  };
  const [people, setPeople] = useState(event.ppl);
  const handlePeopleChange = (event) => {
    setPeople(event.target.value);
  };
  const [starters, setStarters] = useState({
    water: event.starters.indexOf('water') !== -1,
    cola: event.starters.indexOf('cola') !== -1,
    bread: event.starters.indexOf('bread') !== -1,
  });
  const handleStartersChange = (event) => {
    setStarters({ ...starters, [event.target.name]: event.target.checked });
  };
  const [address, setAddress] = useState(event.address);
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };
  const [phone, setPhone] = useState(event.phone);
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };
  return (
    <Paper className={styles.component}>
      <Typography variant='h4' className={styles.header}>
        {`Event of id ${match.params.id} details`}
      </Typography>
      <div className={styles.eventInfo}>
        <Typography gutterBottom>
          {`Event frequency: ${event.repeat}.`}
        </Typography>
        <Typography gutterBottom>
          {`Event first date: ${new Date(event.date).toDateString()}.`}
        </Typography>
      </div>
      <Grid container spacing={3}>
        <Grid item className={styles.gridItem} xs={12} md={6}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <TimePicker
              inputVariant='outlined'
              label='Event time start'
              value={bookingTime}
              onChange={setBookingTime}
              disabled={isDisabled ? true : false}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item className={styles.gridItem} xs={12} md={6}>
          <div className={styles.slider}>
            <Typography gutterBottom>
              Event duration
            </Typography>
            <Slider
              value={sliderValue}
              onChange={handleEventDurationChange}
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
            onClick={()=>setIsDisabled(!isDisabled)}
          >
            {isDisabled ? 'Edit' : 'Save'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};


Events.propTypes = {
  match: PropTypes.object,
};

export default Events;
