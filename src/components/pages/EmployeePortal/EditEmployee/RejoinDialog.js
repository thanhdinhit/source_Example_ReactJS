import React, { PropTypes } from 'react';
import Dialog from '../../../elements/Dialog';
import RaisedButton from '../../../elements/RaisedButton';
import RS from '../../../../resources/resourceManager';
import CommonDatePicker from '../../../elements/DatePicker/CommonDatePicker';
import { getEmployeeConstraints } from '../../../../validation/employeeConstraints';

const propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    handleSave: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    modal: PropTypes.bool,
};

class TerminationDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleSave() {
        if (this.validateForm()) {
            this.props.handleSave(this.rejoinedDate.getValue());
        }
    }

    validateForm() {
        return this.rejoinedDate.validate();
    }

    handleCancel() {
        this.props.handleCancel();
    }

    render() {
        const editEmployeeConstraints = getEmployeeConstraints();

        const actions = [
            <RaisedButton
                key="cancel"
                className="raised-button-fourth"
                label={RS.getString('CANCEL')}
                onClick={this.props.handleCancel}
            />,
            <RaisedButton
                key="yes"
                label={RS.getString('SAVE')}
                primary={true}
                onClick={this.handleSave}
            />
        ];
        return (
            <Dialog
                isOpen={this.props.isOpen}
                actions={actions}
                title={this.props.title}
                modal={this.props.modal ? this.props.modal : false}
                handleClose={this.props.handleCancel}
                className="rejoin-dialog"
            >
                <div>
                    <div className="row rejoin">
                        <div className="col-md-12 col-xs-12 ">
                            <CommonDatePicker
                                title={RS.getString('REJOINED_DATE')}
                                required
                                constraint={editEmployeeConstraints.rejoinedDate}
                                ref={(input) => this.rejoinedDate = input}
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

TerminationDialog.propTypes = propTypes;

export default TerminationDialog;