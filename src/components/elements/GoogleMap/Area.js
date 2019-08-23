import React, { PropTypes } from 'react'
import { Polygon, Marker } from "react-google-maps"
const propTypes = {
    location: PropTypes.object,
    onShowInfo: PropTypes.func
}
class Area extends React.Component {
    constructor(props) {
        super(props);
        this.onShowInfo = this.onShowInfo.bind(this)
    }
    onShowInfo() {
        this.props.onShowInfo(this.props.location)
    }

    render() {

        return (
            <div>
                <Polygon
                    paths={this.props.location.paths}
                    options={{
                        fillColor: '#db5461',
                        fillOpacity: 0.2,
                        strokeWeight: 0,
                        strokeColor: '#FF0000'
                    }}
                />
                <Marker
                    position={this.props.location.center}
                    onClick={this.onShowInfo}
                />
            </div>
        )
    }
}
Area.propTypes = propTypes
export default Area