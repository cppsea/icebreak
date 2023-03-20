import React, { createContext, useContext, useMemo, useState, ReactElement } from 'react';

type Props = {
  children: ReactElement
}

type Payload = {
  userId: string,
  firstName: string,
  lastName: string,
  avatar: string,
  email: string,
  joinedDate: string,
  lastLogin: string
}

type State = {
  isLoggedIn: boolean,
  data: Payload
}

type userContextType = {
  user: State,
  setUser: React.Dispatch<React.SetStateAction<State>>
}

const initialState: State = {
  isLoggedIn: false,
  data: {
    userId: "",
    firstName: "",
    lastName: "",
    avatar: "",
    email: "",
    joinedDate: "",
    lastLogin: ""
  } 
};


const UserContext = createContext<userContextType | null>(null);


export function useUserContext() {
  const user = useContext(UserContext);
  if (user === null) {
    throw new Error(
      "Please ensure you're using `useUserContext` within userProvider",
    );
  }

  return user;
}

export function UserProvider({children}: Props) {
  const [user, setUser] = useState(initialState);

  const value = useMemo(() => {
    return {user, setUser};
  }, [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}