import React, { useState, useEffect } from 'react';
import NavBar from "./NavBar.js";
import { Row, Carousel } from 'react-bootstrap';


function Profile(props) {

  const styling = {
    marginRight: "auto",
    marginLeft: "auto",
    disisplay: "flex",
    flexDirection: "row"

  }

  const [myScore, setMyScore] = useState(null)
  const [wizardName, setwizardName] = useState("")
  const [firstPlace, setfirstPlace] = useState([])
  const [secondPlace, setsecondPlace] = useState([])
  const [thirdPlace, setthirdPlace] = useState([])

  useEffect(() => { getLeaderboard() }, [])
  const getLeaderboard = (props) => {
    fetch('https://damp-spire-28696.herokuapp.com/api/highscore')
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setfirstPlace(result[0])
        setsecondPlace(result[1])
        setthirdPlace(result[2])
      }
      )
  }



  function getuserscore(wizardName) {
    console.log("debugging")
    fetch(`https://damp-spire-28696.herokuapp.com/api/userscore?username=${wizardName}`)
      .then(response => response.json())
      .then(myScore => {
        console.log(myScore.score)
        localStorage.setItem("wizardName", wizardName)
        setMyScore(myScore.score)
      })
  }




  useEffect(() => {
    //  getLeaderboard() 
    setwizardName(props.match.params.username)
    getuserscore(props.match.params.username)
  }, [])


  return (
    <div id=" profile-page">
      <div id="top-container">
        <NavBar />
      </div>

      <div id="avatar-container">

        <div className="fill2">
          <img id="" src="/wiz2.png" alt="" ></img>

        </div>

        <div className="HomeBlurb" >
          <p className="Instructions">
            Welcome to QuizWiz, a fun trivia game where your knowledge of various topics
            can be put to the test. You can select from any one of twelve different trivia
            categories ranging from topics across pop culture, entertainment, and academia.
          </p>
          <p className="Instructions" id="p2">
            Rack up as many correct answers as you can to place on
            the leaderboard and prove to everyone that you are the one, true QuizWiz!
          </p>
        </div>

      </div>
    <div id="pro-btm">
      <div id='profile-name'>
        <p className="Instructions" id="instructionsp">
          Hello {wizardName}<br></br>
          Your  high score is <i>{myScore}</i>
        </p>
      </div>
     



      <div id="leaderboard-body">

        <Row className="rowBlurb" style={styling}>
          <Carousel fade>
            <Carousel.Item>

              <img
                id="leaderboardSliderImage"
                src="/QuizWizGold.png" fluid
                alt=""
              />


              <div id="carousel-caption">
                <h3>First Place QuizWiz</h3>
                <p>You are the Gandalf of all the quiz wizards, a true Quizard!</p>
                {firstPlace.username} : {firstPlace.score}
              </div>

            </Carousel.Item>
            <Carousel.Item>

              <img
                id="leaderboardSliderImage"
                src="/QuizWizSilver.png" fluid
                alt=""
              />



              <div id="carousel-caption">
                <h3>Second Place QuizWiz</h3>
                <p>good job, you are almost to the top!</p>

                {secondPlace.username} : {secondPlace.score}
              </div>
            </Carousel.Item>
            <Carousel.Item>

              <img
                id="leaderboardSliderImage"
                src="/QuizWizBronze.png" fluid
                alt=""
              />


              <div id="carousel-caption">
                <h3>Third Place QuizWiz</h3>
                <p>Not bad, but you can keep pushing!.</p>
                {thirdPlace.username} : {thirdPlace.score}
              </div>
            </Carousel.Item>
          </Carousel>
        </Row>
      </div>
      </div>
    </div>


  )

}

export default Profile