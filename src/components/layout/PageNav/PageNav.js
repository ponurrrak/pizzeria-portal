import React from 'react';
import {NavLink} from 'react-router-dom';

const PageNav = () => (
  <nav>
    <NavLink exact to='/' activeClassName='active'>Dashboard</NavLink>
    <NavLink to='/tables' activeClassName='active'>Tables</NavLink>
    <NavLink to='/waiter' activeClassName='active'>Waiter</NavLink>
    <NavLink to='/kitchen' activeClassName='active'>Kitchen</NavLink>
    <NavLink to='/login' activeClassName='active'>Login</NavLink>
  </nav>
);

export default PageNav;
