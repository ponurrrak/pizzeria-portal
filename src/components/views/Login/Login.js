import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import styles from './Login.module.scss';

const Login = () => (
  <Box className={styles.component}>
    <Paper variant="outlined" className={styles.formWrapper}>
      <form className={styles.form}>
        <Grid
          container
          direction="column"
          spacing={3}
        >
          <Grid item>
            <TextField id="login" label="Login" variant="outlined" />
          </Grid>
          <Grid item>
            < TextField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Button component={Link} to='/' className={styles.button} variant="contained" type="submit" color="secondary">
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  </Box>

);

export default Login;
