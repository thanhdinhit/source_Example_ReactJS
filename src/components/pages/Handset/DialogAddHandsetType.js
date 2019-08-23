import React from 'react';
import RS, { Option } from '../../../resources/resourceManager';
import Dialog from '../../elements/Dialog';
import RaisedButton from '../../elements/RaisedButton';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import { getHandsetsConstraints } from '../../../validation/handsetsConstraints';
import * as toastr from '../../../utils/toastr';

import * as handsetActions from '../../../actionsv2/handsetActions';
import { hideAppLoadingIndicator, showAppLoadingIndicator } from '../../../utils/loadingIndicatorActions';

class DialogAddHandsetType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.submitAddHandsetType = this.submitAddHandsetType.bind(this);
    }

    submitAddHandsetType() {
        if (this.handsetType.validate()) {
            let handsetType = {};
            handsetType.type = this.handsetType.getValue();
            showAppLoadingIndicator();
            handsetActions.addHandsetType(handsetType, this.handleCallbackAction)
        }
    }

    handleCallbackAction = (err, result) => {
        hideAppLoadingIndicator();
        if (err) {            
            toastr.error(err.message, RS.getString("ERROR"));
        } else {
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
            this.props.handleClose();
            this.props.callback();
        }
    }

    render() {
        const handsetsConstraints = getHandsetsConstraints();
        return (
            <Dialog
                title={(RS.getString('NEW_HANDSET_TYPE', null, Option.UPPER))}
                isOpen={this.props.isOpen}
                handleClose={this.props.handleClose}
                style={{ widthBody: '426px' }}
                modal
                modalBody="none-scroll"
            >
                <div className="dialog-add-handset-type">
                    <div className="handset-content">
                        <div>
                            <CommonTextField
                                required
                                title={RS.getString('HANDSET_TYPE')}
                                id="handsetType"
                                ref={(input) => this.handsetType = input}
                                constraint={handsetsConstraints.handsetType}
                            />
                        </div>
                    </div>
                    <div className="handset-footer">
                        <div className="row">
                            <RaisedButton
                                label={RS.getString('CANCEL')}
                                onClick={this.props.handleClose}
                                className="raised-button-fourth"
                            />
                            <RaisedButton
                                label={<span className="label-icon">{RS.getString('SAVE_CLOSE')}</span>}
                                onClick={() => this.submitAddHandsetType()}
                            />
                            <RaisedButton
                                label={<span className="label-icon">{RS.getString('SAVE_CONTINUE')}</span>}
                                onClick={() => this.submitAddHandsetType()}
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
        )
    }

}

export default DialogAddHandsetType;
