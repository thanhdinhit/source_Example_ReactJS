import React, { PropTypes } from 'react';
import _ from 'lodash';
import Dialog from '../../../elements/Dialog';
import RaisedButton from '../../../elements/RaisedButton';
import CommonSelect from '../../../elements/CommonSelect.component';
import AddEditLocationShift from './AddEditLocationShift';
import RS, { Option } from '../../../../resources/resourceManager';
import { SHIFT_MODE, defaultColor } from '../../../../core/common/constants';

const propTypes = {
}

class DialogAddLocationShifts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            shifts: []
        }

        this.shiftRefs = [];

        this.validate = this.validate.bind(this);
        this.handleChangeShiftTemplate = this.handleChangeShiftTemplate.bind(this);
        this.handleAddShift = this.handleAddShift.bind(this);
        this.handleDeleteShift = this.handleDeleteShift.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeShiftData = this.handleChangeShiftData.bind(this);
        this.renderContentAddLocationShift = this.renderContentAddLocationShift.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(!this.props.isOpen && nextProps.isOpen){
            this.setState({ shifts : [] }, this.handleAddShift);
        }
    }

    validate() {
        let isValid = true;
        this.shiftRefs = _.filter(this.shiftRefs, (item) => !!item);
        _.forEach(this.shiftRefs, (ref) => {
            if (ref && !ref.validate(true)) {
                isValid = false;
            }
        });
        return isValid;
    }

    handleChangeShiftTemplate(value) {
        let shifts = [];
        if (value) {
            shifts = _.map(value.shiftTimes, (time, index) => {
                return {
                    ...time,
                    requires: [],
                    weekday: this.props.weekday,
                    timestamp: `${new Date().getTime()}-${index}`
                };
            });
            this.shiftRefs = [];
        }

        this.setState({ selectedShiftTemplate: value, shifts, enableOkButton: false });
    }

    handleAddShift() {
        let shift = {
            color: defaultColor,
            requires: [],
            weekday: this.props.weekday,
            timestamp: `${new Date().getTime()}-${this.state.shifts.length}`
        };
        let shifts = [...this.state.shifts, shift];
        this.setState({ shifts, enableOkButton: false });
    }

    handleDeleteShift(index) {
        let shifts = _.cloneDeep(this.state.shifts);
        shifts.splice(index, 1);
        this.setState({ shifts }, () => {
            this.handleChangeShiftData();
        });
    }

    handleSubmit() {
        if (!this.validate()) {
            return;
        }
        let shifts = _.map(this.shiftRefs, (ref) => {
            return ref.getValue();
        });
        this.props.handleAddShifts(this.props.weekday, shifts);
        this.props.handleClose();
    }

    handleChangeShiftData() {
        let hasShift = false, isValid = true;

        _.forEach(this.shiftRefs, (ref) => {
            if (ref) {
                hasShift = true;
                isValid = isValid && ref.validate();
            }
        });

        this.setState({ enableOkButton: (hasShift && isValid) });
    }

    renderContentAddLocationShift() {
        return (
            <div>
                <CommonSelect
                    title={RS.getString('SHIFT_TEMPLATE')}
                    placeholder={RS.getString('SELECT_SHIFT_TEMPLATE')}
                    clearable={false}
                    searchable={false}
                    propertyItem={{ label: 'name', value: 'id' }}
                    options={this.props.shiftTemplates}
                    name="shiftTemplate"
                    value={this.state.selectedShiftTemplate}
                    onChange={this.handleChangeShiftTemplate}
                    ref={(input) => this.shiftTemplate = input}
                />
                <div className="title shifts-list-title">{RS.getString('SHIFT')}</div>
                <div className="shifts-list">
                {
                    _.map(this.state.shifts, (shift, index) => {
                        return (
                            <AddEditLocationShift
                                key={shift.timestamp}
                                shift={shift}
                                index={index}
                                mode={SHIFT_MODE.NEW_SHIFT}
                                jobRoles={this.props.jobRoles}
                                handleDeleteShift={this.handleDeleteShift}
                                handleChangeShiftData={this.handleChangeShiftData}
                                isValidatePastShift={this.props.isValidatePastShift}
                                ref={(input) => this.shiftRefs[index] = input}
                            />
                        );
                    })
                }
                </div>
                <div className="add-more-shift" onClick={this.handleAddShift}><span>{`+ ${RS.getString('ADD_MORE_SHIFT')}`}</span></div>
            </div>
        );
    }

    render() {
        return (
            <Dialog
                style={{ widthBody: '770px' }}
                className="dialog-add-location-shift"
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
                        disabled={!this.state.enableOkButton}
                        label={RS.getString('OK')}
                        onClick={this.handleSubmit}
                    />
                ]}
                handleClose={this.props.handleClose}
                modal
            >
                <div>
                    {this.renderContentAddLocationShift()}
                </div>
            </Dialog>
        )

    }

}

DialogAddLocationShifts.propTypes = propTypes;

export default DialogAddLocationShifts;
