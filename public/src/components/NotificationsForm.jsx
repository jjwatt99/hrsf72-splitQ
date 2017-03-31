'use strict';
import React from 'react';
import t from 'tcomb-form';

class NotificationsForm extends React.Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(evt) {
		console.log('submitted!');
	}
	render() {
		var ListofEmails = t.enums.of(this.props.users.map(function(user) {
			return user.email;
		}));
		var freqArr = ['Now and Daily', 'Daily', 'Now and Weekly', 'Weekly'];
		var frequency = t.enums.of(freqArr);

		const Form = t.form.Form;
		const Notice = t.struct({
			EmailList: t.list(ListofEmails),
			Frequency: t.list(frequency),
			Body: t.String
		});
		const value = {	
			Body: 'Pay me'
		}

		const options = {
			legend: <i>Add Automated Notice</i>,
			fields: {	
				EmailList: {
					label: <i>Emails in Database</i>,
					factory: t.form.Select
					// nullOption: { value: '', text: 'Select an Email address to Notify'}
				},
				Frequency: {
					label: <i>Frequency of Notices</i>,
					factory: t.form.Select
				},
				Body: {
					label: <i>Message Body to Send:  </i>,
					// placeholder: '(Write a Message Here)',
					type: 'textarea'
				}
			}
			// disableAdd: true,
		};

		return (
			<div>
				<Form style="color:blue;margin-left:30px;" ref="form" type={Notice} value={value} options={options} />
				<button onClick={()=>this.onSubmit(event)}>Start Notice</button>
			</div>
		);
	}
}

export default NotificationsForm;