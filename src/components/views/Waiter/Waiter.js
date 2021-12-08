import React from 'react';
import PropTypes from 'prop-types';
import styles from './Waiter.module.scss';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class Waiter extends React.Component {
  static propTypes = {
    fetchTables: PropTypes.func,
    loadNewTableStatus: PropTypes.func,
    tables: PropTypes.array,
    loading: PropTypes.shape({
      active: PropTypes.bool,
      error: PropTypes.oneOfType([PropTypes.bool,PropTypes.string]),
    }),
  }

  componentDidMount(){
    const { fetchTables } = this.props;
    fetchTables();
  }

  renderActions(table){
    const { loadNewTableStatus } = this.props;
    const renderActionButton = (action) => {
      const payload = {
        ...table,
        status: action === 'new order' ? 'ordered': action,
      };
      return (
        <Button onClick={() => loadNewTableStatus(payload)}>
          {action}
        </Button>
      );
    };
    switch (table.status) {
      case 'free':
        return (
          <>
            <span>{renderActionButton('thinking')}</span>
            <span>{renderActionButton('new order')}</span>
          </>
        );
      case 'thinking':
        return renderActionButton('new order');
      case 'ordered':
        return renderActionButton('prepared');
      case 'prepared':
        return renderActionButton('delivered');
      case 'delivered':
        return renderActionButton('paid');
      case 'paid':
        return renderActionButton('free');
      default:
        return null;
    }
  }

  render() {
    const { loading: { active, error }, tables } = this.props;
    tables.sort((a, b) => a.id - b.id);

    if(active || !tables.length){
      return (
        <Paper className={styles.component}>
          <p>Loading...</p>
        </Paper>
      );
    } else if(error) {
      return (
        <Paper className={styles.component}>
          <p>Error! Details:</p>
          <pre>{error}</pre>
        </Paper>
      );
    } else {
      return (
        <Paper className={styles.component}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Table</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tables.map(row => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>
                    {row.status}
                  </TableCell>
                  <TableCell>
                    {row.order && (
                      <Button to={`${process.env.PUBLIC_URL}/waiter/order/${row.order}`}>
                        {row.order}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {this.renderActions(row)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      );
    }
  }
}

export default Waiter;
