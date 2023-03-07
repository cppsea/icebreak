import React, { createContext, useContext, useMemo, useState, ReactElement } from 'react';

type UserContext = {
  isLoggedIn: boolean
}

const initialState = {
  isLoggedIn: false,
};


const UserContext = createContext<UserContext>(initialState);


export function useUserContext() {
  const user = useContext(UserContext);
  if (user === null) {
    throw new Error(
      "Please ensure you're using `useUserContext` within userProvider",
    );
  }

  return user;
}

export function UserProvider(children: ReactElement) {
  const [user, setUser] = useState(initialState);

  const value = useMemo(() => {
    return {user, setUser};
  }, [user]);

  return <UserContext.Provider value={value.user}>{children}</UserContext.Provider>;
}



