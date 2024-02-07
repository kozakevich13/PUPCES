// PrivateRoute.js

import PropTypes from "prop-types";
import { Navigate, Route } from "react-router-dom";
import { useUser } from "./UserContext";

export function PrivateRoute({ role, ...props }) {
  const { user } = useUser();

  if (user && user.roles.includes(role)) {
    return <Route {...props} />;
  } else {
    return <Navigate to="/" />; // Redirect unauthorized users to the home page
  }
}
export default PrivateRoute;

PrivateRoute.propTypes = {
  role: PropTypes.string.isRequired,
};
