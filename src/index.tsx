import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as qs from 'qs';
import App from './App';
import Track from './Track';
import './index.css';
import Recommendations from './Recommendations';

var urlParams = qs.parse(window.location.search.substr(1));
console.log(urlParams)
switch (urlParams["page"]) {
  case "track":
    ReactDOM.render(<Track />, document.getElementById('root'));
    break;
  case "recommendations":
    ReactDOM.render(<Recommendations />, document.getElementById('root'));
    break;
  case undefined:
  default:
    ReactDOM.render(<App />, document.getElementById('root'));
    break;
}
