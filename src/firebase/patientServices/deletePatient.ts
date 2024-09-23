export const deletePatient = async (patientId: string): Promise<void> => {
	await deleteAdministeredPatient(patientId);
	await deleteAssignedPatient(patientId);
	await deletePatientFromDB(patientId);
};
