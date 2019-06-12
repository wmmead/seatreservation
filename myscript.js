//Updated to use es6 as of 6/12/2019

// Example data for already reserved seats...
// This is not json data, but a JS object...
const reservedSeats = {
	record1:{
		seat:"b19",
		owner:{
			fname:"Joe",
			lname:"Smith"
		}
	},
	record2:{
		seat:"b20",
		owner:{
			fname:"Joe",
			lname:"Smith"
		}
	},
	record3:{
		seat:"b21",
		owner:{
			fname:"Joe",
			lname:"Smith"
		}
	},
	record4:{
		seat:"b22",
		owner:{
			fname:"Joe",
			lname:"Smith"
		}
	}
};



/**************
The function below generates the rows of seats on the web page.
Each section is generated separately, but the rows keep their numbers in order.
More could be done to generalize this function, but it works as-is for this layout.
***************/

const makeRows = (sectionLength, rowLength, placement) => {
	"use strict";
	const rows = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t"];
	let html = "";
	let counter = 1;
	let i, j = 0;
	
	for( i=0; i<rows.length; i++ ){
		
		//add the correct counter or lable for left or right or center
		switch(placement) {
			case "left": html += `<div class="label">${rows[i]}</div>`; break;
			case "right": counter = counter + (rowLength - sectionLength); break;
			default: counter = counter + ((rowLength - sectionLength)/2);
		}
		
		for( j=0; j<sectionLength; j++ ){
			//Build the html...
			html += `<div class="a" id="${rows[i]+counter}">${counter}</div>`;
			counter++;
		}
		
		//add the correct counter or lable for left or right or center
		switch(placement) {
			case "right": html += `<div class="label">${rows[i]}</div>`; break;
			case "left": counter = counter + (rowLength - sectionLength); break;
			default: counter = counter + ((rowLength - sectionLength)/2);
		}
	}
	//Add the HTML to the page...
	document.getElementById(placement).innerHTML = html;
}

//Calling the function three times for the three sections on the page.
makeRows(3, 15, 'left');
makeRows(3, 15, 'right');
makeRows(9, 15, 'middle');


/**************
The function below loops through the hard coded previously reserved 
seats and changes their display on the page.

This might have to be modified a bit if you were getting real data from a server.
***************/

(function(){
	"use strict";
	for (let key in reservedSeats) {
		
		/*************
		skip loop if the property is from prototype
		This line is not really necessary in this case, since this object doesn't
		inherit anything, but I leave it in to avoid js lint errors
		**************/
		
		if (!reservedSeats.hasOwnProperty(key)) { continue; }

		var obj = reservedSeats[key];
		
		document.getElementById(obj.seat).className = "r";
		document.getElementById(obj.seat).innerHTML = "R";
		
	}
}());  //end closure



//Closure for whole reservation process to keep everything out of global scope...
	
(function(){
	"use strict";
	
	// This array holds seats during the selection process, before they are reserved.
	let selectedSeats = [];
	
	const seats = document.getElementsByClassName('a');

	/**************
	The seatSelectionProcess function below adds selected seats to the array at the 
	top of the function, or allows users to remove seats from that array. 
	It also adds the correct classes for the display of available and unavailble seats.
	***************/

	const seatSelectionProcess = seat => {
		
		//passed in id for a seat such as b24
		let thisSeat = seat;
		
		/**************
		I can't seem to get the remove event listener to work, but this works instead.
		I check to see if the element has the class set to "r" and only allow selection
		of seats that do not have this class.
		***************/
		if(!document.getElementById(thisSeat).classList.contains('r')){
			
			// If seat is already in the array, take it out when clicked again
			if(selectedSeats.indexOf(thisSeat) > -1 ){

				let index = selectedSeats.indexOf(thisSeat);

				selectedSeats.splice(index, 1);
				document.getElementById(thisSeat).className = "a";

			}
			// If seat is not in the array already, put it in...
			else{
				selectedSeats.push(thisSeat);
				document.getElementById(thisSeat).className = "s";
			}

			//shows seats as they are added or removed from the selectedSeats array...
			console.log(selectedSeats);
			
			// changes data in the confirm form, which will show if you click "reserve" button.
			manageConfirmForm();
			
		} //end if class is set to "r"
	}
	
	/**************
	The manageConfirmForm function handles the display of the reservation dialog box that 
	comes up when you click the button to reserve your seats. Either the user has chosen
	one or more seats to reserve, in which case the reservation form is shown with the 
	correct seats and language. 

	However, if the user clicks the button to show the dialog without any seats selected, 
	the form inside the dialog box is hidden and an error message shown.
	***************/

	const manageConfirmForm = () =>{

		if(selectedSeats.length > 0){

				document.getElementById('confirmres').style.display = "block";

				// If only one seat was selected to be reserved...
				if(selectedSeats.length === 1){
					document.getElementById("selectedseats").innerHTML=`You have selected seat ${selectedSeats[0]}`;
				}
				// If more than one seat was selected to be reserved.
				else{
					//puts the array into a string, but there are no spaces after the commas...
					let seatsString = selectedSeats.toString();
					//adds spaces after the commas
					seatsString = seatsString.replace(/,/g, ", ");
					//for the last comma, removes it and put in an 'and' instead....
					seatsString = seatsString.replace(/,(?=[^,]*$)/, ' and');

					document.getElementById("selectedseats").innerHTML=`You have selected seats ${seatsString}`;
				}
			}

		else{
			//hide the actual form so it can't be submitted...
			document.getElementById('confirmres').style.display = "none";
			//Add the error message and a link to close the dialog box...
			document.getElementById("selectedseats").innerHTML= 'You need to select some seats to reserve.<br><a href="#" id="error">Close</a> this dialog box and pick at least one seat.';

			//Click handler to close the dialog box...
			document.getElementById('error').addEventListener('click', () => {
				document.getElementById('resform').style.display="none";
			}); 
		}
	}	

	/**************
	The function below actually adds the selected seats to the reservedSeats object
	and changes the display on the page.
	***************/
	
	const processReservation = () => {
		
		const hardCodeRecords = Object.keys(reservedSeats).length;
		let counter = 1;			 
		let fname = document.getElementById('fname').value;
		let lname = document.getElementById('lname').value;
		let nextRecord = '';

		for( let i=0; i<selectedSeats.length; i++){
			
			//Change the display on the page...
			document.getElementById(selectedSeats[i]).className = "r";
			document.getElementById(selectedSeats[i]).innerHTML = "R";
			
			//Add the next record to the object, incrementing the record number...
			nextRecord = "record" + (hardCodeRecords + counter);
			reservedSeats[nextRecord] = {
				seat:selectedSeats[i],
				owner:{
					fname:fname,
					lname:lname
				}
			};

			counter++;
		}
		
		//After reserving seats, set the array back to empty, so more can be reserved.
		selectedSeats = [];
		manageConfirmForm();

		//You can see the resulting object in the console...
		console.log(reservedSeats);

		//Close the damn form when done...
		document.getElementById('resform').style.display="none";
		
	} // end processReservation

	
	// Run this here incase someone immediately presses the reserve seats button
	manageConfirmForm();
	
	const myClickHandler = eachSeat => {
		const seats = document.getElementsByClassName('a');
		let thisSeat = seats[eachSeat].id;
		return () => seatSelectionProcess(thisSeat);
	}
	
	//Adds an event listener to each seat in the house...
	for(let i=0; i<seats.length; i++){
		seats[i].addEventListener('click', myClickHandler(i) );
	}
	
	//Event listener for the reserve button to open the form...
	document.getElementById('reserve').addEventListener('click', event => {
		//show the form
		document.getElementById('resform').style.display="block";
		event.preventDefault();
		
	});
	
	//Event listener to close the form if someone clicks cancel...
	document.getElementById('cancel').addEventListener('click', event => {
		//hide the form
		document.getElementById('resform').style.display="none";
		event.preventDefault();
	});
	
	//Event Listener for clicking the confirm button in the reservation form to process the reservation
	document.getElementById('confirmres').addEventListener('submit', event => {
		processReservation();
		event.preventDefault();
	} );
	
}()); // end closure
