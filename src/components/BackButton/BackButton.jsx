import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./BackButton.scss";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="back-button"
      onClick={() => navigate(-1)}
      title="Go back"
    >
      <FiArrowLeft />
    </button>
  );
};

export default BackButton;
