import React from "react";
import "./Footer.css";
import StoreLogo from "../../images/icon.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <img
            src={StoreLogo}
            alt="Logo"
            className="footer-logo"
          />
        </div>
        <div className="footer-section">
          <div className="quick-links">
            <a href="/about">About</a>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
          </div>
        </div>
        <div className="footer-section">
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              FB
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              TW
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              IG
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Your Company Name. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
