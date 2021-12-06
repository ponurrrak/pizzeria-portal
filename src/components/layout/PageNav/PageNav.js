import React from 'react';
import {NavLink} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import styles from './PageNav.module.scss';

const PageNav = () => (
  <nav className={styles.component}>
    <Button className={styles.link} component={NavLink} exact to='/' activeClassName={styles.active}>Dashboard</Button>
    <Button className={styles.link} component={NavLink} to='/tables' activeClassName={styles.active}>Tables</Button>
    <Button className={styles.link} component={NavLink} to='/waiter' activeClassName={styles.active}>Waiter</Button>
    <Button className={styles.link} component={NavLink} to='/kitchen' activeClassName={styles.active}>Kitchen</Button>
    <Button className={styles.link} component={NavLink} to='/login' activeClassName={styles.active}>Login</Button>
  </nav>
);

export default PageNav;
