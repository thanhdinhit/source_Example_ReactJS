import React, { PropTypes } from 'react';
import Dialog from '../../../elements/Dialog';
import RaisedButton from '../../../../components/elements/RaisedButton';
import MyCheckBox from '../../../elements/MyCheckBox';
import RS from '../../../../resources/resourceManager';
import debounceHelper from '../../../../utils/debounceHelper';
import { WAITING_TIME, SHIFT_MODE } from '../../../../core/common/constants';
import CommonTextField from '../../../elements/TextField/CommonTextField.component'
import FlexibleShift from './FlexibleShift';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import RadioButton from '../../../elements/RadioButton';
import NumberInput from '../../../elements/NumberInput';
import _ from 'lodash';
import { defaultColor } from '../../../../core/common/constants';

class DialogAddFlexibleShift extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shifts: [],
            enableOkButton: false
        };
        this.flexibleShifts = [];
        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleAddMoreShift = this.handleAddMoreShift.bind(this);
        this.handleRemoveShift = this.handleRemoveShift.bind(this);
        this.handleUpdateShift = this.handleUpdateShift.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    
    componentWillReceiveProps(nextProps) {
        if (this.props.isOpen != nextProps.isOpen) {
            this.setState({ shifts: [], enableOkButton: false });
        }
    }

    handleSave() {
        let shifts = [];
        _.forEach(this.flexibleShifts, (shift, index) => {
            if (shift) {
                shifts.push(shift.getValue());
            }
        });
        this.props.handleSave && this.props.handleSave(shifts);
        this.handleClose();
    }

    handleClose() {
        this.props.handleClose && this.props.handleClose();
    }

    handleAddMoreShift() {
        let newShift = {
            startTime: new Date(),
            endTime: new Date(),
            regularHours: 0,
            color: defaultColor,
            requires: [],
            timestamp: new Date().getTime()
        }
        this.setState({
            shifts: [...this.state.shifts, ...[newShift]],
            enableOkButton: false
        })
    }

    handleUpdateShift(index) {

    }

    handleRemoveShift(index) {
        this.state.shifts.splice(index, 1);
        this.setState({ shifts: this.state.shifts }, this.handleOnChange);
    }

    handleOnChange() {
        let canAdd = true, hasFlexible = false;

        _.forEach(this.flexibleShifts, shift => {
            if (shift) {
                hasFlexible = true;
                canAdd = shift.validate()
            }
        })

        this.setState({ enableOkButton: (hasFlexible  && canAdd ) });
    }

    render() {
        const actions = [
            <RaisedButton
                key={0}
                label={RS.getString('OK')}
                onClick={this.handleSave}
                disabled={!this.state.enableOkButton}
            />,
            <RaisedButton
                key={1}
                className="raised-button-fourth"
                label={RS.getString('CANCEL')}
                onClick={this.handleClose}
            />
        ];

        return (
            <Dialog
                style={{ widthBody: '770px' }}
                isOpen={this.props.isOpen}
                className="dialog-add-flexible-shift"
                title={this.props.title}
                actions={actions}
                modal={this.props.modal ? this.props.modal : false}
                handleClose={this.handleClose}
            >
                <div className="add-flexible-shift">
                    <span>{RS.getString('FLEXIBLE_SHIFT')}</span>
                    <div className="flexible-shifts">
                        {
                            _.map(this.state.shifts, (shift, index) => {
                                return (
                                    <FlexibleShift
                                        ref={(shift) => this.flexibleShifts[index] = shift}
                                        jobRoles={this.props.jobRoles}
                                        shift={shift}
                                        key={shift.timestamp}
                                        handleRemove={this.handleRemoveShift.bind(this, index)}
                                        onChange={this.handleOnChange}
                                        mode={this.props.mode}
                                    />
                                )
                            })
                        }
                    </div>
                    <div className="add-more-shift" onClick={() => this.handleAddMoreShift()}>
                        <span>{`+ ${RS.getString('ADD_MORE_SHIFT')}`}</span>
                    </div>
                </div>
            </Dialog>
        );
    }
};

export default DialogAddFlexibleShift;