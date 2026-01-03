import toast from "react-hot-toast";

const ToastMessage = ({ Message }) => {
  toast((t) => {
    return <span>{Message}</span>;
  });
};

export default ToastMessage;
