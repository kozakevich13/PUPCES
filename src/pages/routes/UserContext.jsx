// UserContext.js
import PropTypes from "prop-types";
import  { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null); // You can initialize this with user data received from the server

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
export function useUser() {
  return useContext(UserContext);
}

export default UserContext;
UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired, // Define prop types for 'children'
};
