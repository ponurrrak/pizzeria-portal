import { connect } from 'react-redux';
import Booking from './Booking';
import { loadBookingChanges } from '../../../redux/bookingTablesRedux';


const mapDispatchToProps = dispatch => ({
  putEditedBookingOnAPI: editedBooking => dispatch(loadBookingChanges(editedBooking)),
});

export default connect(null, mapDispatchToProps)(Booking);
