import styles from "../App.module.scss";
import "./index.scss";
import Game from "./components/Game/Game";
import { Route, Routes } from "react-router-dom";

import Leaderboard from "./components/Leaderboard/Leaderboard";
import Navbar from "./components/navbar/Navbar";
import Authentication from "./dashboard/authentication/Authentication";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <div id="wrapper" className={styles.app}>
      <Navbar />
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/login" element={<Authentication />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
