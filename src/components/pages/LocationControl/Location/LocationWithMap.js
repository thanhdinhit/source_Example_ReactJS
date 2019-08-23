import React, { PropTypes } from 'react';
import MyGoogleMap from '../../../elements/GoogleMap/MyGoogleMap'
import Building from '../../../elements/GoogleMap/Building'
import Area from '../../../elements/GoogleMap/Area'
import { Circle, Polygon, Marker } from "react-google-maps";
import { LOCATION_PHYSIC_TYPE } from '../../../../core/common/constants';
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import InfoLocation from '../../../elements/GoogleMap/InfoLocation';

const propTypes = {

};

class LocationWithMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenInfoBox: false,
            selectLocation: undefined
        }
        this.onShowInfo = this.onShowInfo.bind(this)
        this.editLocation = this.editLocation.bind(this)
        this.onCancelShowInfo = this.onCancelShowInfo.bind(this)
    }

    onShowInfo(location) {
        if (this.state.selectLocation && this.state.selectLocation.id == location.id) {
            this.setState({
                isOpenInfoBox: false,
                selectLocation: undefined
            })
        }
        else {
            if (location.type == LOCATION_PHYSIC_TYPE.FENCE) {

            }
            this.setState({
                isOpenInfoBox: false,
                selectLocation: location
            }, () => this.setState({ isOpenInfoBox: true }))
        }

    }
    editLocation(location) {
        this.setState({ isOpenInfoBox: false, selectLocation: undefined })
        this.props.editLocation(location)
    }
    onCancelShowInfo(){
        this.setState({
            isOpenInfoBox: false,
            selectLocation: undefined
        })
    }
    render() {
        let buildings = _.filter(this.props.locations, x => x.type == LOCATION_PHYSIC_TYPE.BUILDING);
        let fences = _.filter(this.props.locations, x => x.type == LOCATION_PHYSIC_TYPE.FENCE);
        return (
            <div className="google-map">
                <MyGoogleMap
                    onBoundsChanged = {this.props.onBoundsChanged}
                    containerElement={<div className="location-map-view" />}
                    mapElement={<div className="location-map-view" />}
                >
                    {
                        _.map(buildings, (building, index) => {
                            return (
                                <Building
                                    key={index}
                                    location={building}
                                    onShowInfo={this.onShowInfo}
                                />
                            )
                        })
                    }
                    {
                        _.map(fences, (fence, index) => {
                            return (
                                <Area
                                    key={index}
                                    location={fence}
                                    onShowInfo={this.onShowInfo}
                                />
                            )
                        })
                    }
                    {
                        this.state.isOpenInfoBox &&
                        <InfoBox
                            ref = {(infoBox)=> this.infoBox = infoBox}
                            options={{
                                closeBoxURL: '',
                                maxWidth: 375,
                                pixelOffset: new google.maps.Size(-188, -45),
                                alignBottom: true,
                                enableEventPropagation: true
                            }}
                            position={this.state.selectLocation.center}
                        >
                            <InfoLocation
                                location={this.state.selectLocation}
                                editLocation={this.editLocation}
                                onCancel = {this.onCancelShowInfo}
                            />
                        </InfoBox>
                    }
                </MyGoogleMap>

            </div>
        )
    }
}

LocationWithMap.propTypes = propTypes;
export default LocationWithMap;