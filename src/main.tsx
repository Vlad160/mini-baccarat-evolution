import { ApplicationStore, ApplicationStoreContext } from 'app.store';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApplicationStoreContext.Provider value={new ApplicationStore()}>
      <App />
    </ApplicationStoreContext.Provider>
  </React.StrictMode>
);
