import { createContext, useState } from "react";
import { User, StateContextType } from "../types/User";

const defaultState: StateContextType = {
	user: undefined,
	setUser: () => {},
};

const StateContext = createContext<StateContextType>(defaultState);

export const StateContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);

	return (
		<StateContext.Provider value={{ user, setUser }}>
			{children}
		</StateContext.Provider>
	);
};

// How to use:
// import { StateContext } from '../contexts/StateContext';
// const context = useContext(StateContext);
// if (!context) {
//    throw new Error("StateContext must be used within a StateContextProvider")
// }
// const { user, setUser } = context;
