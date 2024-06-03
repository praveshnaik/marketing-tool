import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const isLoggedIn = window.localStorage.getItem('isLoggedIn');
  
    return (
        <div>
      <Route
        {...rest}
        element={isLoggedIn ? <Component /> : <Navigate to="/" replace />}
      />
      </div>
    );
  };
  export default ProtectedRoute