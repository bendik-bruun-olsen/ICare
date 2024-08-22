import React, { useState, useEffect, useRef } from "react";
import { Input, Label, NativeSelect, Icon } from "@equinor/eds-core-react";
import { edit } from "@equinor/eds-icons";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { UserData } from "../../types";
import "./UserProfileForm.css";

const UserProfileForm: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser } = useAuth();
  const fullInfoContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fullInfoContainerRef.current &&
        !fullInfoContainerRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    const updatedData = { ...userData, [id]: value } as UserData;
    setUserData(updatedData);

    if (currentUser?.email) {
      try {
        const userDocRef = doc(db, "users", currentUser.email);
        await updateDoc(userDocRef, { [id]: value });
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
  };

  return (
    <div className="fullInfoContainer" ref={fullInfoContainerRef}>
      <div className="userInfo">
        <h2>User Information</h2>
        <Icon
          data={edit}
          onClick={handleEditClick}
          style={{ color: isEditing ? "grey" : "black", cursor: "pointer" }}
        />
      </div>
      <div className="inputGroup">
        <Label htmlFor="name" label="Name" />
        <Input
          id="name"
          type="text"
          value={userData?.name || ""}
          onChange={handleChange}
          readOnly={!isEditing}
          className={isEditing ? "editable" : ""}
        />
      </div>
      <div className="inputGroup">
        <Label htmlFor="age" label="Age" />
        <Input
          id="age"
          type="number"
          value={userData?.age || ""}
          onChange={handleChange}
          readOnly={!isEditing}
          className={isEditing ? "editable" : ""}
        />
      </div>
      <div className="inputGroup">
        <Label htmlFor="gender" label="Gender" />
        <NativeSelect
          id="gender"
          label=""
          value={userData?.gender || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className={isEditing ? "editable" : ""}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </NativeSelect>
      </div>
      <div className="inputGroup">
        <Label htmlFor="phone" label="Phone" />
        <Input
          id="phone"
          type="tel"
          value={userData?.phone || ""}
          onChange={handleChange}
          readOnly={!isEditing}
          className={isEditing ? "editable" : ""}
        />
      </div>
      <div className="inputGroup">
        <Label htmlFor="email" label="Email" />
        <Input id="email" type="email" value={userData?.email || ""} readOnly />
      </div>
    </div>
  );
};

export default UserProfileForm;
