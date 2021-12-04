import React from 'react';
import PropTypes from 'prop-types';
import styles from './Events.module.scss';

const Events = ({match}) => (
  <div className={styles.component}>
    <h2>Events View</h2>
    <h3>{`Event id: ${match.params.id}`}</h3>
  </div>
);

Events.propTypes = {
  match: PropTypes.object,
};

export default Events;
