import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Profile from './components/Profile.js';
import Leaderboard from './components/Leaderboard.js';
import HomePage from './components/HomePage';
import login from './components/Login.js';
import register from './components/Register.js';
import Quiz from './components/Quiz.js';



function App() {
  return (
    <div id="body"
      // style={{backgroundImage: "rgb(19,47,103)",
      // background: "linear-gradient(180deg, rgba(19,47,103,1) 20%, rgba(19,85,103,1) 50%, rgba(69,128,144,1) 80%)", 
      // backgroundRepeat: "noRepeat",
      // backgroundAttachment: 'fixed',
      // backgroundPosition: 'center',
      // backgroundSize: '100%',
      // height: '100%',
      // width: '100%',
      // }}
    >
      <Switch>
      <Route exact path="/homepage" component={HomePage} />
      <Route exact path="/" component={login} />
      <Route exact path="/register" component={register} />
      <Route exact path="/profile/:username" component={Profile} />
      <Route exact path="/leaderboard" component={Leaderboard} />
      <Route exact path="/quiz/:category" component={Quiz} />
      </Switch>
    </div>
  )
}



export default App;