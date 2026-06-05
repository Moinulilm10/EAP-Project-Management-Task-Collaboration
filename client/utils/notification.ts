import Swal from 'sweetalert2';
import { toast, ToastOptions } from 'react-toastify';

// Define a unified styled theme matching the modern, premium dark/light HSL scheme
const swalCustomClass = {
  popup: 'swal-premium-popup',
  title: 'swal-premium-title',
  htmlContainer: 'swal-premium-text',
  confirmButton: 'swal-premium-btn swal-premium-confirm-btn',
  cancelButton: 'swal-premium-btn swal-premium-cancel-btn',
};

const toastConfig: ToastOptions = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'colored',
};

export const notification = {
  // ─── Toasts (React Toastify) ───────────────────────────────────────────────

  successToast(message: string) {
    toast.success(message, {
      ...toastConfig,
      style: { background: 'var(--color-primary, #005fcc)', color: '#ffffff' },
    });
  },

  errorToast(message: string) {
    toast.error(message, {
      ...toastConfig,
      style: { background: 'var(--color-error, #ba1a1a)', color: '#ffffff' },
    });
  },

  infoToast(message: string) {
    toast.info(message, toastConfig);
  },

  warningToast(message: string) {
    toast.warning(message, toastConfig);
  },

  // ─── Rich Dialogs (SweetAlert2) ───────────────────────────────────────────

  alert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' = 'info') {
    return Swal.fire({
      title,
      text,
      icon,
      customClass: swalCustomClass,
      buttonsStyling: false,
      background: 'var(--color-surface-container-lowest, #ffffff)',
      color: 'var(--color-on-surface, #1a1a1a)',
    });
  },

  async confirm(title: string, text: string, confirmText = 'Confirm', cancelText = 'Cancel'): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      customClass: swalCustomClass,
      buttonsStyling: false,
      background: 'var(--color-surface-container-lowest, #ffffff)',
      color: 'var(--color-on-surface, #1a1a1a)',
    });
    return result.isConfirmed;
  },

  async prompt(title: string, placeholder: string, defaultValue = ''): Promise<string | null> {
    const result = await Swal.fire({
      title,
      input: 'text',
      inputPlaceholder: placeholder,
      inputValue: defaultValue,
      showCancelButton: true,
      customClass: swalCustomClass,
      buttonsStyling: false,
      background: 'var(--color-surface-container-lowest, #ffffff)',
      color: 'var(--color-on-surface, #1a1a1a)',
    });
    return result.isConfirmed ? result.value : null;
  },
};
