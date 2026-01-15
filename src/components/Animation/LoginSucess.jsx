import Lottie from "lottie-react";
import animationData from "../Animation/Sucess.json";
import "./LoginSucess.scss";

const LoginSucess = () => {
  return (
    <div className="login-success">
      <Lottie animationData={animationData} loop={false} />
    </div>
  );
};

export default LoginSucess;
