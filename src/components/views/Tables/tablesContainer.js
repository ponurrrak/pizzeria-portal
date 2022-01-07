import { connect } from 'react-redux';
import Tables from './Tables';
import { getAll, fetchFromAPI, getLoadingState } from '../../../redux/bookingTablesRedux';

const mapStateToProps = (state) => ({
  bookingTables: getAll(state),
  loading: getLoadingState(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchBookingTables: () => dispatch(fetchFromAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
