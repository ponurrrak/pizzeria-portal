import { connect } from 'react-redux';
import BookingNew from './BookingNew';
import { postNewBooking } from '../../../redux/bookingTablesRedux';


const mapDispatchToProps = dispatch => ({
  addNewBooking: (newBooking, callback) => dispatch(postNewBooking(newBooking, callback)),
});

export default connect(null, mapDispatchToProps)(BookingNew);
