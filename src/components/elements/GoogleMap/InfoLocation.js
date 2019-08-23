import React, { PropTypes } from 'react'
import RS, { Option } from '../../../resources/resourceManager';
import RaisedButton from '../RaisedButton';

const propTypes = {
    location: PropTypes.object
}
class InfoLocation extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="popover-info-container">
                <div className="popover-info-location">
                    <div className="popover-label">{RS.getString('LOCATION_NAME')}</div>
                    <div className="name">{this.props.location.name}</div>
                    <div className="popover-label">{RS.getString('ADDRESS')}</div>
                    <div className="address">{this.props.location.address}</div>
                    <div className='text-right'>
                        <RaisedButton
                            label={RS.getString("CANCEL")}
                            onClick={this.props.onCancel}
                            className="raised-button-fourth"
                        />
                        <RaisedButton
                            label={RS.getString("EDIT")}
                            onClick={this.props.editLocation.bind(this,this.props.location)}
                            className="raised-button-first"
                        />
                    </div>
                </div>
            </div>
        )
    }
}
InfoLocation.propTypes = propTypes;
export default InfoLocation