import React from 'react';
import PropTypes from 'prop-types';
import styles from './Order.module.scss';

const Order = ({match}) => (
  <div className={styles.component}>
    <h2>Order View</h2>
    <h3>{`Order id: ${match.params.id}`}</h3>
  </div>
);

Order.propTypes = {
  match: PropTypes.object,
};

export default Order;
