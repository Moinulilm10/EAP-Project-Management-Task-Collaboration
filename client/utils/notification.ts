import { toast, ToastOptions } from "react-toastify";
import Swal from "sweetalert2";

// Define a unified styled theme matching the modern, premium dark/light HSL scheme
const swalCustomClass = {
  popup: "bg-surface-container-lowest text-on-surface border border-outline-variant/20 rounded-3xl p-6 shadow-elevation-3",
  title: "text-on-surface font-title-lg mb-2",
  htmlContainer: "text-secondary font-body-md mb-4",
  actions: "gap-4",
  confirmButton: "bg-primary text-on-primary hover:bg-primary/90 rounded-xl px-5 py-2.5 font-label-md transition-colors cursor-pointer",
  cancelButton: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-xl px-5 py-2.5 font-label-md transition-colors cursor-pointer",
};

const toastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

export const notification = {
  // ─── Toasts (React Toastify) ───────────────────────────────────────────────

  successToast(message: string) {
    toast.success(message, {
      ...toastConfig,
      style: {
        background: "var(--color-toast-success-bg, var(--color-surface-container-highest, #33353a))",
        color: "var(--color-toast-success-text, var(--color-on-surface, #e2e2e9))",
      },
    });
  },

  errorToast(message: string) {
    toast.error(message, {
      ...toastConfig,
      style: { background: "var(--color-error, #ba1a1a)", color: "#ffffff" },
    });
  },

  infoToast(message: string) {
    toast.info(message, toastConfig);
  },

  warningToast(message: string) {
    toast.warning(message, toastConfig);
  },

  // ─── Rich Dialogs (SweetAlert2) ───────────────────────────────────────────

  alert(
    title: string,
    text: string,
    icon: "success" | "error" | "warning" | "info" = "info",
  ) {
    return Swal.fire({
      title,
      text,
      icon,
      customClass: swalCustomClass,
      buttonsStyling: false,
      background: "var(--color-surface-container-lowest, #ffffff)",
      color: "var(--color-on-surface, #1a1a1a)",
    });
  },

  async confirm(
    title: string,
    text: string,
    confirmText = "Confirm",
    cancelText = "Cancel",
  ): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      customClass: swalCustomClass,
      buttonsStyling: false,
      background: "var(--color-surface-container-lowest, #ffffff)",
      color: "var(--color-on-surface, #1a1a1a)",
    });
    return result.isConfirmed;
  },

  async prompt(
    title: string,
    placeholder: string,
    defaultValue = "",
  ): Promise<string | null> {
    const result = await Swal.fire({
      title,
      input: "text",
      inputPlaceholder: placeholder,
      inputValue: defaultValue,
      showCancelButton: true,
      customClass: swalCustomClass,
      buttonsStyling: false,
      background: "var(--color-surface-container-lowest, #ffffff)",
      color: "var(--color-on-surface, #1a1a1a)",
    });
    return result.isConfirmed ? result.value : null;
  },
};
