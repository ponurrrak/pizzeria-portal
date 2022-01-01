import React from 'react';
import PropTypes from 'prop-types';
import styles from './OrderNew.module.scss';

const OrderNew = ({location}) => (
  <div className={styles.component}>
    <h2>{`New order for table ${location.state ? location.state : 1}`}</h2>
  </div>
);

OrderNew.propTypes = {
  location: PropTypes.object,
};

export default OrderNew;
