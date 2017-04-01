import React from 'react';
import ReactDOM from 'react-dom';
import NotificationsForm from './NotificationsForm.jsx';

class Notifications extends React.Component {
	constructor(props) {
		super(props);
		this.clientId = '833789126437-regurhotkv0bbs64gm61tqb95sdkafcb.apps.googleusercontent.com';
		this.apiKey = 'AIzaSyBJZhm_-wwF66jU1v6LjICZYp6-0RqkXUo';
		this.scopes =
			'https://www.googleapis.com/auth/gmail.readonly '+
			'https://www.googleapis.com/auth/gmail.send';
		this.handleClientLoad = this.handleClientLoad.bind(this);
		this.checkAuth = this.checkAuth.bind(this);
		this.handleAuthClick = this.handleAuthClick.bind(this);
		this.handleAuthResult = this.handleAuthResult.bind(this);
		this.loadGmailApi = this.loadGmailApi.bind(this);
		this.displayInbox = this.displayInbox.bind(this);
		this.appendMessageRow = this.appendMessageRow.bind(this);
		this.sendEmail = this.sendEmail.bind(this);
		this.composeTidy = this.composeTidy.bind(this);
		this.sendReply = this.sendReply.bind(this);
		this.replyTidy = this.replyTidy.bind(this);
		this.fillInReply = this.fillInReply.bind(this);
		window.fillInReply = this.fillInReply;
		this.sendMessage = this.sendMessage.bind(this);
		this.getHeader = this.getHeader.bind(this);
		this.getBody = this.getBody.bind(this);
		this.getHTMLPart = this.getHTMLPart.bind(this);
    this.submitNotificationsForm = this.submitNotificationsForm.bind(this);
	}

	componentWillMount() {
		const gmail_clientScript = document.createElement("script");
        gmail_clientScript.src = "./gmailClient.js";
        gmail_clientScript.async = false;
        gmail_clientScript.onload = this.handleClientLoad;
        document.body.appendChild(gmail_clientScript);

	}

	handleClientLoad() {
		setTimeout(function() { gapi.client.setApiKey(this.apiKey); }, 300);
        setTimeout(this.checkAuth, 400);
	}

	checkAuth() {
        gapi.auth.authorize({
          client_id: this.clientId,
          scope: this.scopes,
          immediate: true
        }, this.handleAuthResult);
	}

	handleAuthClick() {
        gapi.auth.authorize({
          client_id: this.clientId,
          scope: this.scopes,
          immediate: false
        }, this.handleAuthResult);
        return false;
	}

	handleAuthResult(authResult) {
    var context = this;
    if(authResult && !authResult.error) {
      this.loadGmailApi();
      $('#authorize-button').remove();
      $('.table-inbox').removeClass("hidden");
      $('#compose-button').removeClass("hidden");
    } else {
      $('#authorize-button').removeClass("hidden");
      $('#authorize-button').on('click', function(){
        context.handleAuthClick();
      });
    }
	}

	loadGmailApi() {
        gapi.client.load('gmail', 'v1', this.displayInbox.bind(this));
    }

	displayInbox() {
		var context = this;
		var request = gapi.client.gmail.users.messages.list({
          'userId': 'me',
          'labelIds': 'INBOX',
          'maxResults': 10
        });
        request.execute(function(response) {
          $.each(response.messages, function() {
            var messageRequest = gapi.client.gmail.users.messages.get({
              'userId': 'me',
              'id': this.id
            });
			messageRequest.execute(context.appendMessageRow);
          });
        });
	}

	appendMessageRow(message) {
		var context = this;
        $('.table-inbox tbody').append(
          '<tr>\
            <td>'+this.getHeader(message.payload.headers, 'From')+'</td>\
            <td>\
              <a href="#message-modal-' + message.id +
                '" data-toggle="modal" id="message-link-' + message.id+'">' +
                this.getHeader(message.payload.headers, 'Subject') +
              '</a>\
            </td>\
            <td>'+this.getHeader(message.payload.headers, 'Date')+'</td>\
          </tr>'
        );
        var reply_to = (this.getHeader(message.payload.headers, 'Reply-to') !== '' ?
          this.getHeader(message.payload.headers, 'Reply-to') :
          this.getHeader(message.payload.headers, 'From')).replace(/\"/g, '&quot;');

        var reply_subject = 'Re: '+this.getHeader(message.payload.headers, 'Subject').replace(/\"/g, '&quot;');
        $('body').append(
          '<div class="modal fade" id="message-modal-' + message.id +
              '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
            <div class="modal-dialog modal-lg">\
              <div class="modal-content">\
                <div class="modal-header">\
                  <button type="button"\
                          class="close"\
                          data-dismiss="modal"\
                          aria-label="Close">\
                    <span aria-hidden="true">&times;</span></button>\
                  <h4 class="modal-title" id="myModalLabel">' +
                    this.getHeader(message.payload.headers, 'Subject') +
                  '</h4>\
                </div>\
                <div class="modal-body">\
                  <iframe id="message-iframe-'+message.id+'" srcdoc="<p>Loading...</p>">\
                  </iframe>\
                </div>\
                <div class="modal-footer">\
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                  <button type="button" class="btn btn-primary reply-button" data-dismiss="modal" data-toggle="modal" data-target="#reply-modal"\
                  onclick="window.fillInReply(\
                    \''+reply_to+'\', \
                    \''+reply_subject+'\', \
                    \''+this.getHeader(message.payload.headers, 'Message-ID')+'\'\
                    );"\
                  >Reply</button>\
                </div>\
              </div>\
            </div>\
          </div>'
        );
        $('#message-link-'+message.id).on('click', function(){
          var ifrm = $('#message-iframe-'+message.id)[0].contentWindow.document;
          $('body', ifrm).html(context.getBody(message.payload));
        });
	}

	sendEmail(email, subject, message) {
		$('#send-button').addClass('disabled');
		this.sendMessage(
		  {
		    'To': $('#compose-to').val() || email,
		    'Subject': $('#compose-subject').val() || subject
		  },
		  $('#compose-message').val() || message,
		  this.composeTidy
		);
		// return false;
	}

	composeTidy() {
        $('#compose-modal').modal('hide');

        $('#compose-to').val('');
        $('#compose-subject').val('');
        $('#compose-message').val('');

        $('#send-button').removeClass('disabled');
	}

	sendReply() {
        $('#reply-button').addClass('disabled');

        this.sendMessage(
          {
            'To': $('#reply-to').val(),
            'Subject': $('#reply-subject').val(),
            'In-Reply-To': $('#reply-message-id').val()
          },
          $('#reply-message').val(),
          this.replyTidy
        );

        // return false;
	}

	replyTidy() {
        $('#reply-modal').modal('hide');

        $('#reply-message').val('');

        $('#reply-button').removeClass('disabled');
	}

	fillInReply(to, subject, message_id) {
        $('#reply-to').val(to);
        $('#reply-subject').val(subject);
        $('#reply-message-id').val(message_id);
    }

	sendMessage(headers_obj, message, callback) {
        var email = '';

        for(var header in headers_obj)
          email += header += ": "+headers_obj[header]+"\r\n";

        email += "\r\n" + message;

        var sendRequest = gapi.client.gmail.users.messages.send({
          'userId': 'me',
          'resource': {
            'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
          }
        });

        return sendRequest.execute(callback);
	}
	
	getHeader(headers, index) {
        var header = '';
        $.each(headers, function(){
          if(this.name.toLowerCase() === index.toLowerCase()){
            header = this.value;
          }
        });
        return header;
	}


	getBody(message) {
        var encodedBody = '';
        if(typeof message.parts === 'undefined')
        {
          encodedBody = message.body.data;
        }
        else
        {
          encodedBody = this.getHTMLPart(message.parts);
        }
        encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
        return decodeURIComponent(escape(window.atob(encodedBody)));
	}

	getHTMLPart(arr) {
        for(var x = 0; x <= arr.length; x++)
        {
          if(typeof arr[x].parts === 'undefined')
          {
            if(arr[x].mimeType === 'text/html')
            {
              return arr[x].body.data;
            }
          }
          else
          {
            return this.getHTMLPart(arr[x].parts);
          }
        }
        return '';
  }

  submitNotificationsForm(userInput) {
    if (userInput.Body.length > 0 && userInput.EmailList.length > 0 && userInput.Frequency.length > 0) {
      if (userInput.Frequency[0] === 'Now') {
        for (var i = 0; i < userInput.EmailList.length; i++) {
          this.sendEmail(userInput.EmailList[i], 'Trip Expenditures Update', userInput.Body);
          console.log('message sent! to --->', userInput.EmailList[i]);
        }
        alert('Message(s) Sent!\nRecipients: \n' + userInput.EmailList.map(function(email) {
          return email + '\n';
        }));
      }
    }
  }
  render() {
    console.log(this.props)
    return (
      <div>
        <div className="container">
          <h1>Notifications</h1>
          <NotificationsForm submitNotificationsForm={this.submitNotificationsForm} users={this.props.data.usersFromFacebook} items={this.props.data.items}/>

            <a href="#compose-modal" data-toggle="modal" id="compose-button" className="btn btn-primary pull-right hidden">Compose</a>

            <button id="authorize-button" className="btn btn-primary hidden">Authorize</button>

            <table className="table table-striped table-inbox hidden">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Date/Time</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>

          <div className="modal fade" id="compose-modal" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h4 className="modal-title">Compose</h4>
                </div>
                <form onSubmit={this.sendEmail}>
                  <div className="modal-body">
                    <div className="form-group">
                      <input type="email" className="form-control" id="compose-to" placeholder="To" required />
                    </div>

                    <div className="form-group">
                      <input type="text" className="form-control" id="compose-subject" placeholder="Subject" required />
                    </div>

                    <div className="form-group">
                      <textarea className="form-control" id="compose-message" placeholder="Message" rows="10" required></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="submit" id="send-button" className="btn btn-primary">Send</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="modal fade" id="reply-modal" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h4 className="modal-title">Reply</h4>
                </div>
                <form onSubmit={this.sendReply}>
                  <input type="hidden" id="reply-message-id" />

                  <div className="modal-body">
                    <div className="form-group">
                      <input type="text" className="form-control" id="reply-to" disabled />
                    </div>

                    <div className="form-group">
                      <input type="text" className="form-control disabled" id="reply-subject" disabled />
                    </div>

                    <div className="form-group">
                      <textarea className="form-control" id="reply-message" placeholder="Message" rows="10" required></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="submit" id="reply-button" className="btn btn-primary">Send</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
			</div>


		)
	}
}

export default Notifications;