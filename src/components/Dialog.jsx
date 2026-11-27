import { useEffect, useRef } from "react";

export default function Dialog({ title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog ref={ref} className="modal-card" aria-label={title}
      onCancel={(event) => { event.preventDefault(); onClose(); }}>
      {children}
    </dialog>
  );
}
