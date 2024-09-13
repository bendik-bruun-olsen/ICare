import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input, Label, NativeSelect, Icon } from "@equinor/eds-core-react";
import { edit } from "@equinor/eds-icons";
import getUserData from "../../firebase/UserProfileService/getUserData";
import updateUserData from "../../firebase/UserProfileService/updateUserData";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { User } from "../../types";
import SavingSpinner from "../SavingSpinner/SavingSpinner";
import styles from "./UserProfileForm.module.css";

export default function UserProfileForm(): React.ReactElement {
  const [userData, setUserData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const fullInfoContainerRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (currentUser?.email) {
        const data = await getUserData(currentUser.email);
        if (data) {
          setUserData(data);
        }
      }
    };
    fetchData();
  }, [currentUser]);

  const validateNameField = useCallback((): boolean => {
    const isUserNameEmpty = !userData?.name || userData.name.trim() === "";
    if (isUserNameEmpty) {
      setErrorMessage("Name field cannot be empty.");
      if (nameInputRef.current) {
        nameInputRef.current.focus();
        nameInputRef.current.setSelectionRange(
          nameInputRef.current.value.length,
          nameInputRef.current.value.length
        );
      }
      return false;
    }
    setErrorMessage(null);
    return true;
  }, [userData?.name]);

  const saveDataToFirebase = useCallback(async () => {
    const isUserDataValid = currentUser?.email && userData && isChanged;

    if (isUserDataValid) {
      if (!validateNameField()) {
        return;
      }

      setIsSaving(true);
      try {
        await updateUserData(currentUser.email, userData);
        setIsChanged(false);
      } catch (error) {
        console.error("Error updating document:", error);
      } finally {
        setTimeout(() => {
          setIsSaving(false);
        }, 500);
      }
    }
  }, [currentUser?.email, userData, isChanged, validateNameField]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (isChanged) {
        saveDataToFirebase();
      }
    }, 2000);

    return (): void => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [userData, saveDataToFirebase, isChanged]);

  useEffect(() => {
    const handleClick = (event: MouseEvent): void => {
      const target = event.target as Node;
      const isClickedOutsideContainer =
        fullInfoContainerRef.current &&
        !fullInfoContainerRef.current.contains(target);
      const isClickedOnForm =
        target !== nameInputRef.current &&
        (target instanceof HTMLInputElement ||
          target instanceof HTMLSelectElement);

      if (isClickedOutsideContainer) {
        if (!validateNameField()) {
          event.preventDefault();
          event.stopPropagation();
        }
        if (isChanged) {
          saveDataToFirebase();
        }
        setIsEditing(false);
      }
      if (isClickedOnForm) {
        if (!validateNameField()) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    };

    const handleBeforeUnload = (): void => {
      if (isChanged) {
        saveDataToFirebase();
      }
    };

    document.addEventListener("mousedown", handleClick);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return (): void => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [validateNameField, saveDataToFirebase, isChanged]);

  const handleEditClick = (): void => {
    setIsEditing(true);
    if (nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.setSelectionRange(
        nameInputRef.current.value.length,
        nameInputRef.current.value.length
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { id, value } = e.target;

    setUserData(
      (prevData) =>
        ({
          ...prevData,
          [id]: value,
        } as User)
    );

    setIsChanged(true);
  };

  return (
    <div className={styles.fullInfoContainer} ref={fullInfoContainerRef}>
      {isSaving && <SavingSpinner />}
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
          className={`${isEditing ? styles.editable : ""} ${
            errorMessage ? styles.errorInput : ""
          }`}
          ref={nameInputRef}
        />
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
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
}
