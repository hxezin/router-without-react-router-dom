import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Route, Router } from './router';
import About from './components/About.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Route path='/' component={<App />} />
      <Route path='/about' component={<About />} />
    </Router>
  </React.StrictMode>
);
