import React from 'react';
import ReactDOM from 'react-dom';
import TripEntry from './TripEntry.jsx';

class TripSummary extends React.Component {
  constructor(props) {
    super(props);
  }

  // componentDidMount() {
  //   this.props.;
  // }

  render() {
    console.log('trip summary', this.props);
    return(
      <div className='page-container'>
        <h1>Most Recent Trips</h1>
        <div className='trip-summary'>{this.props.data.recent.map((item,index) => {
          return (<TripEntry trip={item} />)
        })}
        </div>
      </div>
    )
  }
}

export default TripSummary;
