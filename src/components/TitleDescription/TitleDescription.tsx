import React from "react";
import { Input, Label, TextField } from "@equinor/eds-core-react";
import { Variants } from "@equinor/eds-core-react/dist/types/components/types";
import styles from "./TitleDescription.module.css";

interface TitleDescription {
	title: string;
	setTitle: (value: string) => void;
	titleVariant?: Variants;
	description: string;
	setDescription: (value: string) => void;
	descriptionVariant?: Variants;
}

export default function TitleDescription({
	title,
	setTitle,
	titleVariant,
	description,
	setDescription,
	descriptionVariant,
}: TitleDescription): JSX.Element {
	return (
		<div className={styles.wrapper}>
			<div className={styles.title}>
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
			</div>
			<div className={styles.description}>
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
			</div>
		</div>
	);
}
