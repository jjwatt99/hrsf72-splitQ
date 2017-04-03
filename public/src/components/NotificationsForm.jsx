'use strict';
import React from 'react';
import t from 'tcomb-form';

class NotificationsForm extends React.Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}
 
	onSubmit(evt) {
		console.log('submitted! evt = ', evt);
		if (this.refs.form.getValue()) {
	      var userInput = this.refs.form.getValue();
	      console.log('this.refs.form.getValue() = ', userInput)
	      if (userInput) {
	        this.props.submitNotificationsForm(userInput);
	      }
    	}
	}
	render() {
		var ListofEmails = t.enums.of(this.props.users.map(function(user) {
			return user.email;
		}));
		var freqArr = ['Now', 'Daily', 'Weekly'];
		var frequency = t.enums.of(freqArr);

		const Form = t.form.Form;
		const Notice = t.struct({
			EmailList: t.list(ListofEmails),
			Frequency: t.list(frequency),
			Body: t.maybe(t.String)
		});
		const value = {
			Body: this.props.items.map(function(item) {
				return '\n' + Object.entries(item[0]).map(function(pair) {
					return '   ' + pair[0] + ':  ' + pair[1] + ' ';
				});
			})
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
				<button className = 'btn btn-primary' onClick={()=>this.onSubmit(event)}>Start Notice</button>
			</div>
		);
	}
}

export default NotificationsForm;
