import React from "react";

interface Props {
  id: string;
  header: string;
  body: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal = ({ id, header, body, footer }: Props) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
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
