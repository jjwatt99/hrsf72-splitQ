import React from 'react';
import ReactDOM from 'react-dom';

class Notifications extends React.Component {
	constructor(props) {
		super(props);
		this.CLIENT_ID = '509436771975-csna0oqrt8o6ahvaq3qkhoduqh38enhj.apps.googleusercontent.com';
		// Array of API discovery doc URLs for APIs used by the quickstart
		this.DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
		// Authorization scopes required by the API; multiple scopes can be
		// included, separated by spaces.
		this.SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
		this.authorizeButton = document.getElementById('authorize-button');
		this.signoutButton = document.getElementById('signout-button');
	}
	// /**
	// *  On load, called to load the auth2 library and API client library.
	// */
	// handleClientLoad() {
 //        gapi.load('client:auth2', initClient);
 //    }

	// /**
	// *  Initializes the API client library and sets up sign-in state
	// *  listeners.
	// */
 //    initClient() {
	// 	gapi.client.init({
	// 		discoveryDocs: DISCOVERY_DOCS,
	// 		clientId: CLIENT_ID,
	// 		scope: SCOPES
 //        }).then(function () {
	// 		// Listen for sign-in state changes.
	// 		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

	// 		// Handle the initial sign-in state.
	// 		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
	// 		authorizeButton.onclick = handleAuthClick;
	// 		signoutButton.onclick = handleSignoutClick;
 //        });
	// }

	// /**
	// *  Called when the signed in status changes, to update the UI
	// *  appropriately. After a sign-in, the API is called.
	// */
	// updateSigninStatus(isSignedIn) {
 //        if (isSignedIn) {
	// 		authorizeButton.style.display = 'none';
	// 		signoutButton.style.display = 'block';
	// 		listLabels();
 //        } else {
	// 		authorizeButton.style.display = 'block';
	// 		signoutButton.style.display = 'none';
 //        }
 //    }

	// *
	// *  Sign in the user upon button click.
	
	// handleAuthClick(event) {
 //        gapi.auth2.getAuthInstance().signIn();
	// }

	// /**
	// *  Sign out the user upon button click.
	// */
	// handleSignoutClick(event) {
 //        gapi.auth2.getAuthInstance().signOut();
	// }

	// /**
	// * Append a pre element to the body containing the given message
	// * as its text node. Used to display the results of the API call.
	// *
	// * @param {string} message Text to be placed in pre element.
	// */
	// appendPre(message) {
 //        var pre = document.getElementById('content');
 //        var textContent = document.createTextNode(message + '\n');
 //        pre.appendChild(textContent);
	// }

	// /**
	// * Print all Labels in the authorized user's inbox. If no labels
	// * are found an appropriate message is printed.
	// */
	// listLabels() {
 //        gapi.client.gmail.users.labels.list({
	// 		'userId': 'me'
 //        }).then(function(response) {
	// 	var labels = response.result.labels;
	// 	appendPre('Labels:');

	// 	if (labels && labels.length > 0) {
 //            for (i = 0; i < labels.length; i++) {
 //              var label = labels[i];
 //              appendPre(label.name)
 //            }
	// 	} else {
 //            appendPre('No Labels found.');
	// 		}
 //        });
	// }

	render() {
		return (
			<div>
			 <h1>Notifications</h1>
			</div>

		)
	}
}

export default Notifications;