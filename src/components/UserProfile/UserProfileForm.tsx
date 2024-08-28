import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input, Label, NativeSelect, Icon } from "@equinor/eds-core-react";
import { edit } from "@equinor/eds-icons";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { UserData } from "../../types";
import styles from "./UserProfileForm.module.css";

const UserProfileForm: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false); // Track if data has changed
  const { currentUser } = useAuth();
  const fullInfoContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.email) {
        const userDocRef = doc(db, "users", currentUser.email);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as UserData;
          setUserData(data);
        } else {
          console.error("No such document!");
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const saveDataToFirebase = useCallback(async () => {
    if (currentUser?.email && userData && isChanged) {
      try {
        const userDocRef = doc(db, "users", currentUser.email);
        await updateDoc(userDocRef, { ...userData });
        console.log("Document successfully updated!");
        setIsChanged(false); // Reset the changed state after saving
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
  }, [currentUser, userData, isChanged]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (isChanged) {
        saveDataToFirebase();
      }
    }, 2000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [userData, saveDataToFirebase, isChanged]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fullInfoContainerRef.current &&
        !fullInfoContainerRef.current.contains(event.target as Node)
      ) {
        if (isChanged) {
          saveDataToFirebase();
        }
        setIsEditing(false);
      }
    };

    const handleBeforeUnload = () => {
      if (isChanged) {
        saveDataToFirebase();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userData, saveDataToFirebase, isChanged]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;

    setUserData(
      (prevData) =>
        ({
          ...prevData,
          [id]: value,
        } as UserData)
    );

    setIsChanged(true);
  };

  return (
    <div className={styles.fullInfoContainer} ref={fullInfoContainerRef}>
      <div className={styles.userInfo}>
        <h2>User Information</h2>
        <Icon
          data={edit}
          onClick={handleEditClick}
          className={`${styles.icon} ${isEditing ? styles.editing : ""}`}
        />
      </div>
      <div className={styles.inputGroup}>
        <Label htmlFor="name" label="Name" />
        <Input
          id="name"
          type="text"
          value={userData?.name || ""}
          onChange={handleChange}
          readOnly={!isEditing}
          className={isEditing ? styles.editable : ""}
        />
      </div>
      <div className={styles.inputGroup}>
        <Label htmlFor="age" label="Age" />
        <Input
          id="age"
          type="number"
          value={userData?.age || ""}
          onChange={handleChange}
          readOnly={!isEditing}
          className={isEditing ? styles.editable : ""}
        />
      </div>
      <div className={styles.inputGroup}>
        <Label htmlFor="gender" label="Gender" />
        <NativeSelect
          id="gender"
          label=""
          value={userData?.gender || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className={isEditing ? styles.editable : ""}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </NativeSelect>
      </div>
      <div className={styles.inputGroup}>
        <Label htmlFor="phone" label="Phone" />
        <Input
          id="phone"
          type="tel"
          value={userData?.phone || ""}
          onChange={handleChange}
          readOnly={!isEditing}
          className={isEditing ? styles.editable : ""}
        />
      </div>
      <div className={styles.inputGroup}>
        <Label htmlFor="email" label="Email" />
        <Input id="email" type="email" value={userData?.email || ""} readOnly />
      </div>
    </div>
  );
};

export default UserProfileForm;
