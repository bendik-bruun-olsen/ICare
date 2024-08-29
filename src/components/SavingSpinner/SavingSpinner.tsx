import React from "react";
import { Progress } from "@equinor/eds-core-react";
import styles from "./SavingSpinner.module.css";

const SavingSpinner: React.FC = () => {
  return (
    <div className={styles.spinnerOverlay}>
      <p>Saving</p>
      <Progress.Dots color="neutral" />
    </div>
  );
};

export default SavingSpinner;
