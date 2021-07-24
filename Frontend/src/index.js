import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import 'assets/plugins/nucleo/css/nucleo.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'assets/scss/argon-dashboard-react.scss';

import AdminLayout from 'layouts/Admin.js';
import LoginPage from 'pages/LoginPage';
import RegisterPage from 'pages/RegisterPage';
import DashboardPage from 'pages/DashboardPage';

ReactDOM.render(
  <BrowserRouter >
    <Switch>
      {/* <Route path='/admin' render={(props) => <AdminLayout {...props} />} /> */}
      <Route path='/' exact component={LoginPage} />
      <Route path='/register' exact component={RegisterPage} />
      <Route path='/dashboard' exact component={DashboardPage} />
      {/* <Redirect from='/' to='/login' /> */}
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
