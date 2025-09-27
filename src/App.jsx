import { Router } from "preact-router";
import Main from "./pages/Main";
import WelderCard from "./pages/WelderCard";
import Summary from "./pages/Summary";
import Norms from "./pages/Norms";

export default function App() {
  return (
    <Router>
      <Main path="/" />
      <WelderCard path="/welder/:id" />
      <Summary path="/summary" />
      <Norms path="/norms" />
    </Router>
  );
}
