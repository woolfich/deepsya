// src/App.jsx
import { Router } from 'preact-router';
import Main from './pages/Main';
import Norms from './pages/Norms';
import Summary from './pages/Summary';
import WelderCard from './pages/WelderCard';

export default function App() {
  return (
    <Router url="/deepsya/">
      <Main path="/" />
      <Norms path="/norms" />
      <Summary path="/summary" />
      <WelderCard path="/welder/:id" />
    </Router>
  );
}