import styles from "./StepIndicator.module.scss";

interface Step {
  id: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStepIndex: number;
}

export default function StepIndicator({
  steps,
  currentStepIndex,
}: StepIndicatorProps) {
  return (
    <div className={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isActive = index === currentStepIndex;
        const isPending = index > currentStepIndex;

        let statusClass = "";
        if (isCompleted) statusClass = styles.completed;
        else if (isActive) statusClass = styles.active;
        else if (isPending) statusClass = styles.pending;

        return (
          <div key={step.id} className={`${styles.step} ${statusClass}`}>
            <div className={styles.circle}>{isCompleted ? "✓" : step.id}</div>
            <span className={styles.label}>{step.label}</span>
            {index < steps.length - 1 && <div className={styles.line} />}
          </div>
        );
      })}
    </div>
  );
}
