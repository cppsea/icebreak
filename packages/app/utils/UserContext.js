import React, { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

const initialState = {
  isLoggedIn: false,
};

export const UserContext = createContext(initialState);

export function UserProvider({ children }) {
  const [user, setUser] = useState(initialState);

  const value = useMemo(() => {
    return {
      user,
      setUser,
    };
  }, [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

UserProvider.propTypes = {
  children: PropTypes.node,
};

export function useUserContext() {
  const user = useContext(UserContext);
  if (user === undefined) {
    throw new Error(
      "Please ensure you're using `useUserContext` within userProvider"
    );
  }

  return user;
}
