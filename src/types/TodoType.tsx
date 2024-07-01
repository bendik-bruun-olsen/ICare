export interface TodoType {
	title: string;
	description: string;
	repeat: boolean;
	startDate: string;
	endDate: string | null;
	time: string;
	category: string | null;
	selectedDays: string[];
}
