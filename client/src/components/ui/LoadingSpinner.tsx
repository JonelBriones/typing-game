import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "./ui.css";
export const LoadingSpinner = ({ size }: { size: string }) => {
  return <AiOutlineLoading3Quarters size={size} className="loading" />;
};
