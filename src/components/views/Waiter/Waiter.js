import React from 'react';
import {Link} from 'react-router-dom';
import shortid from 'shortid';
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

  renderActionButton(table, action){
    const { loadNewTableStatus } = this.props;
    const payload = {
      ...table,
      status: action === 'new order' ? 'ordered': action,
      order: action === 'new order' ? shortid.generate() : action === 'free' ? null : table.order,
    };
    return (
      <Button onClick={() => loadNewTableStatus(payload)}>
        {action}
      </Button>
    );
  }

  renderActions(table){
    switch (table.status) {
      case 'free':
        return (
          <>
            <span>{this.renderActionButton(table, 'thinking')}</span>
            <span>{this.renderActionButton(table, 'new order')}</span>
          </>
        );
      case 'thinking':
        return this.renderActionButton(table, 'new order');
      case 'ordered':
        return this.renderActionButton(table, 'prepared');
      case 'prepared':
        return this.renderActionButton(table, 'delivered');
      case 'delivered':
        return this.renderActionButton(table, 'paid');
      case 'paid':
        return this.renderActionButton(table, 'free');
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
                      <Button component={Link} to={`/waiter/order/${row.order}`}>
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
