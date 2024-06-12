import { Input, Label } from "@equinor/eds-core-react";
import React, { useState } from "react";
import styled from "styled-components";

// type TitleDescriptionComponentProps = {};

const StyledTitleDescription = styled.div`
  width: 200px;
`;

const TitleDescriptionComponent: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  return (
    <>
      <StyledTitleDescription>
        <div>
          <Label htmlFor="title" label="Title*" />
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
        </div>
        <div>
          <Label htmlFor="description" label="Description" />
          <Input
            type="text"
            id="description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
          />
        </div>
      </StyledTitleDescription>
    </>
  );
};
export default TitleDescriptionComponent;
