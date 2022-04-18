import { createContext } from "react";

const userContext = createContext();

export function UserContextProvider({ value, children }) {
  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}

export default userContext;
