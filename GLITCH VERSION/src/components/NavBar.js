import React, { useState } from "react"
import '../App.css'
import { NavLink } from "react-router-dom";
import { MdClose } from "react-icons/md"
import { FiMenu } from "react-icons/fi"
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faTrophy, faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'



function Navbar() {

    const [navbarOpen, setNavbarOpen] = useState(false)

    //change button from off to on at on click
    const handleToggle = () => {
        setNavbarOpen(!navbarOpen)
    }
    const closeMenu = () => {
        setNavbarOpen(false)
    }


    return (
        <nav className="navBar">
            <div id='NavBarBackground'>
                {/* <button onClick={handleToggle}>{navbarOpen ? (
                    <MdClose style={{ color: "#3fffd2", width: "70px", height: "30px" }} />) : (
                    <FiMenu style={{ color: "#3fffd2", width: "70px", height: "30px" }} />
                )}</button>

                <ul className={`menuNav ${navbarOpen ? " showMenu" : ""}`}>
										<br/><br/><br/>
                    <NavLink to="/homepage" className='inactive' id="a">Home</NavLink>
                    <NavLink to="/leaderboard" className='inactive' id='a' >Leaderboard</NavLink>
		    <NavLink to={'/profile/'+localStorage.getItem('wizardName')} className='inactive' id='a' >Profile</NavLink>
                </ul> */}
               
              </div>
              <Link to={'/profile/'+localStorage.getItem('wizardName')}id="navBtn"><div>Profile</div><FontAwesomeIcon icon={faUserCircle} size = '3x' id="navBtn"/></Link>
              <Link to={'/homepage'}id="navBtn"><div>Home</div><FontAwesomeIcon icon={faHome} size = '3x' id="navBtn"/></Link>
              <Link to={'/leaderboard'}id="navBtn"><div>Scores</div><FontAwesomeIcon icon={faTrophy} size = '3x' id="navBtn"/></Link>
              <Link to={'/'}id="navBtn"><div>Logout</div><FontAwesomeIcon icon={faSignOutAlt} size = '3x' id="navBtn"/></Link>
              <img id="logotype" src="/QuizWizNav2.png" alt="QuizWiz Logotype"/>
        </nav>
    )
}

export default Navbar
