import React, { PropTypes } from 'react';
import RS from '../../../../resources/resourceManager';
import Dialog from '../../../elements/Dialog';
import NewLeave from './NewLeave';

const propTypes = {
    isOpen: PropTypes.bool,
    handleClose: PropTypes.func,
}
class DialogNewLeave extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div className="new-leave">
                <Dialog
                    modal
                    title={RS.getString('LEAVE_REQUEST', null, 'UPPER')}
                    style={{ widthBody: '370px' }}
                    isOpen={this.props.isOpen}
                    handleClose={this.props.handleClose}
                    modalBody='dialog-newLeave'
                >
                    <NewLeave
                        leaveBalances={this.props.leaveBalances}
                        approvers={this.props.approvers}
                        leaveHours={this.props.leaveHours}
                        leaveActions={this.props.leaveActions}
                        getApprovers={this.props.getApprovers}
                        handleClose={this.props.handleClose}
                        handleSubmitSuccess = {this.props.handleSubmitSuccess}
                    />
                </Dialog>
            </div>
        )
    }

}

DialogNewLeave.propTypes = propTypes;
export default DialogNewLeave;