import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RentalForm from './pages/RentalForm.js';

function App() {
  const rentalFormComponent = React.createElement(RentalForm, null);

  return React.createElement(Router, null, 
    React.createElement('div', { style: { padding: '20px' } }, 
      React.createElement(Routes, null, 
        React.createElement(Route, { path: '/', element: rentalFormComponent }),
        React.createElement(Route, { path: '/rental/:id', element: rentalFormComponent })
      )
    )
  );
}

export default App;