import React from "react";
import { Container } from "reactstrap";

const Footer: React.FC = () => {
  return (
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <Container>
        <span className="text-white">
          © 2024 Border Pass Questionnaire App. All rights reserved.
        </span>
      </Container>
    </footer>
  );
};

export default Footer;
