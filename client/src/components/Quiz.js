import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "../App.css";
import NavBar from "./NavBar";
import { ButtonGroup } from "react-bootstrap";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function StartQuiz() {
  const params = useParams();

  const [currentquestion, setcurrentquestion] = useState("");
  let [questioncounter, setquestioncounter] = useState(0);
  const [questions, setquestions] = useState([]);
  const [correctanswer, setcorrectanswer] = useState(null);
  const [answers, setanswers] = useState([]);
  let [quizfinished, setquizfinished] = useState(false);
  let currentanswers = [];
  let [currentscore, setcurrentscore] = useState(0);
  let [finalscore, setfinalscore] = useState(0);
  let finaltempscore = 0
  let [highscore, sethighscore] = useState(0);
  let [wizardName, setwizardName] = useState("");



  function getquestions() {
    fetch(`https://damp-spire-28696.herokuapp.com/quiz/${params["category"]}`)
      .then(response => response.json())
      .then(result => {
        setquestions([...result]);
        playquiz();
      })
      .catch(error => console.log("error", error));
  }

  function gamesOver() {
    let randomizer = Math.floor(Math.random() * 72)
    console.log(randomizer)
    finaltempscore = currentscore * 7 * randomizer
    setfinalscore(finaltempscore)
    console.log(finaltempscore)

    fetch("https://damp-spire-28696.herokuapp.com/api/userscore?username=" + wizardName)
      .then(response => response.json())
      .then(result => {
        console.log("users high score is:" + result.score)
        sethighscore(result.score)

      })
      .catch(error => console.log('error', error));

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ "userName": wizardName, "score": finaltempscore }),
      redirect: 'follow'
    };

    fetch("https://damp-spire-28696.herokuapp.com/api/submit", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  function playquiz() {
    if (questioncounter === 10) {
      setquizfinished(true);
    } else {
      currentanswers = [];
      setcurrentquestion(
        questions[questioncounter].question
          .replace(/(&quot;)/g, '"')
          .replace(/(&shy;)/g, "-")
          .replace(/(&#039;)/g, "'")
          .replace(/(&oacute;)/g, "ó")
          .replace(/(&rsquo;)/g, "’")
          .replace(/(&ldquo;)/g, "“")
          .replace(/(&hellip;)/g, "...")
          .replace(/(&rdquo;)/g, '"')
      );
      setcorrectanswer(
        questions[questioncounter].correct_answer
          .replace(/(&quot;)/g, '"')
          .replace(/(&shy;)/g, "-")
          .replace(/(&#039;)/g, "'")
          .replace(/(&oacute;)/g, "ó")
          .replace(/(&rsquo;)/g, "’")
          .replace(/(&ldquo;)/g, "“")
          .replace(/(&hellip;)/g, "...")
          .replace(/(&rdquo;)/g, '"')
      );

      for (let i = 0; i < 3; i++) {
        currentanswers.push(
          questions[questioncounter].incorrect_answers[i]
            .replace(/(&quot;)/g, '"')
            .replace(/(&shy;)/g, "-")
            .replace(/(&#039;)/g, "'")
            .replace(/(&oacute;)/g, "ó")
            .replace(/(&rsquo;)/g, "’")
            .replace(/(&ldquo;)/g, "“")
            .replace(/(&rdquo;)/g, '"')
            .replace(/(&hellip;)/g, "...")
        );
      }
      currentanswers.push(
        questions[questioncounter].correct_answer
          .replace(/(&quot;)/g, '"')
          .replace(/(&shy;)/g, "-")
          .replace(/(&#039;)/g, "'")
          .replace(/(&oacute;)/g, "ó")
          .replace(/(&rsquo;)/g, "’")
          .replace(/(&ldquo;)/g, "“")
          .replace(/(&rdquo;)/g, '"')
          .replace(/(&hellip;)/g, "...")
      );
      setanswers(currentanswers.sort(() => Math.random() - 0.5));
    }
  }

  function checkAnswer(i) {
    if (answers[i] === correctanswer) {
      console.log("right answer!");
      setcurrentscore(currentscore + 1);
    } else {
      console.log("you dummy");
    }
    setquestioncounter((questioncounter += 1));
    playquiz();
  }

  useEffect(() => {
    setwizardName(localStorage.getItem('wizardName'))
    console.log(wizardName)
    console.log(currentscore);
    if (questions.length === 0) {
      getquestions();
    }
    if (quizfinished === true) {
      gamesOver();
    }
    return <div>{currentquestion}</div>;
  }, [quizfinished, currentscore, highscore]);

  return (

    <div id="quiz-page">
      <div>
        <NavBar />
      </div>
      <div id="quizes">
        <div style={{ height: "100%", color: "whitesmoke", textAlign: "center" }}>
          {quizfinished != true ? (
            <div>
              <div className="quizQuestion"> {currentquestion}</div>
              {correctanswer != null ? null : (
                <Button onClick={() => playquiz()}>Start Quiz </Button>
              )}


              <br />
              <br />
              {correctanswer != null ? (
                <ButtonGroup
                  className="ButtonGroup"
                  vertical
                  block
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    maxWidth: "90%"
                  }}
                >
                  <Button onClick={() => checkAnswer(0)} id="q-btn">{answers[0]}</Button>
                  <br />
                  <Button onClick={() => checkAnswer(1)} id="q-btn">{answers[1]}</Button>
                  <br />
                  <Button onClick={() => checkAnswer(2)} id="q-btn">{answers[2]}</Button>
                  <br />
                  <Button onClick={() => checkAnswer(3)} id="q-btn">{answers[3]}</Button>
                  <br />
                </ButtonGroup>
              ) : null}
            </div>
          ) : (
            <div>
              <Link to={{ pathname: `/homepage` }}>
                <Button id="sub-btn">
                  <div>Return Home</div>
                </Button>
              </Link>
              <Popup modal trigger={<Button id="sub-btn">Submit Quiz</Button>}>
                {" "}
                <div id="final-blurb">
                  <h1>Good Job!</h1>
                  Your score was {finalscore}<br />
                  Your previous high score is {highscore}

                </div>
                {" "}
              </Popup>
            </div>
          )}
        </div>
        <div className="fill-quiz">
          <img src="/wiz1.png" />
        </div>
      </div>
    </div>
  );
}

export default StartQuiz;
