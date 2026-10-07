"use client";
import { useEffect, useId, useRef, type KeyboardEvent, type RefObject } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
export function trapDialogFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab")
        return;
    const elements = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),summary,[tabindex="0"]')).filter(element => element.getClientRects().length > 0);
    const first = elements[0], last = elements[elements.length - 1];
    if (!first) {
        event.preventDefault();
        event.currentTarget.focus();
        return;
    }
    if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
        event.preventDefault();
        last.focus();
    }
    else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}
export function AdminDialog({ open, onClose, title, description, busy = false, initialFocus, dialogRef, size = "normal", children }: {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    busy?: boolean;
    initialFocus?: string;
    dialogRef?: RefObject<HTMLDialogElement | null>;
    size?: "normal" | "wide";
    children: React.ReactNode;
}) {
    const ownRef = useRef<HTMLDialogElement>(null);
    const ref = dialogRef ?? ownRef;
    const id = useId();
    const [scope, animate] = useAnimate();
    const reduced = useReducedMotion();
    useEffect(() => {
        if (!open)
            return;
        const dialog = ref.current;
        const opener = document.activeElement as HTMLElement | null;
        const overflow = document.body.style.overflow;
        dialog?.showModal();
        document.body.style.overflow = "hidden";
        const target = initialFocus ? dialog?.querySelector<HTMLElement>(initialFocus) : dialog?.querySelector<HTMLElement>("input, select, textarea");
        target?.focus();
        if (scope.current)
            void animate(scope.current, { opacity: [0.8, 1], y: reduced ? [0, 0] : [6, 0] }, { duration: reduced ? 0 : 0.18 });
        return () => { dialog?.close(); document.body.style.overflow = overflow; opener?.focus(); };
    }, [open, ref, initialFocus, animate, scope, reduced]);
    return <dialog onKeyDown={trapDialogFocus} ref={ref} className={`admin-theme admin-dialog ${size === "wide" ? "admin-dialog-wide" : ""}`} aria-labelledby={id} aria-describedby={description ? `${id}-description` : undefined} onCancel={event => { event.preventDefault(); if (!busy)
        onClose(); }} onClick={event => { if (event.target === event.currentTarget && !busy)
        onClose(); }}>
    <div ref={scope} className="admin-dialog-content">
      <header className="admin-dialog-header"><div><h2 id={id}>{title}</h2>{description && <p id={`${id}-description`} className="admin-muted mt-2">{description}</p>}</div><button type="button" className="admin-icon-button shrink-0" aria-label="Tutup dialog" disabled={busy} onClick={onClose}><X size={20}/></button></header>
      {children}
    </div>
  </dialog>;
}
