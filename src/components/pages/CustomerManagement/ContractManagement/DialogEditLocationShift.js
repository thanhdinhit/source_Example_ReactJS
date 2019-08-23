import React, { PropTypes } from 'react';
import _ from 'lodash';
import Dialog from '../../../elements/Dialog';
import RaisedButton from '../../../elements/RaisedButton';
import MyCheckBox from '../../../elements/MyCheckBox';
import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import CommonSelect from '../../../elements/CommonSelect.component';
import AddEditLocationShift from './AddEditLocationShift';
import FlexibleShift from './FlexibleShift';
import RS, { Option } from '../../../../resources/resourceManager';
import { SHIFT_MODE } from '../../../../core/common/constants';

const propTypes = {
}

class DialogAddLocationShifts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderContentEditLocationShift = this.renderContentEditLocationShift.bind(this);
        this.renderContentEditFlexibleShift = this.renderContentEditFlexibleShift.bind(this);
    }

    handleSubmit() {
        if (!this.shift.validate()) {
            return;
        }
        let shift = this.shift.getValue();
        this.props.handleSubmit && this.props.handleSubmit(shift);
        this.props.handleClose();
    }

    renderContentEditLocationShift() {
        return (
            <div className="shifts-list">
                <AddEditLocationShift
                    shift={this.props.shift}
                    mode={SHIFT_MODE.EDIT_SHIFT}
                    jobRoles={this.props.jobRoles}
                    ref={(input) => this.shift = input}
                />
            </div>
        );
    }

    renderContentEditFlexibleShift() {
        return (
            <div className="add-flexible-shift">
                <div className="flexible-shifts">
                    <FlexibleShift
                        shift={this.props.shift}
                        mode={SHIFT_MODE.EDIT_SHIFT}
                        jobRoles={this.props.jobRoles}
                        ref={(input) => this.shift = input}
                    />
                </div>
            </div>
        );
    }

    render() {
        return (
            <Dialog
                style={{ widthBody: '770px' }}
                className={(this.props.className || '') + ' edit-shift'}
                isOpen={this.props.isOpen}
                title={this.props.title}
                actions={[
                    <RaisedButton
                        key={1}
                        className="raised-button-fourth"
                        label={RS.getString('CANCEL')}
                        onClick={() => { this.props.handleClose(); }}
                    />,
                    <RaisedButton
                        key={0}
                        label={RS.getString('OK')}
                        onClick={this.handleSubmit}
                    />
                ]}
                handleClose={this.props.handleClose}
                modal
            >
                {this.props.isFlexible ? this.renderContentEditFlexibleShift() : this.renderContentEditLocationShift()}
            </Dialog>
        )

    }

}

DialogAddLocationShifts.propTypes = propTypes;

export default DialogAddLocationShifts;
