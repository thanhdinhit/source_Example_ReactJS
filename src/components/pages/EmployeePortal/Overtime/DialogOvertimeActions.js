import React, { PropTypes } from 'react';
import _ from 'lodash';

import Dialog from '../../../elements/Dialog';
import TextArea from '../../../elements/TextArea';
import RaisedButton from '../../../elements/RaisedButton';

import RS from '../../../../resources/resourceManager';
import { OVERTIME_ACTION_TYPE } from '../../../../core/common/constants'
import { getOvertimeActionConstraints } from '../../../../validation/OvertimeActionConstraints';

const propTypes = {
    isOpen: PropTypes.bool,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    actionType: PropTypes.string
};

class DialogOvertimeActions extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getActions = this.getActions.bind(this);
        this.getTitle = this.getTitle.bind(this);
    }

    handleSubmit() {
        if (this.validate()) {
            this.props.handleSubmit(this.reason.getValue());
        }
    }

    validate() {
        return this.reason.validate();
    }

    getActions() {
        switch (this.props.actionType) {
            case OVERTIME_ACTION_TYPE.DECLINE: {
                return [
                    <RaisedButton
                        key="cancel"
                        className="raised-button-fourth"
                        label={RS.getString('CANCEL')}
                        onClick={this.props.handleClose}
                    />,
                    <RaisedButton
                        key="submit"
                        className="raised-button"
                        label={RS.getString('SUBMIT')}
                        onClick={this.handleSubmit}
                    />
                ];
            }
            case OVERTIME_ACTION_TYPE.CANCEL_OVERTIME_REQUEST: {
                return [
                    <RaisedButton
                        key="cancel"
                        className="raised-button-fourth"
                        label={RS.getString('CANCEL')}
                        onClick={this.props.handleClose}
                    />,
                    <RaisedButton
                        key="send"
                        className="raised-button"
                        label={RS.getString('SEND')}
                        onClick={this.handleSubmit}
                    />
                ];
            }
            default:
                return null;
        }
    }

    getTitle() {
        switch (this.props.actionType) {
            case OVERTIME_ACTION_TYPE.DECLINE: {
                return RS.getString('DECLINE_MY_OVERTIME', null, 'UPPER');
            }
            case OVERTIME_ACTION_TYPE.CANCEL_OVERTIME_REQUEST: {
                return RS.getString('CANCEL_OVERTIME_REQUEST', null, 'UPPER');
            }
        }
    }

    render() {
        const overtimeActionsConstraints = getOvertimeActionConstraints();
        return (
            <div>
                <Dialog
                    style={{ widthBody: '415px' }}
                    isOpen={this.props.isOpen}
                    title={this.getTitle()}
                    handleClose={this.props.handleClose}
                    actions={this.getActions()}
                    className="approve-decline-cancel-leave"
                    modal
                    modalBody="modalBody"
                    modalFooter="none-boder"
                >
                    <div className="row">
                        <div className="col-xs-12">
                            <TextArea
                                line={3}
                                placeholder={RS.getString('WRITE_YOUR_REASON')}
                                ref={(input) => this.reason = input}
                                constraint={overtimeActionsConstraints.reason}
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

DialogOvertimeActions.propTypes = propTypes;
export default DialogOvertimeActions;