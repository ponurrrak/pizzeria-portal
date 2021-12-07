import React from 'react';
import {Link} from 'react-router-dom';
import styles from './Tables.module.scss';

const Tables = () => {
  return (
    <div className={styles.component}>
      <h2>Tables View</h2>
      <Link to='/tables/booking/new'>New table booking</Link>
      <Link to='/tables/booking/456def'>Table booking no. 456def</Link>
      <Link to='/tables/events/new'>New event</Link>
      <Link to='/tables/events/789ghi'>Event no. 789ghi</Link>
    </div>
  );
};
export default Tables;
