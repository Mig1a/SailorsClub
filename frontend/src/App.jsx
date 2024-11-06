import 'bootstrap/dist/css/bootstrap.min.css';
import { useRoutes, Link } from 'react-router-dom';
import React from 'react';
import './App.css';
import SignIn from './pages/Signin';
import Home from './pages/home';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Signup from './pages/Signup';
import Reserve from './pages/reserve'
import SignOut from './pages/Signout.jsx';
import Seaboat from './assets/sailboat-26.jpg'
import Speedboat from "./assets/speedboat.jpg"
import Yacht from "./assets/73m-CRN-super-yacht-YALLA.jpg"
import Canoe from "./assets/Egret+16'+Navarro+Canoe+IMG_0376e.jpeg"
import fishing from "./assets/fishing.jpg"

const App = () => {
  const boats = [
    {
        B_ID: 1,
        B_Name: "Sea Breeze",
        B_Type: "Sailboat",
        B_Image: Seaboat
    },
    {
        B_ID: 2,
        B_Name: "Wave Runner",
        B_Type: "Speedboat",
        B_Image: Speedboat
    },
    {
        B_ID: 3,
        B_Name: "Ocean Explorer",
        B_Type: "Yacht",
        B_Image: Yacht
    },
    {
        B_ID: 4,
        B_Name: "River Rider",
        B_Type: "Canoe",
        B_Image: Canoe
    },
    {
        B_ID: 5,
        B_Name: "Fishing King",
        B_Type: "Fishing Boat",
        B_Image: fishing
    }
];

  let element = useRoutes([
    {
      path: "/",
      element: <Home data ={boats}/>
    },
    {
      path: "/signin",
      element: <SignIn />
    },
    {
      path: "/signup",
      element: <Signup />
    },
    {
      path: "/reserve",
      element: <Reserve />
    },
    {
      path:"/signout",
      element:<SignOut />
    }
  ]);
  

  return (
    <>
      <div className="App">
        <Navbar bg="light" expand="lg" className="w-100">
          <Container>
            <Navbar.Brand as={Link} to="/">Silors Club</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarNav" />
            <Navbar.Collapse id="navbarNav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign up</Nav.Link>
                <SignOut />
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      <div className="Element">
        {element}
      </div>
    </>
  );
}

export default App;
