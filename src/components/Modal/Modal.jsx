import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { ModalBackdrop, ModalContent } from './Modal.styled';
import { useEffect } from 'react';

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ onClose, children }) => {
  useEffect(() => {
    window.addEventListener('keydown', handleClose);

    return () => {
      window.removeEventListener('keydown', handleClose);
    };
  });

  const handleClose = ({ target, currentTarget, code }) => {
    if (currentTarget === target || code === 'Escape') {
      onClose();
    }
    return;
  };

  return createPortal(
    <ModalBackdrop onClick={handleClose}>
      <ModalContent>{children}</ModalContent>
    </ModalBackdrop>,
    modalRoot
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};
