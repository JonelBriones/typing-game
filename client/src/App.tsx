import styles from "../App.module.scss";
import "./index.scss";
import Game from "./dashboard/game/Game";
import { Route, Routes } from "react-router-dom";
import Leaderboard from "./dashboard/leaderboard/Leaderboard";
import Authentication from "./dashboard/authentication/Authentication";
import Footer from "./dashboard/footer/Footer";
import Navbar from "./dashboard/navbar/Navbar";

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
