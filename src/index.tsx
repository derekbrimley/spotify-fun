import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import Track from './Track';
import './index.css';

function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  e = r.exec(q)
  while (e) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
     e = r.exec(q);
  }
  return hashParams;
}

var urlParams = getHashParams();
console.log(urlParams)
switch (urlParams["page"]) {
  case "track":
    ReactDOM.render(<Track />, document.getElementById('root'));
    break;

  case undefined:
  default:
    ReactDOM.render(<App />, document.getElementById('root'));
    break;
}
