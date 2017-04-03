import React from 'react';

class TripEntry extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var members = this.props.data.names[0].reduce(function(acc, val) { return acc += val.name + ', ' }, '').slice(0, -2);
    return (
      <div>
        <h3>{this.props.data.trip}</h3>
        <h4>{'Members: ' + members}</h4>
      </div>
    )
  }
}

export default TripEntry;
