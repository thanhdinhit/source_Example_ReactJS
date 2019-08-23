/* eslint-disable import/default */
import React from 'react';
import { render } from 'react-dom';
import Root from './root'
require('./favicon.ico'); // Tell webpack to load favicon.ico
require('./styles/styles.scss'); // Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.
require('./styles/customize-bootstrap/js/init.js')
require('./styles/bootstrap-datepicker/js/init.js')
require('./styles/jquery-treegrid/js/jquery.treegrid.js');
require('./styles/jquery-treegrid/js/jquery.treegrid.bootstrap3.js');
require('./styles/js/init.js')
import '../node_modules/toastr/build/toastr.min.css';

import { defaultOptionToastr } from './services/common.js'
import toastr from 'toastr'
defaultOptionToastr(toastr)
// Create an enhanced history that syncs navigation events with the store

render(
  <Root />
  , document.getElementById('app')
);
