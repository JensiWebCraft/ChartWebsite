import "./Footer.scss";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      {/* <div className="socials">
        <FaFacebookF />
        <FaInstagram />
        <FaTwitter />
        <FaGithub />
        <FaYoutube />
      </div> */}

      <ul className="links">
        <li>Home</li>
        <li>News</li>
        <li>About</li>
        <li>Contact</li>
        <li>Our Team</li>
      </ul>
    </footer>
  );
};

export default Footer;
