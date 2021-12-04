import React from 'react';
import {Link} from 'react-router-dom';
import styles from './Tables.module.scss';

const Tables = () => (
  <div className={styles.component}>
    <h2>Tables View</h2>
    <Link to={`${process.env.PUBLIC_URL}/tables/booking/new`}>New table booking</Link>
    <Link to={`${process.env.PUBLIC_URL}/tables/booking/456def`}>Table booking no. 456def</Link>
    <Link to={`${process.env.PUBLIC_URL}/tables/events/new`}>New event</Link>
    <Link to={`${process.env.PUBLIC_URL}/tables/events/789ghi`}>Event no. 789ghi</Link>
  </div>
);

export default Tables;
