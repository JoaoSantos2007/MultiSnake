import React from "react"
import "./assets/css/reset.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Lobby } from "./pages/Lobby/Lobby.jsx";

const App = () =>{
  return (
    <Router>
      <Routes>
        <Route path="/" element={<>Hello</>}/>
        <Route path="/lobby" element={<Lobby />} />
      </Routes>
    </Router>
  );
}

export default App