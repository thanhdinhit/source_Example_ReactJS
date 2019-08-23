import React, { PropTypes } from 'react';
import _ from 'lodash';
import MyCheckBox from '../../../elements/MyCheckBox';
import CommonTimePicker from '../../../elements/DatePicker/CommonTimePicker';
import MyColorPicker from '../../../elements/MyColorPicker';
import NumberInput from '../../../elements/NumberInput';
import RS, { Option } from '../../../../resources/resourceManager';
import dateHelper from '../../../../utils/dateHelper';
import { TIMEFORMAT, SHIFT_MODE, MAX_ASSIGN_EMPLOYEE } from '../../../../core/common/constants';
import { getContractConstraints } from '../../../../validation/contractConstraints';
import Constraints from '../../../../validation/common.constraints';
import moment from 'moment';

const propTypes = {
}

class AddEditLocationShift extends React.Component {
    constructor(props) {
        super(props);

        let mode = props.mode;
        if (props.isValidatePastShift && props.shift.startTime && props.shift.weekday) {
            let startTime = new Date(props.shift.startTime);
            startTime.setFullYear(props.shift.weekday.getFullYear());
            startTime.setMonth(props.shift.weekday.getMonth());
            startTime.setDate(props.shift.weekday.getDate());
            if (startTime.getTime() < new Date().getTime()) {
                mode = SHIFT_MODE.NEW_SHIFT;
            }
        }

        this.state = {
            shift: props.shift,
            unmodifiedShift: props.shift,
            mode: mode,
            requireBreakTime: !!props.shift.breakTimeFrom && !!props.shift.breakTimeTo,
            breakTimeFromErrorText: '',
            breakTimeToErrorText: ''
        }

        this.requireEmployees = [];

        this.validate = this.validate.bind(this);
        this.validateBreakTime = this.validateBreakTime.bind(this);
        this.handleOnChangeColor = this.handleOnChangeColor.bind(this);
        this.handleBreakTimeChange = this.handleBreakTimeChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    validate() {
        let isValid = true;
        if (this.state.mode != SHIFT_MODE.VIEW_SHIFT) {
            const formToValidates = ['startTime', 'endTime'];
            _.forEach(formToValidates, form => {
                if (!this[form].validate()) {
                    isValid = false;
                }
            });
            let shift = _.cloneDeep(this.state.shift);
            shift.startTime = this.startTime.getValue();
            shift.endTime = this.endTime.getValue();
            shift.breakTimeFrom = this.breakTimeFrom.getValue();
            shift.breakTimeTo = this.breakTimeTo.getValue();
            shift = this.updateShiftTime(shift);
            isValid = isValid && this.validateBreakTime(null, shift);
        }
        let hasRequireValue = !!_.find(this.requireEmployees, (require) => {
            let value = require.ref.getValue();
            return value && (parseInt(value) > 0);
        });
        isValid = isValid && hasRequireValue;
        return isValid;
    }

    validateBreakTime(field, shift) {
        let outer = shift.startTime && shift.endTime ? { from: shift.startTimeString, to: shift.endTimeString } : null;
        let inner = shift.breakTimeFrom && shift.breakTimeTo ? { from: shift.breakTimeFromString, to: shift.breakTimeToString } : null;
        let time = shift[field];
        let timeString = shift[field + 'String'];

        if (this.state.requireBreakTime) {
            let isValid = true;
            _.each(['breakTimeFrom', 'breakTimeTo'], (key) => {
                if (!this[key].validate()) {
                    isValid = false;
                }
            });
            if (!isValid) {
                return isValid;
            }
        }

        field = shift.breakTimeFrom ? 'breakTimeFrom' : shift.breakTimeTo ? 'breakTimeTo' : null;
        time = shift[field];
        timeString = shift[field + 'String'];

        if (outer && inner) {
            if (!dateHelper.isDurationInsideRange(outer, inner)) {
                this.setState({
                    breakTimeFromErrorText: RS.getString("E144"),
                    breakTimeToErrorText: RS.getString("E144")
                });
                return false;
            } else {
                this.setState({
                    breakTimeFromErrorText: '',
                    breakTimeToErrorText: ''
                });
            }
        } else if (outer && time) {
            if (!dateHelper.isTimeInsideRange(outer, timeString)) {
                this.setState({
                    [field + 'ErrorText']: RS.getString("E144")
                });
                return false;
            } else {
                this.setState({
                    [field + 'ErrorText']: ''
                });
            }
        }

        return true;
    }

    getMode() {
        return this.state.mode;
    }

    getValue() {
        let shift = _.cloneDeep(this.state.shift);
        if (this.state.mode != SHIFT_MODE.VIEW_SHIFT) {
            shift.startTime = this.startTime.getValue();
            shift.endTime = this.endTime.getValue();
            shift.breakTimeFrom = this.breakTimeFrom.getValue();
            shift.breakTimeTo = this.breakTimeTo.getValue();
            shift = this.updateShiftTime(shift);
        }

        let requires = [];
        _.forEach(this.requireEmployees, require => {
            const value = require.ref.getValue();
            let oldRequire = shift.requires.length ? shift.requires.find(x => x.jobRole.id == require.id) : {}

            if (value && parseInt(value)) {
                requires.push(_.assign(oldRequire, {
                    jobRole: {
                        id: require.id,
                        name: require.name
                    },
                    number: parseInt(value)
                }));
            }
        });
        shift.requires = requires;
        return shift;
    }

    updateShiftTime(shift) {
        let newShift = _.cloneDeep(shift);
        newShift.startTimeString = dateHelper.formatTimeWithPattern(newShift.startTime, TIMEFORMAT.WITHOUT_SECONDS);
        newShift.endTimeString = dateHelper.formatTimeWithPattern(newShift.endTime, TIMEFORMAT.WITHOUT_SECONDS);
        if (newShift.breakTimeFrom) {
            newShift.breakTimeFromString = dateHelper.formatTimeWithPattern(newShift.breakTimeFrom, TIMEFORMAT.WITHOUT_SECONDS);
        } else {
            newShift.breakTimeFromString = null;
        }
        if (newShift.breakTimeTo) {
            newShift.breakTimeToString = dateHelper.formatTimeWithPattern(newShift.breakTimeTo, TIMEFORMAT.WITHOUT_SECONDS);
        } else {
            newShift.breakTimeToString = null;
        }

        let workingTime = dateHelper.subtractTime(newShift.startTimeString, newShift.endTimeString);
        let breakTime = null;
        if (this.validateBreakTime(null, newShift)) {
            breakTime = dateHelper.subtractTime(newShift.breakTimeFromString, newShift.breakTimeToString);
        }
        newShift.regularHours = workingTime - (breakTime ? breakTime : 0);
        newShift.regularHours = _.isNaN(newShift.regularHours) ? 0 : newShift.regularHours.toFixed(2);
        return newShift;
    }

    handleBreakTimeChange(checked) {
        let shift = _.cloneDeep(this.state.shift);
        if (!checked) {
            shift.breakTimeFrom = null;
            shift.breakTimeTo = null;

        } else {
            shift.breakTimeFrom = this.breakTimeFrom.getValue();
            shift.breakTimeTo = this.breakTimeTo.getValue();
        }
        shift = this.updateShiftTime(shift);
        this.setState({ shift, requireBreakTime: checked }, () => {
            this.breakTimeFrom.validate();
            this.breakTimeTo.validate();
            this.props.handleChangeShiftData && this.props.handleChangeShiftData();
        });
    }

    handleOnChangeColor(value) {
        let shift = _.cloneDeep(this.state.shift);
        shift.color = value.hex;
        this.setState({ shift });
    }

    handleOnBlurTime(field, value) {
        let shift = _.cloneDeep(this.state.shift);

        let newValue = value;
        if (value && shift.weekday instanceof Date) {
            newValue = new Date(value);
            newValue.setFullYear(shift.weekday.getFullYear());
            newValue.setMonth(shift.weekday.getMonth());
            newValue.setDate(shift.weekday.getDate());
        }
        shift[field] = newValue;

        shift = this.updateShiftTime(shift);

        this.validateBreakTime(field, shift);

        this.setState({ shift });
    }

    handleDelete() {
        this.props.handleDeleteShift(this.props.index);
        this.props.handleChangeShiftData && this.props.handleChangeShiftData();
    }

    renderJobRoles() {
        return _.map(this.props.jobRoles, (role, index) => {
            const roleFound = _.find(this.state.shift.requires, (item) => item.jobRole.id == role.id);
            this.requireEmployees[index] = { id: role.id, name: role.name };
            return (
                <div key={index} className="job-role">
                    <span>{role.name}</span>
                    <div>
                        <NumberInput
                            value={_.get(roleFound, 'number', 0)}
                            ref={(input) => this.requireEmployees[index].ref = input}
                            disableAddon
                            min={0}
                            max={MAX_ASSIGN_EMPLOYEE}
                            integerOnly
                            onChange={this.props.handleChangeShiftData}
                        />
                    </div>
                </div>
            );
        });
    }

    render() {
        let shift = this.state.shift;
        let constraint = getContractConstraints();
        let startTimeConstraint = constraint.shiftStartTime;
        let today = new Date();
        let isValidatePastShift = this.props.isValidatePastShift && shift.startTime && (moment(shift.startTime).isSame(today, 'date'));
        if (isValidatePastShift) {
            startTimeConstraint = Object.assign({}, startTimeConstraint, Constraints.isValidTime(new Date()));
        }
        return (
            <div className="shift-details">
                <div className={'shift-info edit-mode'}>
                    <div className="shift-time">
                        <div>
                            <div>
                                <MyColorPicker
                                    myColor={this.state.shift.color}
                                    onChange={this.handleOnChangeColor}
                                />
                                <span>{RS.getString("WORKING_TIME")}</span>
                            </div>
                            <div>
                                <CommonTimePicker
                                    defaultValue={shift.startTime}
                                    constraint={startTimeConstraint}
                                    onBlur={this.handleOnBlurTime.bind(this, 'startTime')}
                                    ref={(input) => { this.startTime = input; isValidatePastShift && input && input.setValue(shift.startTime, () => input.validate()); }}
                                />
                                <span className="separate">-</span>
                                <CommonTimePicker
                                    defaultValue={shift.endTime}
                                    constraint={constraint.shiftEndTime}
                                    onBlur={this.handleOnBlurTime.bind(this, 'endTime')}
                                    ref={(input) => this.endTime = input}
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <MyCheckBox
                                    label={RS.getString("BREAK_TIME")}
                                    defaultValue={this.state.requireBreakTime}
                                    onChange={this.handleBreakTimeChange}
                                />
                            </div>
                            <div>
                                <CommonTimePicker
                                    disabled={!this.state.requireBreakTime}
                                    defaultValue={shift.breakTimeFrom}
                                    constraint={this.state.requireBreakTime ? constraint.shiftBreakTimeFrom : null}
                                    errorText={this.state.breakTimeFromErrorText}
                                    onBlur={this.handleOnBlurTime.bind(this, 'breakTimeFrom')}
                                    ref={(input) => this.breakTimeFrom = input}
                                />
                                <span className="separate">-</span>
                                <CommonTimePicker
                                    disabled={!this.state.requireBreakTime}
                                    defaultValue={shift.breakTimeTo}
                                    constraint={this.state.requireBreakTime ? constraint.shiftBreakTimeTo : null}
                                    errorText={this.state.breakTimeToErrorText}
                                    onBlur={this.handleOnBlurTime.bind(this, 'breakTimeTo')}
                                    ref={(input) => this.breakTimeTo = input}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="shift-actions pull-right">
                        <div>
                            <div className="field-title">{RS.getString("REGULAR_HOURS")}</div>
                            <div className="field-value">{shift.regularHours}</div>
                            <i className="fa fa-trash" data-toggle="tooltip"
                                onClick={this.handleDelete}></i>
                        </div>
                    </div>
                </div>
                <div className="job-roles" key="job-roles">
                    <div className="roles">
                        <span>{RS.getString('ROLES')}</span>
                    </div>
                    <div>
                        {
                            this.renderJobRoles()
                        }
                    </div>
                    <br style={{ clear: "both" }} />
                </div>
            </div>
        )

    }

}

AddEditLocationShift.propTypes = propTypes;

export default AddEditLocationShift;
