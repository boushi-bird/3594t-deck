import './index.css';
import WebFontLoader from 'webfontloader';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/App';
import store from './store';

WebFontLoader.load({
  custom: {
    families: ['Noto Sans Japanese:n1,n4,n7'],
    urls: ['https://fonts.googleapis.com/earlyaccess/notosansjapanese.css'],
  },
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

const about = document.getElementById('about');
if (about && about.parentNode) {
  about.parentNode.removeChild(about);
}
