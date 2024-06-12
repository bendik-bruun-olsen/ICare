export interface User {
	id: string;
	name: string;
	email: string;
}

export interface StateContextType {
	user: User | undefined;
	setUser: (user: User | null) => void;
}
