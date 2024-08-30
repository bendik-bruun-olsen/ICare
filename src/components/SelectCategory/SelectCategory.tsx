import React from "react";
import { Autocomplete } from "@equinor/eds-core-react";
import { Variants } from "@equinor/eds-core-react/dist/types/components/types";
import styles from "./SelectCategory.module.css";

const options: string[] = ["Food", "Medicine", "Social", "Exercise", "Others"];

interface CategoryComponentProps {
	selectedOption: string | null;
	onSelectionChange: (value: string | null) => void;
	variant: Variants | undefined;
}

const SelectCategory: React.FC<CategoryComponentProps> = ({
	selectedOption,
	onSelectionChange,
	variant,
}) => {
	return (
		<div className={styles.wrapper}>
			<Autocomplete<string>
				label="Category"
				options={options}
				initialSelectedOptions={selectedOption ? [selectedOption] : []}
				onOptionsChange={({ selectedItems }) =>
					onSelectionChange(selectedItems[0] ?? null)
				}
				variant={variant}
			/>
		</div>
	);
};

export default SelectCategory;
