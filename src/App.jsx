import { Router } from "preact-router";
import Main from "./pages/Main";
import WelderCard from "./pages/WelderCard";
import Summary from "./pages/Summary";
import Norms from "./pages/Norms";

function App() {
  return (
    <Router>
      <Main path="/deepsya/deepsya/" />
      <WelderCard path="/deepsya/deepsya/welder/:id" />
      <Summary path="/deepsya/deepsya/summary" />
      <Norms path="/deepsya/deepsya/norms" />
    </Router>
  );
}

export default App;