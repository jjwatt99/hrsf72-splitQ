import React from 'react';

class AddMember extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.initialMemberSelect();
    console.log('this is users', this.props.users)
    console.log('this is member', this.props.member)
  }

  render() {

    return (
      <div>
        {this.props.memberExist ? <p>The name already exist!</p> : null}
        <div className='receipt-members-bar-outer-container'>
          <div className='receipt-members-bar-inner-container'>
            <div>
            <div className = 'whatever'>
            {console.log('this is da usersssss', this.props.users)}
            {this.props.users.map((user, index) => {
              return (
                  <div
                    key = {index}
                    onClick={() => this.props.memberOnClick(user.name)}
                    className={'receipt-members-bar-mem selectMember' + (this.props.selectMember === user ? 'Selected' : '')}
                  >
                    {user.picture ? <img className= 'usersImageAtTheBottom' src={user.picture}></img> : null}
                    <h4>{user.name} </h4>
                  </div>
                  )
            })
            }
            </div>
            </div>
            <div className='receipt-members-list'>

              {this.props.users.map((member, index) => {
                {console.log('this is members------', member)}
              // {console.log('props.members', this.props)}
              // {this.props.members.map((member, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => this.props.memberOnClick(member.name)}
                    className={'receipt-members-bar-mem selectMember' + (this.props.selectMember === member ? 'Selected' : '')}
                  >
                  <span className='receipt-members-bar-mem-name'>{member.name}</span>
                  </div>
                )
              })}

              <input
                placeholder='Name'
                name='member'
                type='text'
                value={this.props.member}
                id='input-member'
                onChange={this.props.onInputChange}
              />
              <a
                onClick={this.props.addMember}
                className='btn-circle'
              ></a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AddMember;
//
