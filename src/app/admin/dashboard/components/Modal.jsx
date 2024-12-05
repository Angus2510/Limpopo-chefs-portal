import React from 'react';
import { FiX, FiTrash2 } from 'react-icons/fi';

const Modal = ({ show, onClose, onDelete, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}><FiX /></button>
        {onDelete && (
          <button className="modal-delete" onClick={onDelete}><FiTrash2 /></button>
        )}
        <div className="modal-content">
          {children}
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal {
          background: white;
          padding: 20px;
          border-radius: 5px;
          max-width: 500px;
          width: 100%;
          position: relative;
        }
        .modal-close, .modal-delete {
          background: none;
          border: none;
          font-size: 1.5rem;
          position: absolute;
          top: 10px;
          cursor: pointer;
        }
        .modal-close {
          right: 20px;
        }
        .modal-delete {
          left: 20px;
          color: red;
        }
        .modal-content {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default Modal;
