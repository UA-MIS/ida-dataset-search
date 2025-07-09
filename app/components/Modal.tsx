import React from "react";

interface Props {
  id: string;
  header: string;
  body: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  height?: string; // Tailwind height classes like 'h-96', 'h-screen', etc.
}

const Modal = ({ id, header, body, footer, size = "md", height }: Props) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <dialog id={id} className="modal">
      <div className={`modal-box ${sizeClasses[size]} ${height || ""}`}>
        <h3 className="font-bold text-lg">{header}</h3>
        <div className="py-4">{body}</div>
        {footer && <div className="modal-action">{footer}</div>}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default Modal;
