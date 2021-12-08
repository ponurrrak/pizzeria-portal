import { connect } from 'react-redux';
import Waiter from './Waiter';
import { getAll, fetchFromAPI, getLoadingState, loadNewTableStatus } from '../../../redux/tablesRedux';

const mapStateToProps = (state) => ({
  tables: getAll(state),
  loading: getLoadingState(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchTables: () => dispatch(fetchFromAPI()),
  loadNewTableStatus: newStatusTable => dispatch(loadNewTableStatus(newStatusTable)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Waiter);
