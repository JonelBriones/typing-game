import { useState } from "react";
import "./App.scss";
import Game from "./components/Game/Game";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">topnav</nav>
        <div className="content">
          <Routes>
            <Route path="/" element={<Game />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
