import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import MainLayout from './components/layout/MainLayout/MainLayout';
import Login from './components/views/Login/Login';
import Booking from './components/views/Booking/Booking';
import BookingNew from './components/views/BookingNew/BookingNew';
import Dashboard from './components/views/Dashboard/Dashboard';
import Events from './components/views/Events/Events';
import EventsNew from './components/views/EventsNew/EventsNew';
import Kitchen from './components/views/Kitchen/Kitchen';
import Order from './components/views/Order/Order';
import OrderNew from './components/views/OrderNew/OrderNew';
import Tables from './components/views/Tables/Tables';
import Waiter from './components/views/Waiter/Waiter';

const App = () => (
  <BrowserRouter>
    <MainLayout>
      <Switch>
        <Route exact path={`${process.env.PUBLIC_URL}/tables/booking/new`} component={BookingNew} />
        <Route exact path={`${process.env.PUBLIC_URL}/tables/booking/:id`} component={Booking} />
        <Route exact path={`${process.env.PUBLIC_URL}/tables/events/new`} component={EventsNew} />
        <Route exact path={`${process.env.PUBLIC_URL}/tables/events/:id`} component={Events} />
        <Route exact path={`${process.env.PUBLIC_URL}/tables`} component={Tables} />
        <Route exact path={`${process.env.PUBLIC_URL}/waiter/order/new`} component={OrderNew} />
        <Route exact path={`${process.env.PUBLIC_URL}/waiter/order/:id`} component={Order} />
        <Route exact path={`${process.env.PUBLIC_URL}/waiter`} component={Waiter} />
        <Route exact path={`${process.env.PUBLIC_URL}/kitchen`} component={Kitchen} />
        <Route exact path={`${process.env.PUBLIC_URL}/login`} component={Login} />
        <Route exact path={`${process.env.PUBLIC_URL}/`} component={Dashboard} />
      </Switch>
    </MainLayout>
  </BrowserRouter>
);

export default App;
