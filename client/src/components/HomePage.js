import React from 'react'
import '../App.css'
import NavBar from './NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnkh, faBolt, faBook, faBrain, faFilm, faFootballBall, faGamepad, faGlobeAmericas, faMouse, faMusic, faQuestion, faTv, } from '@fortawesome/free-solid-svg-icons';



<div id="wrapbox">
    <div className="fill">
        <img id="" src="/wiz3.png" alt="QuizWiz Logotype" />
    </div>
</div>



function HomePage() {
    const styling = {
        paddingRight: "0px",
        paddingLeft: "0px",
        margin: "5px"
    }
    const gridStyling = {
        paddingRight: "0",
        paddingLeft: "0",
        marginRight: "0",
        marginLeft: "100px",
        width: "50%",
    }
    return (
        <div >
            <NavBar id='navBar' />

            
            <div id="wrapbox">

                <div className="fill">
                    <img id="" src="/wiz5.png" alt="QuizWiz Logotype" />
                </div>

                <div class="grid-container">
                    <a class="grid-item" href=https://damp-spire-28696.herokuapp.com/quiz/9">
                        <FontAwesomeIcon icon={faBrain} />
                        <br></br>
                        General Info
                    </a>
                    <a class="grid-item" href="/quiz/11">
                       <FontAwesomeIcon icon={faFilm} />
                        <br></br>
                        Movies
                   </a>
                    <a class="grid-item" href="/quiz/10">
                       <FontAwesomeIcon icon={faBook} />
                        <br></br>
                        Books
                  </a>
                    <a class="grid-item" href="/quiz/15">
                       <FontAwesomeIcon icon={faGamepad} />
                        <br></br>
                        Video Games
                  </a>
                  <a class="grid-item" href="/quiz/12">
                       <FontAwesomeIcon icon={faMusic} />
                        <br></br>
                        Music
                   </a>
                   <a class="grid-item" href="/quiz/14">
                       <FontAwesomeIcon icon={faTv} />
                        <br></br>
                        TV
                  </a>
                   <a class="grid-item" href="/quiz/20">
                       <FontAwesomeIcon icon={faAnkh} />
                        <br></br>
                        Mythology
                   </a>
                   <a class="grid-item" href="/quiz/21">
                       <FontAwesomeIcon icon={faFootballBall} />
                        <br></br>
                        Sports
                   </a>
                   <a class="grid-item" href="/quiz/22">
                       <FontAwesomeIcon icon={faGlobeAmericas} />
                        <br></br>
                        Geography
                   </a>
                   <a class="grid-item" href="/quiz/29">
                   <FontAwesomeIcon icon={faBolt}/>
                        <br></br>
                        Comics
                   </a>
               </div>
            </div>
        </div>

        

    )
}

export default HomePage
