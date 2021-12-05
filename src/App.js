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
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <MainLayout>
      <Switch>
        <Route exact path='/tables/booking/new' component={BookingNew} />
        <Route exact path='/tables/booking/:id' component={Booking} />
        <Route exact path='/tables/events/new' component={EventsNew} />
        <Route exact path='/tables/events/:id' component={Events} />
        <Route exact path='/tables' component={Tables} />
        <Route exact path='/waiter/order/new' component={OrderNew} />
        <Route exact path='/waiter/order/:id' component={Order} />
        <Route exact path='/waiter' component={Waiter} />
        <Route exact path='/kitchen' component={Kitchen} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/' component={Dashboard} />
      </Switch>
    </MainLayout>
  </BrowserRouter>
);

export default App;
