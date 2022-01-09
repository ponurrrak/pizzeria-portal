import { connect } from 'react-redux';
import Tables from './Tables';
import { getAll, fetchBookingTablesFromAPI, getLoadingState } from '../../../redux/bookingTablesRedux';

const mapStateToProps = (state) => ({
  bookingTables: getAll(state),
  loading: getLoadingState(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchBookingTables: () => dispatch(fetchBookingTablesFromAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
