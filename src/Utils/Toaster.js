import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const success_toaster = (message) => {
  toast.success(message, {
    position: "top-right", // Use string directly for position
    theme: 'dark',
  });
}

export const error_toaster = (message) => {
  toast.error(message, {
    position: "top-right", // Use string directly for position
    theme: 'dark',
  });
}
