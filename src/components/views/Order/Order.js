import React from 'react';
import PropTypes from 'prop-types';
import styles from './Order.module.scss';

const Order = ({match: {params: {id}}}) => (
  <div className={styles.component}>
    <h2>Order View</h2>
    <h3>{`Order id: ${id}`}</h3>
  </div>
);

Order.propTypes = {
  match: PropTypes.object,
};

export default Order;
