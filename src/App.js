import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import { StylesProvider } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
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
import Tables from './components/views/Tables/tablesContainer';
import Waiter from './components/views/Waiter/WaiterContainer';
import store from './redux/store';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2B4C6F',
    },
    secondary: {
      main: '#DC004E',
    },
  },
});

const App = () => (
  <Provider store={store}>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
      </StylesProvider>
    </BrowserRouter>
  </Provider>
);

export default App;
