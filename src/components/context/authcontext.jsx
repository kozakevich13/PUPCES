import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../app-service/firebase-config"; 
import PropTypes from "prop-types";


const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
         console.log("Firebase Auth State Changed:", user);
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
}
AuthProvider.propTypes = {
  children: PropTypes.node, // You can also use PropTypes.element if you expect only one child
};