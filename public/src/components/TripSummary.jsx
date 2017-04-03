import React from 'react';
import ReactDOM from 'react-dom';
import TripEntry from './TripEntry.jsx';

class TripSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trips: []
    };
  }

  componentDidMount() {
    this.props.recent(function(data) {
      var result = this.state.trips;
      result.push(data[data.length - 1]);
      this.setState({
        trips: result
      });
    }.bind(this));
  }

  render() {
    return(
      <div className='page-container'>
        <h1>Most Recent Trips</h1>
        <div className='trip-summary'>{this.state.trips.map((val) => {
          return (<TripEntry data={val} />)
        })}
        </div>
      </div>
    )
  }
}

export default TripSummary;
