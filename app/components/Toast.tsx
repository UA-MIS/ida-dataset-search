import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  color?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  color = "success",
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${color} fixed top-4 right-4 z-50`}>
      <div className={`alert alert-${color}`}>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
