import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({open, children, onClose }) {
  const dialog = useRef();

 useEffect(()=> {
  if(open) {
    dialog.current.showModal();
  } else {
    dialog.current.close();
  }
 }, [open])

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {open ? children : null}
    </dialog>,
    document.getElementById('modal')
  );
};




/*

useEffect(()=> {
  if(open) {
    dialog.current.showModal();
  } else {
    dialog.current.close();
  }
 }, [open])

 why [open]
 this will make sure that this effect function will now run again whenever the modal component function executed and the value of the 
 open prop changed.
 So if it was true and is again true, this will not run.
 If it was true and is now false, this will run and vice versa.


old approach:

const Modal = forwardRef(function Modal({ children }, ref) {
  const dialog = useRef();

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current.showModal();
      },
      close: () => {
        dialog.current.close();
      },
    };
  });
*/
