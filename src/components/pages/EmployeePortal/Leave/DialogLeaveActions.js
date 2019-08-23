import React, { PropTypes } from 'react';
import _ from 'lodash';

import Dialog from '../../../elements/Dialog';
import TextArea from '../../../elements/TextArea';
import RaisedButton from '../../../elements/RaisedButton';

import RS from '../../../../resources/resourceManager';
import { LEAVE_ACTION_TYPE } from '../../../../core/common/constants'
import { getLeaveActionConstraints } from '../../../../validation/leaveActionConstraints';
import { MAX_LENGTH_INPUT } from '../../../../core/common/config';

const propTypes = {
    isOpen: PropTypes.bool,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    actionType: PropTypes.string
};

class DialogLeaveActions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            length: 0
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getActions = this.getActions.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
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
            case LEAVE_ACTION_TYPE.DECLINE:
            case LEAVE_ACTION_TYPE.CANCEL_EMPLOYEE_LEAVE: {
                return [
                    <RaisedButton
                        key="cancel"
                        className="raised-button-fourth"
                        label={RS.getString('CANCEL')}
                        onClick={this.handleCancel}
                    />,
                    <RaisedButton
                        key="send"
                        className="raised-button"
                        label={RS.getString('SEND')}
                        onClick={this.handleSubmit}
                    />
                ];
            }
            case LEAVE_ACTION_TYPE.CANCEL_MY_LEAVE: {
                return [
                    <RaisedButton
                        key="cancel"
                        className="raised-button-fourth"
                        label={RS.getString('CANCEL')}
                        onClick={this.handleCancel}
                    />,
                    <RaisedButton
                        key="submit"
                        className="raised-button"
                        label={RS.getString('SUBMIT')}
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
            case LEAVE_ACTION_TYPE.CANCEL_EMPLOYEE_LEAVE: {
                return RS.getString('CANCEL_LEAVE_REQUEST', null, 'UPPER');
            }
            case LEAVE_ACTION_TYPE.DECLINE: {
                return RS.getString('DECLINE_LEAVE_REQUEST', null, 'UPPER');
            }
            case LEAVE_ACTION_TYPE.CANCEL_MY_LEAVE: {
                return RS.getString('CANCEL_MY_LEAVE', null, 'UPPER');
            }
        }
    }
    handleCancel() {
        this.setState({ length: 0 }, () => this.props.handleClose())
    }
    render() {
        const leaveActionsConstraints = getLeaveActionConstraints();
        return (
            <div>
                <Dialog
                    style={{ widthBody: '415px' }}
                    isOpen={this.props.isOpen}
                    title={this.getTitle()}
                    handleClose={this.handleCancel}
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
                                constraint={leaveActionsConstraints.reason}
                                onChange={(e, value) => this.setState({ length: value.length })}
                                maxLength={MAX_LENGTH_INPUT.REASON}
                            />
                            <span className="pull-right">{this.state.length}/{MAX_LENGTH_INPUT.REASON}</span>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

DialogLeaveActions.propTypes = propTypes;
export default DialogLeaveActions;