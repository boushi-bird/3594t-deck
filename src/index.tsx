import './index.css';
import WebFontLoader from 'webfontloader';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/App';
import store from './store';
import unmanagedStore from './unmanagedStore';
import { windowActions } from './modules/window';

WebFontLoader.load({
  custom: {
    families: ['Noto Sans Japanese:n4,n7'],
    urls: ['https://fonts.googleapis.com/earlyaccess/notosansjapanese.css'],
  },
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').catch((e) => {
    console.error(e);
  });
}

window.addEventListener(
  'beforeinstallprompt',
  (event: BeforeInstallPromptEvent) => {
    event.preventDefault();
    unmanagedStore.installPromptEvent = event;
    store.dispatch(windowActions.storeInstallPromptEvent());
  }
);

const receiveNoticeChanged = (noticeEnabled?: boolean) => {
  store.dispatch(
    windowActions.changeShowNotice({ showNotice: !!noticeEnabled })
  );
};

receiveNoticeChanged(window.__noticeEnabled);

// タグマネージャー等他の要素からイベントを発行させる
window.addEventListener('__receiveNoticeChanged', (event: Event) => {
  event.preventDefault();
  receiveNoticeChanged(window.__noticeEnabled);
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
