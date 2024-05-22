import React from "react";
import "./App.css";
import Questionnaire from "./components/Questionnaire";
import { Container, Navbar, NavbarBrand } from "reactstrap";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <Navbar color="dark" dark expand="md">
        <Container className="text-center">
          <NavbarBrand className="mx-auto" href="/">
            Border Pass Questionnaire App
          </NavbarBrand>
        </Container>
      </Navbar>
      <Container className="mt-4 flex-grow-1">
        <Questionnaire />
      </Container>
      <Footer />
    </div>
  );
};

export default App;
