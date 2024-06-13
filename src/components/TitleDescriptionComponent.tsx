import { Input, Label, TextField } from "@equinor/eds-core-react";
import React, { useState } from "react";
import styled from "styled-components";

// type TitleDescriptionComponentProps = {};

const StyledTitleDescription = styled.div`
  width: 300px;
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
          <TextField
            id="description"
            label="Description"
            multiline
            rows={3}
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
