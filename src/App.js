import './App.css';
import Navbar from './components/Navbar';
import Inputs from './components/Inputs';
import Slogan from './components/Slogan';

function App() {
  return (
  <div className = "HomePage">
    <Navbar />
    <Slogan />
    <Inputs />
  </div>
  );
}

export default App;
