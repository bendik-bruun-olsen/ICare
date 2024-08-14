import React from "react";
import { Input, Label, NativeSelect, Icon } from "@equinor/eds-core-react";
import { edit } from "@equinor/eds-icons";
import { UserData } from "../../types";
import "./UserProfileForm.css";

interface UserProfileFormProps {
  userData: UserData | null;
  isEditing: boolean;
  handleEditClick: () => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  fullInfoContainerRef: React.RefObject<HTMLDivElement>;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  userData,
  isEditing,
  handleEditClick,
  handleChange,
  fullInfoContainerRef,
}) => {
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
