import React, { createContext, useContext, useMemo, useState } from 'react';

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
      onboardingCompleted: () => {
        setUser((prevUser) => ({ ...prevUser, isLoggedIn: true }));
      },
    };
  }, [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const user = useContext(UserContext);
  if (user === undefined) {
    throw new Error(
      "Please ensure you're using `useUserContext` within userProvider",
    );
  }

  return user;
}
