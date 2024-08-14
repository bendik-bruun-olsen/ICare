import React from "react";
import { Input, Label, TextField } from "@equinor/eds-core-react";
import styled from "styled-components";
import { Variants } from "@equinor/eds-core-react/dist/types/components/types";

const StyledTitleDescription = styled.div``;

type TitleDescriptionProps = {
	title: string;
	setTitle: (value: string) => void;
	titleVariant: Variants | undefined;
	description: string;
	setDescription: (value: string) => void;
	descriptionVariant: Variants | undefined;
};

const TitleDescription: React.FC<TitleDescriptionProps> = ({
	title,
	setTitle,
	titleVariant,
	description,
	setDescription,
	descriptionVariant,
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
					variant={titleVariant}
				/>
			</StyledTitleDescription>
			<>
				<TextField
					id="description"
					label="Description"
					multiline
					rows={3}
					value={description}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setDescription(e.target.value)
					}
					variant={descriptionVariant}
				/>
			</>
		</>
	);
};

export default TitleDescription;
