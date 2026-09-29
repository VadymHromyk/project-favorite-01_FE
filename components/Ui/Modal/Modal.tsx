"use client";

import React, { useEffect, useCallback, useSyncExternalStore } from "react";
import css from "./Modal.module.css";
import { createPortal } from "react-dom";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface BaseModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose: () => void;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const Modal = ({ children, isOpen = true, onClose }: BaseModalProps) => {
  const isMounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useLockBodyScroll(!!isOpen);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <div className={css.header}>
          <button
            onClick={onClose}
            className={css.closeButton}
            aria-label="Close"
          >
            <svg className={css.xIcon} width="24" height="24">
              <use href="/sprite.svg#close"></use>
            </svg>
          </button>
        </div>

        <div className={css.content}>{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
