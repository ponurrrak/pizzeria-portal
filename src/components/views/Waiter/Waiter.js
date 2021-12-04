import React from 'react';
import {Link} from 'react-router-dom';
import styles from './Waiter.module.scss';

const Waiter = () => (
  <div className={styles.component}>
    <h2>Waiter View</h2>
    <Link to={`${process.env.PUBLIC_URL}/waiter/order/new`}>New order</Link>
    <Link to={`${process.env.PUBLIC_URL}/waiter/order/123abc`}>Order no. 123abc</Link>
  </div>
);

export default Waiter;
