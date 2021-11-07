import React, {useState, useEffect} from 'react';
import HomeButton from './homebutton.jsx'

import '../App.css';



function DeleteUser(props) {
	
	let [deleteduser, setdeleteduser] = useState(null)


	function deleteuserprofile() {
		
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		
		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify([{"userName": deleteduser}]),
		};
		
		fetch("https://damp-spire-28696.herokuapp.com/api/deleteuser", requestOptions)
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));
	}
	
	useEffect(() => {
		//need to know how to get the users username with passport
		//setdeleteduser(result.score)
			deleteuserprofile()
			
		return (
			<div>
			<HomeButton />

			</div>
		)
	},[])
	
	return (
		<div>
		<HomeButton />

		</div>
	)
}

export default DeleteUser