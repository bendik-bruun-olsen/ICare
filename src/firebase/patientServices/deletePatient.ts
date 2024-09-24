import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { NotificationContext, NotificationType } from "../../types";

export const deletePatient = async (
  patientId: string

  // addNotification: NotificationContext["addNotification"]
): Promise<void> => {
  try {
    const patientRef = doc(db, "patientdetails", patientId);
    const userRef = doc(db, "users");
    const userCollection = collection(userRef, "user.email");
    const managedPatient = doc(userCollection, patientId);

    const q = query(
      userCollection,
      where("administeredPatient", "array-contains", {
        patientId: patientId,
      }),
      where("assignedPatient", "array-contains", { patientId: patientId })
    );

    const querySnap = await getDocs(q);
    if (querySnap.empty) {
      // addNotification("No patients found", NotificationType.ERROR);
      return;
    }

    const batch = writeBatch(db);
    querySnap.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    batch.delete(managedPatient);

    if (!patientRef) {
      // addNotification("Patient not found", NotificationType.ERROR);
    }

    await Promise.all([deleteDoc(patientRef), batch.commit()]);
    // addNotification("Patient deleted", NotificationType.SUCCESS);
  } catch {
    // addNotification("Could not delete patient", NotificationType.ERROR);
  }
};
