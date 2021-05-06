import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Router, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import CreateAccount from '../components//CreateAccount'
import EditProfile from '../components/EditProfile'
import HomePage from '../components/HomePage';
import LoginPage from '../components/LoginPage';

import { login } from '../actions/auth';

import PrivateRoute from '../routers/PrivateRoute'
import PublicRoute from '../routers/PublicRoute'

export const history = createHistory();

const AppRouter = (props) => {

  useEffect(()=>{
    const strAuth = localStorage.getItem('auth');
    if(strAuth) {
        const auth = JSON.parse(strAuth);
        props.login({name: auth.name, jwt: auth.token});
    }
  }, [])

  return (
      <Router history={history}>
      <div>
        <Switch>
          <PublicRoute path="/console" component={LoginPage} exact={true}/>
          <PrivateRoute path="/home" component={HomePage} />
          <PrivateRoute path="/edit" component={EditProfile} />
          <PrivateRoute path="/create" component={CreateAccount} />
        </Switch>
      </div>
    </Router>
  )
}

const mapDispatchToProps = (dispatch)=>({
  login: (userObj) => dispatch(login(userObj))
})

export default connect(undefined, mapDispatchToProps)(AppRouter);
