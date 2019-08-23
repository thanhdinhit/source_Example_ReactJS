import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import React, { PropTypes } from 'react'
import RS, { Option } from '../../../resources/resourceManager';
const propTypes = {
};

class MyGoogleMap extends React.Component {
    constructor(props) {
        super(props);
        this.onBoundsChanged = this.onBoundsChanged.bind(this)
    }
    onBoundsChanged() {
        let bounds = undefined
        let center = undefined
        let zoom = undefined
        if (this.map) {
            bounds = this.map.getBounds()
            center = this.map.getCenter();
            zoom = this.map.getZoom();
            this.setState({
                bounds: bounds,
                center: center
            })
        }
        this.props.onBoundsChanged && this.props.onBoundsChanged(bounds, center, zoom)
    }
    render() {
        return (
            <GoogleMap
                defaultCenter={GOOGLEMAP.DEFAULT_CENTER}
                ref={(map) => this.map = map}
                defaultZoom={GOOGLEMAP.DEFAULT_ZOOM}
                onBoundsChanged={this.onBoundsChanged}
            >
                {this.props.children}
            </GoogleMap>
        )
    }
}
MyGoogleMap.propTypes = propTypes
// loadingElement={<div style={{ height: `100%` }} />}
// containerElement={<div style={{ height: `400px` }} />}
// mapElement={<div style={{ height: `100%` }} />}
export default withGoogleMap(MyGoogleMap);