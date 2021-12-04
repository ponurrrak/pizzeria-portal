import React from 'react';
import PropTypes from 'prop-types';
import styles from './Booking.module.scss';

const Booking = ({match}) => (
  <div className={styles.component}>
    <h2>Booking View</h2>
    <h3>{`Table booking id: ${match.params.id}`}</h3>
  </div>
);

Booking.propTypes = {
  match: PropTypes.object,
};

export default Booking;
