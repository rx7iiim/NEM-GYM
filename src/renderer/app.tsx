import React from 'react';
import * as ReactDOM from 'react-dom/client';
import  { Router } from './main';
import { EmailProvider } from './context/emailContext';


function render() {
  const root = ReactDOM.createRoot(document.getElementById('app')!);
  root.render(
    <React.StrictMode>
      <EmailProvider>
      <Router />
      </EmailProvider>
    </React.StrictMode>
  );
}

render();