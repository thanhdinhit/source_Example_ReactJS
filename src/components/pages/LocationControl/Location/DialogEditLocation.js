import React, { PropTypes } from 'react';
import Dialog from '../../../elements/Dialog';
import RS, { Option } from '../../../../resources/resourceManager';
import RaisedButton from '../../../elements/RaisedButton';
import { getLocationConstraints } from '../../../../validation/locationConstraints';
import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import TextArea from '../../../elements/TextArea';
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';

const propTypes = {
    location: PropTypes.object
};

class DialogEditLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
        this.close = this.close.bind(this)
        this.open = this.open.bind(this)
        this.saveLocation = this.saveLocation.bind(this)
    }

    close() { 
        this.setState({ isOpen: false })
    }
    open() {
        this.setState({ isOpen: true })
    }
    saveLocation() {
        let rs = true;
        let fiels = ['locationName', 'address']
        fiels.forEach(element => {
            if (!this[element].validate()) {
                rs = false;
            }
        });

        if (!rs) return;

        let newLocation = _.cloneDeep(this.props.location);
        newLocation.name = this.locationName.getValue();
        newLocation.address = this.address.getValue();
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.locationActions.editLocation(newLocation.id, newLocation);
    }
    render() {
        let constrains = getLocationConstraints();
        let actions = [
            <RaisedButton
                key={0}
                label={RS.getString('CANCEL', null, Option.UPPER)}
                onClick={this.close}
                className="raised-button-fourth"
            />,
            <RaisedButton
                key={1}
                label={RS.getString('OK', null, Option.UPPER)}
                onClick={this.saveLocation}
            />
        ]
        return (
            <Dialog
                className="dialog-edit-location"
                handleClose={this.close}
                title={RS.getString('EDIT_LOCATION', null, Option.UPPER)}
                actions={actions}
                modal={true}
                isOpen={this.state.isOpen}>
                <div>
                    <CommonTextField
                        id="locationName"
                        required
                        title={RS.getString('LOCATION_NAME')}
                        fullWidth={true}
                        ref={(input) => this.locationName = input}
                        constraint={constrains.locationName}
                        defaultValue = {this.props.location? this.props.location.name : ''}
                    />
                    <TextArea
                        title={RS.getString('ADDRESS')}
                        required
                        line={5}
                        ref={(input) => this.address = input}
                        constraint={constrains.address}
                        defaultValue = {this.props.location? this.props.location.address : ''}
                    />
                </div>
            </Dialog>
        )
    }
}

DialogEditLocation.propTypes = propTypes;
export default DialogEditLocation;