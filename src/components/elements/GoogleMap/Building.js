import React, { PropTypes } from 'react'
import { Circle, Marker} from "react-google-maps"

const propTypes = {
    location: PropTypes.object,
    onShowInfo: PropTypes.func
}
class Building extends React.Component {
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
                <Circle
                    center={this.props.location.center}
                    radius={this.props.location.radius}
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
                >
                   
                </Marker>

            </div>
        )
    }
}
Building.propTypes = propTypes;
export default Building