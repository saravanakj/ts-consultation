import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
 
export class LocationSearchInput extends React.Component {
 

  constructor(props) {   
    super(props);
    this.state = { address: props.address || '', endIcon: props.endIcon || null, 
                  endIconClick: props.endIconClick, index: props.index };
  }

  handleChange = address => {
    this.setState({ address });
  };
 
  handleSelect = (address, placeId, suggestion) => {
    this.setState({address: address});
    console.log('address=', address);
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        console.log('Success', latLng);
        let data = { address : address, latLng: latLng};
        this.props.locationSelected(data);
      })
      .catch(error => console.error('Error', error));

    
      const div = document.createElement('div')
      if((window).google && (window).google.maps && (window).google.maps.places) {
        let service = new (window).google.maps.places.PlacesService(div);
        service.getDetails({placeId: placeId}, (results, status) => {
          if (status === (window).google.maps.places.PlacesServiceStatus.OK) {
            if(results && results.utc_offset_minutes && this.props.onReceiveOtherDetails) {
                this.props.onReceiveOtherDetails({ offset: results.utc_offset_minutes });
            }
          } else {
            console.log('place details not found!');
          }
        })
    }

  };

  componentWillReceiveProps(props){
    this.setState({
      address: props.address
    })
  }
 
  render() {
    return (
      <PlacesAutocomplete 
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Place',
                className: 'location-search-input',
              })}/>
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
              
            </div>
           
          </div>
          
        )}
       
      </PlacesAutocomplete>
    );
  }
}