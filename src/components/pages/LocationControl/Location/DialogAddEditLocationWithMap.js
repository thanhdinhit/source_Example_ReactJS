import React, { PropTypes } from 'react'
import Dialog from '../../../elements/Dialog';
import RS, { Option } from '../../../../resources/resourceManager';
import RaisedButton from '../../../elements/RaisedButton';
import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import TextArea from '../../../elements/TextArea';
import MyGoogleMapSearchBox from '../../../elements/GoogleMap/MyGoogleMapSearchBox'
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager";
import CommonSelect from '../../../elements/CommonSelect.component';
import { getGeofenceType, LOCATION_PHYSIC_TYPE } from "./../../../../core/common/constants";
import { getLocationConstraints } from '../../../../validation/locationConstraints';
import { MODE_PAGE } from '../../../../core/common/constants';
import { Circle, Polygon } from "react-google-maps";

const propTypes = {
    mode: PropTypes.string,
    location: PropTypes.object,

}

class DialogAddEditLocationWithMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            drawingMode: [google.maps.drawing.OverlayType.CIRCLE],
            isDrawing: true,
            location: _.cloneDeep(this.props.location)
        }
        this.onCircleComplete = this.onCircleComplete.bind(this)
        this.onCenterChanged = this.onCenterChanged.bind(this)
        this.onRadiusChanged = this.onRadiusChanged.bind(this)
        this.onTypeChange = this.onTypeChange.bind(this)
        this.onPolygonComplete = this.onPolygonComplete.bind(this)
        this.saveLocation = this.saveLocation.bind(this)
        this.onChangeParamsCircle = this.onChangeParamsCircle.bind(this)
        this.validate = this.validate.bind(this)
    }
    componentWillMount() {

        if (this.state.location) {
            switch (this.state.location.type) {
                case LOCATION_PHYSIC_TYPE.BUILDING:
                    this.state.drawingMode = [google.maps.drawing.OverlayType.CIRCLE]

                    break;
                case LOCATION_PHYSIC_TYPE.FENCE:
                    this.state.drawingMode = [google.maps.drawing.OverlayType.POLYGON]
                    break;
            }
        } else {
            this.state.location = {
                type: LOCATION_PHYSIC_TYPE.BUILDING
            }
        }
    }
    componentDidMount() {
        if (this.state.location.type == LOCATION_PHYSIC_TYPE.BUILDING && this.state.location.center) {
            this.lat.setValue(this.state.location.center.lat().toFixed(6))
            this.lng.setValue(this.state.location.center.lng().toFixed(6))
            this.radius.setValue(this.state.location.radius.toFixed(6))
        }
    }
    onCenterChanged() {
        this.lat.setValue(this.circle.getCenter().lat().toFixed(6))
        this.lng.setValue(this.circle.getCenter().lng().toFixed(6))
        if (this.address.getValue() == '') {
            var geocoder = new google.maps.Geocoder;
            var center = this.state.circle.getCenter();
            geocoder.geocode({ 'location': center }, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        this.address.setValue(results[0].formatted_address)
                    } else {
                        // window.alert('No results found');
                    }
                } else {
                    // window.alert('Geocoder failed due to: ' + status);
                }
            });
        }
        this.setState({
            location: {
                ...this.state.location,
                center: new google.maps.LatLng({
                    lat: this.circle.getCenter().lat(),
                    lng: this.circle.getCenter().lng()
                })
            }
        })

    }
    onRadiusChanged() {
        this.radius.setValue(this.circle.getRadius().toFixed(6))
        this.setState({
            location: {
                ...this.state.location,
                radius: this.circle.getRadius()
            }
        })
    }
    onCircleComplete(circle) {
        this.lat.setValue(circle.getCenter().lat().toFixed(6))
        this.lng.setValue(circle.getCenter().lng().toFixed(6))
        this.radius.setValue(circle.radius.toFixed(6))
        this.setState({
            location: {
                ...this.state.location,
                center: circle.getCenter(),
                radius: circle.radius
            },
            isDrawing: false
        }, () => this.setState({ isDrawing: true }))

        circle.setMap(null)

        // circle.addListener("center_changed", this.circleCenterChanged)
        // circle.addListener("radius_changed", this.circleRadiusChanged)

        if (this.address.getValue() == '') {
            var geocoder = new google.maps.Geocoder;
            var center = circle.getCenter();
            geocoder.geocode({ 'location': center }, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        this.address.setValue(results[0].formatted_address)
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
        }

    }
    onPolygonComplete(polygon) {
        this.setState({
            location: {
                ...this.state.location,
                paths: polygon.getPath().getArray()
            },
            isDrawing: false
        }, () => this.setState({ isDrawing: true }))
        polygon.setMap(null)
    }
    onTypeChange(option) {
        this.setState({ isDrawing: false },
            () => {
                switch (option) {
                    case LOCATION_PHYSIC_TYPE.BUILDING: //circle
                        this.setState({
                            drawingMode: [google.maps.drawing.OverlayType.CIRCLE],
                            isDrawing: true,
                            location: {
                                ...this.state.location,
                                type: LOCATION_PHYSIC_TYPE.BUILDING,
                                paths: [],
                                center: null
                            }
                        })
                        break;
                    case LOCATION_PHYSIC_TYPE.FENCE: //polygon
                        this.setState({
                            drawingMode: [google.maps.drawing.OverlayType.POLYGON],
                            isDrawing: true,
                            location: {
                                ...this.state.location,
                                type: LOCATION_PHYSIC_TYPE.FENCE,
                                center: null,
                                paths: []
                            }
                        })
                        break;
                }
            }
        )

    }
    onChangeParamsCircle() {
        let rs = true
        const fields = ['lat', 'lng', 'radius']
        fields.forEach(element => {
            if (!this[element].validate())
                rs = false;
        });
        if (rs) {
            this.setState({
                location: {
                    ...this.state.location,
                    center: new google.maps.LatLng({
                        lat: Number(this.lat.getValue()),
                        lng: Number(this.lng.getValue())
                    }),
                    radius: Number(this.radius.getValue())
                }
            })
        }

    }
    saveLocation() {
        if (this.validate()) {
            let location = this.getValue();
            this.props.onSubmit(location)
        }
    }
    getValue() {
        let location = this.state.location
        location.name = this.locationName.getValue();
        location.address = this.address.getValue();
        switch (this.state.location.type) {
            case LOCATION_PHYSIC_TYPE.BUILDING:
                location.latitudeCenter = this.state.location.center.lat();
                location.longitudeCenter = this.state.location.center.lng();
                break;
            case LOCATION_PHYSIC_TYPE.FENCE:
                location.paths = this.polygon.getPath().getArray();
                break;
        }
        return location;
    }
    validate() {
        let rs = true;
        const fieldValidates = [
            'locationName', 'address'
        ];
        fieldValidates.forEach(function (field) {
            if (!this[field].validate() && rs) {
                rs = false;
            }
        }, this);
        if (!rs) return rs;
        switch (this.state.location.type) {
            case LOCATION_PHYSIC_TYPE.BUILDING:
                const fieldValidates = [
                    'lat', 'lng', 'radius'
                ];
                fieldValidates.forEach(function (field) {
                    if (!this[field].validate() && rs) {
                        rs = false;
                    }
                }, this);
                if (rs)
                    rs = !!this.state.location.center
                break;
            case LOCATION_PHYSIC_TYPE.FENCE:
                rs = this.state.location.paths.length;
                break;
        }
        return rs;
    }
    renderContent() {
        let locationConstraints = getLocationConstraints();
        let options = getGeofenceType();
        return (
            <div className="google-map">
                <div className="row">
                    <div className="col-sm-4">
                        <CommonTextField
                            ref={(input) => this.locationName = input}
                            title={RS.getString("LOCATION_NAME")}
                            required
                            constraint={locationConstraints.locationName}
                            defaultValue={_.get(this.state.location, "name", '')}
                        />
                        <CommonSelect
                            required
                            title={RS.getString('GEOFENCE_TYPE')}
                            clearable={false}
                            searchable={false}
                            name="select-gender"
                            value={this.state.location.type}
                            simpleValue={true}
                            options={options}
                            onChange={this.onTypeChange}

                        />
                    </div>
                    <div className="col-sm-8">
                        <TextArea
                            required
                            title={RS.getString('ADDRESS')}
                            line={5}
                            ref={(input) => this.address = input}
                            constraint={locationConstraints.address}
                            defaultValue={_.get(this.state.location, "address", '')}
                        />
                    </div>
                </div>
                <MyGoogleMapSearchBox
                    zoom={this.props.zoom || GOOGLEMAP.DEFAULT_ZOOM}
                    center={this.props.center || GOOGLEMAP.DEFAULT_CENTER}
                    ref={(map) => this.map = map}
                    containerElement={<div className="location-dialog-google" />}
                    mapElement={<div className="location-dialog-google" />}
                >

                    {this.state.isDrawing && <DrawingManager
                        onCircleComplete={this.onCircleComplete}
                        onPolygonComplete={this.onPolygonComplete}
                        options={{
                            drawingControl: true,
                            drawingControlOptions: {
                                position: google.maps.ControlPosition.TOP_CENTER,
                                drawingModes: this.state.drawingMode
                            },
                            circleOptions: {
                                fillColor: '#db5461',
                                fillOpacity: 0.2,
                                strokeWeight: 0,
                                strokeColor: '#FF0000',
                                clickable: false,
                                editable: true,
                                zIndex: 1,
                            },
                            polygonOptions: {
                                fillColor: '#db5461',
                                fillOpacity: 0.2,
                                strokeWeight: 0,
                                strokeColor: '#FF0000',
                                clickable: false,
                                editable: true,
                                zIndex: 1,
                            }
                        }}
                    />
                    }
                    {
                        this.state.location.type == LOCATION_PHYSIC_TYPE.BUILDING &&
                        <Circle
                            ref={(circle) => this.circle = circle}
                            onCenterChanged={this.onCenterChanged}
                            onRadiusChanged={this.onRadiusChanged}
                            center={this.state.location.center}
                            radius={this.state.location.radius}
                            options={{
                                fillColor: '#db5461',
                                fillOpacity: 0.2,
                                strokeWeight: 0,
                                strokeColor: '#FF0000',
                                clickable: false,
                                editable: true,
                                zIndex: 1,
                            }}
                        />
                    }
                    {
                        this.state.location.type == LOCATION_PHYSIC_TYPE.FENCE &&
                        <Polygon
                            paths={this.state.location.paths}
                            ref={(polygon) => this.polygon = polygon}
                            options={{
                                fillColor: '#db5461',
                                fillOpacity: 0.2,
                                strokeWeight: 0,
                                strokeColor: '#FF0000',
                                clickable: false,
                                editable: true,
                                zIndex: 1,
                            }}
                        />
                    }
                </MyGoogleMapSearchBox>


                {
                    this.state.location.type == LOCATION_PHYSIC_TYPE.BUILDING && <div className="row">
                        <div className="col-sm-4">
                            <CommonTextField
                                ref={(input) => this.lat = input}
                                title={RS.getString("LATITUDE")}
                                required
                                constraint={locationConstraints.latlng}
                                onChange={this.onChangeParamsCircle.bind(this, 1, null, null)}
                            />
                        </div>
                        <div className="col-sm-4">
                            <CommonTextField
                                ref={(input) => this.lng = input}
                                title={RS.getString("LONGTITUDE")}
                                required
                                constraint={locationConstraints.latlng}
                                onChange={this.onChangeParamsCircle.bind(this, null, 1, null)}
                            />
                        </div>
                        <div className="col-sm-4">
                            <CommonTextField
                                ref={(input) => this.radius = input}
                                title={RS.getString("RADIUS")}
                                required
                                constraint={locationConstraints.radius}
                                onChange={this.onChangeParamsCircle.bind(this, null, null, 1)}
                            />
                        </div>
                    </div>
                }

            </div>
        )
    }
    render() {
        let actions = [
            <RaisedButton
                key={0}
                label={RS.getString('CANCEL', null, Option.UPPER)}
                onClick={this.props.handleClose}
                className="raised-button-fourth"
            />,
            <RaisedButton
                key={1}
                label={RS.getString('OK', null, Option.UPPER)}
                onClick={this.saveLocation}
                disabled={!this.state.location.center && !(this.state.location.paths && this.state.location.paths.length)}
            />
        ]
        return (
            <Dialog
                style={{ widthBody: '730px' }}
                isOpen={this.props.isOpen}
                actions={actions}
                title={this.props.mode == MODE_PAGE.EDIT ? RS.getString('EDIT_LOCATION', null, Option.UPPER) : RS.getString('NEW_LOCATION', null, Option.UPPER)}
                modal={true}
                handleClose={this.props.handleClose}
                className="dialog-add-edit-location">
                {this.renderContent()}
            </Dialog>

        )
    }


}

export default DialogAddEditLocationWithMap;
