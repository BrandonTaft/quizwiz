import React, { useState, useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css'
import NavBar from './NavBar';
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'




function Leaderboard(props) {
	const styling = {
		backgroundColor: 'rgba(255, 255, 255, .15)',
		backdropFilter: 'blur(5px)',
		color: 'navy',
		flexDirection: 'row',
		display: 'block',
		marginLeft: 'auto',
		marginRight: 'auto',
		textAlign: 'left',
		opacity: '.85',
		border: '2px solid black',
		width: 'auto',
		height: 'auto',
		padding: '10px',
		minWidth: '325px'
	}
	
	const [leaderboard, setLeaderboard] = useState([])
	
	useEffect(() => {
		getLeaderboard() 
	 }, [])
 
   const getLeaderboard = () => {
	 fetch('https://quiz-wiz-server.glitch.me/api/highscore')
	   .then(response => response.json())
	   .then(result => {
		 console.log(result[0])
		 setLeaderboard(result)
		 console.log(leaderboard)
	   }
	   )
   }
   


   const leaderboardList = leaderboard.map((score) => {
	   return(
		
			
			<tr>
    			<td><FontAwesomeIcon icon={faTrophy} size = 'med' id="lead-trophy"/>{score.username}</td>
    			<td>{score.score}</td>
  			</tr>
			  
	   
	   )
 
 })

	return (

		<div id="top-ten">
			<NavBar />
			<div id="lead-list">
				<table id="lead-table">	
					<tr>
    					<th>Wizard</th>
    					<th>High Score</th>
  					</tr>	
    			{leaderboardList}
				</table>
			</div>
    	</div>
	)
}
export default Leaderboard
