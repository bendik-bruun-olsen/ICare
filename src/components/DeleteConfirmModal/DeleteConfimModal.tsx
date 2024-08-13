import styles from "./DeleteConfirmModal.module.css";
import { DeleteConfirmModalProps } from "../../types";
import { Button } from "@equinor/eds-core-react";
// import React from 'react';

export default function DeleteConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	type,
}: DeleteConfirmModalProps) {
	if (!isOpen) return null;
	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<h3>Are you sure?</h3>
				<p>Do you really want to delete this {type}?</p>
				<p>This action cannot be undone.</p>
				<div className={styles.actionButtons}>
					<Button onClick={onConfirm}>Confirm</Button>
					<Button onClick={onClose}>Cancel</Button>
				</div>
			</div>
		</div>
	);
}
