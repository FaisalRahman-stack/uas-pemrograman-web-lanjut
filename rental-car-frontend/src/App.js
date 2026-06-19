import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.js';
import RentalForm from './pages/RentalForm.js';

function App() {
  const dashboardComponent = React.createElement(Dashboard, null);
  const rentalFormComponent = React.createElement(RentalForm, null);

  return React.createElement(Router, null, 
    React.createElement('div', { style: { fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '10px' } }, 
      React.createElement(Routes, null, 
        React.createElement(Route, { path: '/', element: dashboardComponent }),
        React.createElement(Route, { path: '/rental/:id', element: rentalFormComponent })
      )
    )
  );
}

export default App;