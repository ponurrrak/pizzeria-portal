import Axios from 'axios';
import {api} from '../settings';

/* selectors */
export const getAll = ({bookingTables}) => bookingTables.data;
export const getLoadingState = ({bookingTables}) => bookingTables.loading;

/* action name creator */
const reducerName = 'bookingTables';
const createActionName = name => `app/${reducerName}/${name}`;

/* action types */
const FETCH_START = createActionName('FETCH_START');
const FETCH_SUCCESS = createActionName('FETCH_SUCCESS');
const FETCH_ERROR = createActionName('FETCH_ERROR');
const EDIT_BOOKING = createActionName('EDIT_BOOKING');
const EDIT_EVENT = createActionName('EDIT_EVENT');
const ADD_BOOKING = createActionName('ADD_BOOKING');

/* action creators */
export const fetchStarted = payload => ({ payload, type: FETCH_START });
export const fetchSuccess = payload => ({ payload, type: FETCH_SUCCESS });
export const fetchError = payload => ({ payload, type: FETCH_ERROR });
export const editBooking = payload => ({ payload, type: EDIT_BOOKING });
export const editEvent = payload => ({ payload, type: EDIT_EVENT });
export const addNewBooking = payload => ({ payload, type: ADD_BOOKING });

/* thunk creators */
export const fetchBookingTablesFromAPI = () => {
  return (dispatch, getState) => {
    dispatch(fetchStarted());
    const promiseBookings = Axios.get(`${api.url}/api/${api.bookings}`);
    const promiseEvents = Axios.get(`${api.url}/api/${api.events}`);
    const promiseAll = Promise.all([promiseBookings, promiseEvents]);
    promiseAll
      .then(promises => {
        const data = promises[0].data.concat(promises[1].data);
        dispatch(fetchSuccess(data));
      })
      .catch(err => {
        dispatch(fetchError(err.message || true));
      });
  };
};

export const loadBookingChanges = (payload) => {
  return (dispatch, getState) => {
    dispatch(fetchStarted());
    Axios
      .put(`${api.url}/api/${api.bookings}/${payload.id}`, payload)
      .then(res => {
        if(payload.repeat){
          dispatch(editEvent(res.data));
        } else {
          dispatch(editBooking(res.data));
        }
        alert('Changes have been saved succesfully');
      })
      .catch(err => {
        dispatch(fetchError(err.message || true));
      });
  };
};

export const postNewBooking = (payload, callback) => {
  return (dispatch, getState) => {
    dispatch(fetchStarted());
    Axios
      .post(`${api.url}/api/${api.bookings}`, payload)
      .then(res => {
        dispatch(addNewBooking(res.data));
        callback(res.data.id);
      })
      .catch(err => {
        dispatch(fetchError(err.message || true));
      });
  };
};

/* reducer */
export default function reducer(statePart = [], action = {}) {
  switch (action.type) {
    case FETCH_START: {
      return {
        ...statePart,
        loading: {
          active: true,
          error: false,
        },
      };
    }
    case FETCH_SUCCESS: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: false,
        },
        data: action.payload,
      };
    }
    case FETCH_ERROR: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: action.payload,
        },
      };
    }
    case EDIT_BOOKING: {
      return {
        loading: {
          active: false,
          error: false,
        },
        data: [...statePart.data.filter(item =>
          item.repeat || item.id !== action.payload.id
        ), action.payload],
      };
    }
    case EDIT_EVENT: {
      return {
        loading: {
          active: false,
          error: false,
        },
        data: [...statePart.data.filter(item =>
          !item.repeat || item.id !== action.payload.id
        ), action.payload],
      };
    }
    case ADD_BOOKING: {
      return {
        loading: {
          active: false,
          error: false,
        },
        data: [...statePart.data, action.payload],
      };
    }
    default:
      return statePart;
  }
}
