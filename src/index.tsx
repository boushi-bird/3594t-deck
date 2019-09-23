import './index.css';
import WebFontLoader from 'webfontloader';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './containers/App';
import store from './store';
import { windowActions } from './modules/window';

WebFontLoader.load({
  custom: {
    families: ['Noto Sans Japanese:n4,n7'],
    urls: ['https://fonts.googleapis.com/earlyaccess/notosansjapanese.css'],
  },
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').catch(e => {
    console.error(e);
  });
}

window.addEventListener(
  'beforeinstallprompt',
  (event: BeforeInstallPromptEvent) => {
    event.preventDefault();
    store.dispatch(windowActions.storeInstallPromptEvent(event));
  }
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route component={App} />
    </Router>
  </Provider>,
  document.getElementById('app')
);

const about = document.getElementById('about');
if (about && about.parentNode) {
  about.parentNode.removeChild(about);
}
