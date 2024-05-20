import './App.css';
import HomepageBody from './components/HomepageBody';
import Navbar from './components/Navbar';
import SloganSearchBar from './components/SloganSearchBar';
import HomepageBody2 from './components/HomepageBody2';


function App() {
  return (
  <div className = "HomePage">
    <Navbar />
    <SloganSearchBar />
    <HomepageBody />
    <HomepageBody2 />
  </div>
  );
}

export default App;
