import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  className?: string;
}

const ProgressBar = ({ value, className = "" }: ProgressBarProps) => (
  <div className={`h-1.5 w-full bg-secondary rounded-full overflow-hidden ${className}`}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
      className="h-full bg-primary rounded-full"
    />
  </div>
);

export default ProgressBar;
