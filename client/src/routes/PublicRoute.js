import { Route, Navigate } from "react-router-dom";

function PublicRoute({ children, isAuthenticated, ...rest }) {
    return <Route {...rest} render={({ location }) => (!isAuthenticated ? children : <Navigate to="/Home" />)} />;
}

export default PublicRoute;
