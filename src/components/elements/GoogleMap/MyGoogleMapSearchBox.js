import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import React, { PropTypes } from 'react'
import RS, { Option } from '../../../resources/resourceManager';
import SearchBox from "react-google-maps/lib/components/places/SearchBox";

const propTypes = {
};

class MyGoogleMapSearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bounds: undefined,
            center: this.props.center || GOOGLEMAP.DEFAULT_CENTER,
            zoom: this.props.zoom || GOOGLEMAP.DEFAULT_ZOOM,
            marker: undefined
        }
        this.onPlacesChanged = this.onPlacesChanged.bind(this)
        this.onBoundsChanged = this.onBoundsChanged.bind(this)
    }
    onBoundsChanged() {
        let bounds = undefined
        let center = undefined
        if (this.map) {
            bounds = this.map.getBounds()
            center = this.map.getCenter();
            this.setState({
                bounds: bounds,
                center: center
            })
        }
        this.props.onBoundsChanged && this.props.onBoundsChanged(bounds, center)
    }

    onPlacesChanged() {
        const places = this.searchBox.getPlaces();
        const bounds = new google.maps.LatLngBounds();

        if (places.length) {
            this.setState({
                center: places[0].geometry.location,
                marker: places[0].geometry.location,
            });
            this.props.onSearchChange && this.props.onSearchChange(places[0])
        }
    }

    render() {
        return (
            <GoogleMap
                center={this.state.center}
                defaultZoom={this.state.zoom}
                onBoundsChanged={this.onBoundsChanged}
            >
                <SearchBox
                    ref={(searchBox) => this.searchBox = searchBox}
                    bounds={this.state.bounds}
                    controlPosition={google.maps.ControlPosition.TOP_LEFT}
                    onPlacesChanged={this.onPlacesChanged}
                >
                    <input
                        className="google-search-input"
                        type="text"
                        placeholder={RS.getString('SEARCH')}
                    />
                </SearchBox>
                {
                    this.state.marker && <Marker
                        position={this.state.marker}
                    />
                }
                {this.props.children}
            </GoogleMap>
        )
    }
}
MyGoogleMapSearchBox.propTypes = propTypes
// loadingElement={<div style={{ height: `100%` }} />}
// containerElement={<div style={{ height: `400px` }} />}
// mapElement={<div style={{ height: `100%` }} />}
export default withGoogleMap(MyGoogleMapSearchBox);