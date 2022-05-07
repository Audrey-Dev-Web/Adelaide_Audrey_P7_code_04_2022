import { Route, Navigate, Outlet } from "react-router-dom";

function PrivateRoute({ children, isAuthenticated, ...rest }) {
    return <Route {...rest} render={({ location }) => (isAuthenticated ? children : <Navigate to="/Login" />)} />;
}

export default PrivateRoute;
