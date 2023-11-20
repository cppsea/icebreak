import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactElement,
} from "react";

type UserProviderProps = {
  children: ReactElement;
};

type Payload = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  isNew: boolean;
};

type State = {
  isLoggedIn: boolean;
  data?: Payload;
};

export type userContextType = {
  user: State;
  setUser: React.Dispatch<React.SetStateAction<State>>;
};

const initialState: State = {
  isLoggedIn: false,
  data: {
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
    isNew: true,
  },
};

export const UserContext = createContext<userContextType>({
  user: initialState,
  setUser: () => {},
});

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState(initialState);

  const value = useMemo(() => {
    return {
      user,
      setUser,
    };
  }, [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const user = useContext(UserContext);
  if (user === undefined) {
    throw new Error(
      "Please ensure you're using `useUserContext` within userProvider"
    );
  }

  return user;
}
