import React from "react";
import { Input, Label, TextField } from "@equinor/eds-core-react";
import styled from "styled-components";

const StyledTitleDescription = styled.div`
  margin-bottom: 20px;
`;

type TitleDescriptionProps = {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
};

const TitleDescription: React.FC<TitleDescriptionProps> = ({
  title,
  setTitle,
  description,
  setDescription,
}) => {
  return (
    <>
      <StyledTitleDescription>
        <Label htmlFor="title" label="Title" />
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />
      </StyledTitleDescription>
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
    </>
  );
};

export default TitleDescription;
