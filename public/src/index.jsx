import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import TripSummary from './components/TripSummary.jsx';
import CreateTrip from './components/CreateTrip.jsx';
import Itemization from './components/Itemization.jsx';
import UploadReceipt from './components/Upload.jsx';
import MemberSummary from './components/MemberSummary.jsx';
import Breakdown from './components/Breakdown.jsx';
import Profile from './components/Profile.jsx';
import Login from './components/Login.jsx';
import Navbar from './components/Navbar.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import PrivateRouteHome from './components/PrivateRouteHome.jsx';
import Util from './lib/util.js';
import CreateItem from './components/CreateItem.jsx';
import Notifications from './components/Notifications.jsx';
import $ from 'jquery';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      receiptUrl: '',
      tripName: '',
      username: '',
      tripDesc: '',
      receiptName: '',
      items: [],
      selectItem: '',
      selectMember: '',
      members: [],
      usersFromFacebook: [],
      member: '',
      memberExist: false,
      name: '',
      email: '',
      photoUrl: '',
      sideMenuState: false,
      amount: '',
      sumBill: '',
      sumTax: '',
      sumTip: 0,
      sumTotal: 0,
      memberSum: {},
      amount: '',
      sideMenuState: false,
      windowHeight: '',
      entitlement: 0,
      debt: 0,
      recent: [ {name: 'No trips yet. Now create one!'}],
      flatObjs: []
    };

    this.verifyAuthentication = this.verifyAuthentication.bind(this);
    this.handleClickLogout = this.handleClickLogout.bind(this);
    this.addItem = this.addItem.bind(this);
    this.handleTripNameSubmit = this.handleTripNameSubmit.bind(this);
    this.callGVision = this.callGVision.bind(this);
    this.onGVision = this.onGVision.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.addMember = this.addMember.bind(this);
    this.memberExist = this.memberExist.bind(this);
    this.itemOnClick = this.itemOnClick.bind(this);
    this.memberOnClick = this.memberOnClick.bind(this);
    this.initialMemberSelect = this.initialMemberSelect.bind(this);
    this.menuOnClick = this.menuOnClick.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.calculateMemberSum = this.calculateMemberSum.bind(this);
    this.calculateTotal = this.calculateTotal.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.getRecentTrip = this.getRecentTrip.bind(this);
    this.getUsersFromFacebook = this.getUsersFromFacebook.bind(this);
    this.getDebt = this.getDebt.bind(this);
    this.getEntitlement = this.getEntitlement.bind(this);
    this.logState = this.logState.bind(this);
    this.createFlatObjs = this.createFlatObjs.bind(this);
  }

  logState() {
    var app = this;
    console.log('CURRENT STATE: ', app.state);
  }

  createFlatObjs() {
    var items = [];
    // go through items and do the stuff below
    var app = this;
    var date = new Date();
    var day = date.getDay();
    var month = date.getMonth();
    var year = date.getFullYear();
    if (app.state.items.length < 1) {
      //do nothing
    } else {
      let tipObj = {};
      tipObj.username = app.state.username; 
      tipObj.email = app.state.email;
      tipObj.tripName = app.state.tripName;
      tipObj.receiptName = app.state.receiptName;
      tipObj.itemAmount = app.state.sumTip;
      tipObj.itemName = 'tip'
      tipObj.debtor = app.state.username;
      tipObj.noticeType = 'none';
      tipObj.noticesSent = 0;
      tipObj.dateOfDebt = `${month}/${day}/${year}`;
      items.push(tipObj);
      var itemList = app.state.items;

      for (var i = 0; i < itemList.length; i++) {
        let item = itemList[i];

        if (item[0].members.length === 0) {
          let obj = {};
          obj.username = app.state.username; 
          obj.email = app.state.email;
          obj.tripName = app.state.tripName;
          obj.receiptName = app.state.receiptName;
          obj.itemAmount = item[0].amount;
          obj.itemName = item[0].name;
          // default to username
          obj.debtor = app.state.username;
          obj.noticeType = 'none';
          obj.noticesSent = 0;
          obj.dateOfDebt = `${month}/${day}/${year}`;



          items.push(obj);
        } else {
          for (var j = 0; j < item[0].members.length; j++) {  
            let obj = {};
            obj.username = app.state.username; 
            obj.email = app.state.email;
            obj.tripName = app.state.tripName;
            obj.receiptName = app.state.receiptName;
            obj.itemAmount = item[0].amount / item[0].members.length
            obj.itemName = item[0].name;
            obj.debtor = item[0].members[j];
            obj.noticeType = 'none';
            obj.noticesSent = 0;
            obj.dateOfDebt = `${month}/${day}/${year}`;


            items.push(obj);
          }
        }
      }
    }

    
    console.log('FLAT OBJS ARR is currently', items);
    return items;
  }

  componentWillMount() {
    this.getUsersFromFacebook();
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
    Util.verify(this.verifyAuthentication);
  }

  componentDidMount() {
    this.getRecentTrip();
    this.getDebt();
    this.getEntitlement();
  }

  verifyAuthentication(userInfo) {
    var temp = this.state.members;
    if (userInfo.name !== undefined) {
      temp.push([userInfo.name]);
    }
    this.setState({
      isAuthenticated: userInfo.isAuthenitcated,
      username: userInfo.name || '',
      members: temp,
      fb_id: userInfo.fb_id || '',
      photoUrl: userInfo.picture,
      email: userInfo.email || '',
    });
    console.log('verify members 2', this.state.members);
  }

  handleClickLogout(event) {
    event.preventDefault();
    Util.logout(this.verifyAuthentication);
  }
 
  addItem (itemArray) {
    if (this.state.name === '' || this.state.amount === '') {
      console.log('Please include item and price');
    } else {
      var temp = this.state.items;
      temp.push([{name: this.state.name, amount: this.state.amount, members: []}]);
      this.setState({
        items: temp
      });
    }
    this.state.name = '';
    this.state.amount = '';
  }

  deleteItem(index) {
    this.state.items.splice(0, 1);
    this.setState({
      items: this.state.items
    });
  }

  callGVision(form) {
    let data = new FormData(form);
    let currentScope = this;
    $.ajax({
      type: 'POST',
      url: '/upload',
      data: data,
      processData: false,
      contentType: false,
      success: (results) => {
        this.onGVision(results);
      },
    });
  }

  onGVision(itemizationObject) {
    let itemArray = [];
    for (var key in itemizationObject) {
      if (key.search(/tax/ig) !== -1) {
        if (!isNaN(itemizationObject[key])) {
          this.setState({sumTax: Number(itemizationObject[key])});
        } else {
          this.setState({sumTax: itemizationObject[key]});
        }
      }
      if (key.search(/(\btotal|\btota)/i) !== -1) {
        this.setState({sumTotal: Number(itemizationObject[key])});
      }
      if (key.search(/(\btotal|\btota)/i) === -1 && key.search(/tax/ig) === -1) {
        itemArray.push([{
          name: key,
          amount: itemizationObject[key],
          members: []
        }]);
      }


    }
    this.setState({items: itemArray});
  }

  getUsersFromFacebook (){
    var context = this;
    $.ajax({
      type: 'GET',
      url: '/getUsersFromFacebook',
      success: (results) => {
        this.setState({
          usersFromFacebook: results
        })
        context.setState({
          usersFromFacebook: results
        })
      },
      error: (error) => {
        console.log('error from updateUsersFromFacebook', error);
      }
    });
  }

  addMember (itemArray) {

    var temp = this.state.members;
    this.memberExist(this.state.member, (exist) => {
      this.setState({
        memberExist: exist
      });
      if (!exist) {
        temp.push([this.state.member]);
        this.setState({
          members: temp
        });
      }
    });
    this.state.member = '';
  }

  getDebt() {
    console.log('Getting Debt')
    var context = this;

    $.ajax({
      type: 'GET',
      url: '/debt',
      contentType: 'application/json',
      success: (results) => {
        // console.log('debt', results)
        // if (results.length === 0) {
        //   context.setState({
        //     debt: 'unavailable'
        //   })
        // } else {
        //   context.setState({
        //     debt: 'unavailable'
        //   })
        // }
      },
      error: (error) => {
        console.log('now you messed up')
        console.log('error', error);
      }
    });
  }

  getEntitlement() {
    console.log('Getting Debt')
    var context = this;

    $.ajax({
      type: 'GET',
      url: '/entitlement',
      contentType: 'application/json',
      success: (results) => {
        // console.log('entitlement', results)
        // context.setState({
        //   entitlement: 'unaailable';
        // })
      },
      error: (error) => {
        console.log('you have an error')
        console.log('error', error);
      }
    });
  }

  getRecentTrip() {
    $.ajax({
      url: '/recent',
      success: function(data) {
        console.log('recent trip', data);
      }
    });
  }

  calculateTotal() {
    let sum = 0;
    this.state.items.map((item, index) => {
      if (item[0].members.length === 0) {
        item[0].members = [].concat.apply([], this.state.members);
      }
      if (item[0].name !== '<NOTE>') {
        sum += Number(item[0].amount);
      }
    });
    this.setState({
      sumBill: sum.toFixed(2)
    });
  }

  onInputChange(event) {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value
    });
  }

  calculateMemberSum() {
    var context = this;
    var memberSum = {};
    var currentScope = this;
    this.state.items.forEach(function(itemArr) {
      var itemObj = itemArr[0];
      var eachPrice = itemObj.amount / itemObj.members.length;
      if (itemObj.members.length === 0) {
        // itemObj.members = [].concat.apply([], this.state.members);
        itemObj.members.push('Testing');
      }
      for (var i = 0; i < itemObj.members.length; i++) {
        if (memberSum[itemObj.members[i]]) {
          memberSum[itemObj.members[i]] += eachPrice;
        } else {
          memberSum[itemObj.members[i]] = eachPrice;
        }
      }
    });

    console.log('memberSum = ', memberSum)

    console.log(memberSum);

    this.setState({memberSum: memberSum});
    this.setState({entitlement: context.state.entitlement + memberSum})
  }


  memberExist(member, cb) {
    let exist = false;
    this.state.members.forEach((val, index) => {
      if (val[0].toUpperCase().trim() === member.toUpperCase().trim()) {
        exist = true;
      }
    });
    cb(exist);
  }

  handleTripNameSubmit(event) {
    Util.sendServerTripName(this.state.tripName, this.state.tripDesc );
  }

  itemOnClick(index) {
    const member = this.state.selectMember;
    let members = this.state.items[index][0].members;
    let items = this.state.items.slice();
    let membersCurrIndex = members.indexOf(member);

    if (membersCurrIndex < 0) {
      items[index][0].members = members.push([member]);
    } else {
      members.splice(membersCurrIndex, 1);
    }

    this.setState({
      items: items,
      selectItem: index
    });
  }

  initialMemberSelect() {
    if (this.state.selectMember.length === 0) {
      this.setState({
        selectMember: this.state.username
      });
    }
  }

  memberOnClick(member) {
    if (this.state.selectMember === '') {
      this.setState({
        selectMember: member
      });
    } else {
      this.setState({
        selectMember: ''
      })
    }
  }

  menuOnClick() {
    this.setState({
      sideMenuState: true
    });
  }

  closeMenu() {
    this.setState({
      sideMenuState: !this.state.sideMenuState
    });
  }

  updateDimensions() {
    this.setState({
      windowHeight: window.innerHeight
    });
  }

  render() {
    console.log('index members', this.state.members);
    return (
      <div className='site-container'>
        <Router>
          <div
            onClick={this.state.sideMenuState ? this.closeMenu : null}
            className={this.state.sideMenuState ? 'site-pusher-on' : 'site-pusher'}>
            <Navbar
              debt={this.state.debt}
              entitlement={this.state.entitlement}
              username={this.state.username}
              photoUrl={this.state.photoUrl}
              isAuthenticated={this.state.isAuthenticated}
              handleClickLogout={this.handleClickLogout}
              menuOnClick={this.menuOnClick}
              sideMenuState={this.state.sideMenuState}/>
          <div className='content-container'>
            <PrivateRouteHome path="/" isAuthenticated={this.state.isAuthenticated}
              data={this.state}
            />
            <PrivateRoute
              path="/create-trip"
              component={CreateTrip}
              isAuthenticated={this.state.isAuthenticated}
              tripName={this.state.tripName}
              onInputChange={this.onInputChange}
              handleTripNameSubmit={this.handleTripNameSubmit}
            />
            <PrivateRoute
              path ="/profile"
              isAuthenticated={this.state.isAuthenticated}
              component={Profile}
              username={this.state.username}
            />
            <PrivateRoute
              path ="/upload-receipt"
              isAuthenticated={this.state.isAuthenticated}
              component={UploadReceipt}
              tripName={this.state.tripName}
              tripDesc={this.state.tripDesc}
              data={this.state}
              callGVision={this.callGVision}
              data={this.state}
              onInputChange={this.onInputChange}
            />
            <PrivateRoute path="/additems" isAuthenticated={this.state.isAuthenticated} component={Itemization}
              addItem={this.addItem}
              itemName={this.state.name}
              itemAmount={this.state.amount}
              selectItem={this.state.selectItem}
              selectMember={this.state.selectMember}
              items={this.state.items}
              deleteItem={this.deleteItem}
              members={this.state.members}
              member={this.state.member}
              users={this.state.usersFromFacebook}
              sumBill={this.state.sumBill}
              sumTax={this.state.sumTax}
              sumTaxTip={this.state.sumTaxTip}
              calculateTotal={this.calculateTotal}
              memberExist={this.state.memberExist}
              addMember={this.addMember}
              initialMemberSelect={this.initialMemberSelect}
              itemOnClick={this.itemOnClick}
              memberOnClick={this.memberOnClick}
              onInputChange={this.onInputChange}/>
            <PrivateRoute
              path ="/summary"
              isAuthenticated={this.state.isAuthenticated}
              component={MemberSummary}
              calculateMemberSum={this.calculateMemberSum}
              data={this.state}
            />
            <PrivateRoute
              path ="/breakdown"
              isAuthenticated={this.state.isAuthenticated}
              component={Breakdown}
              data={this.state}
              recent={this.getRecentTrip}
            />
            <PrivateRoute
              path ="/recent-trips"
              isAuthenticated={this.state.isAuthenticated}
              component={TripSummary}
              data={this.state}
              recent={this.getRecentTrip}
            />
            <PrivateRoute
              path="/notifications"
              isAuthenticated={this.state.isAuthenticated}
              component={Notifications}
              data={this.state}
            />
            <Route path ="/login" render={() => (
              this.state.isAuthenticated ? <Redirect to="/" /> : <Login />
            )}/>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
