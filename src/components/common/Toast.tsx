import { Toaster, ToastOptions } from "react-hot-toast";

const toastOptions: ToastOptions = {
  style: {
    padding: "16px",
    background: "rgb(31, 29, 43, 0.95)",
    color: "#FFFFFF",
    width: "fit-content",
    border: `1px solid #6366f1`,
    textTransform: "capitalize",
  },
} as ToastOptions;

const Toast = () => {
  return (
    <Toaster
      containerStyle={{ top: 50, right: 20 }}
      position="top-right"
      toastOptions={toastOptions}
    />
  );
};

export default Toast;
