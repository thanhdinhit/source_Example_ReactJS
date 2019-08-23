import React from 'react';
import _ from 'lodash';
import Dialog from '../../../elements/Dialog';
import RS from '../../../../resources/resourceManager';
import DateHelper from '../../../../utils/dateHelper';
import { FLOAT_POINT_ROUNDING } from '../../../../core/common/config';
import { TIMEFORMAT, SHIFT_MODE, MAX_ASSIGN_EMPLOYEE } from '../../../../core/common/constants';
import CommonTextField from '../../../elements/TextField/CommonTextField.component'
import NumberInput from '../../../elements/NumberInput';
import CommonSelect from '../../../elements/CommonSelect.component';
import CommonTimePicker from '../../../elements/DatePicker/CommonTimePicker';
import MyColorPicker from '../../../elements/MyColorPicker';
import constraints from '../../../../validation/common.constraints';

class FlexibleShift extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shift: null,
            hours: 0,
            mode: SHIFT_MODE.NEW_SHIFT
        }
        this.DATETIME_TYPE = {
            START_TIME: 'start_time',
            END_TIME: 'end_time',
        }
        this.previoursState = null;
        this.requireEmployees = [];
        this.renderJobRoles = this.renderJobRoles.bind(this);
        this.renderOption = this.renderOption.bind(this);
        this.handleRemoveShift = this.handleRemoveShift.bind(this);
        this.handleOnBlurDateTime = this.handleOnBlurDateTime.bind(this);
        this.getValue = this.getValue.bind(this);
        this.validate = this.validate.bind(this);
        this.onChangeRegularHour = this.onChangeRegularHour.bind(this)
    }

    componentDidMount() {
        let hours = DateHelper.subtractTime(this.props.shift.endTime, this.props.shift.startTime)
            .toFixed(FLOAT_POINT_ROUNDING.REGULAR_HOURS);
        this.setState({ shift: this.props.shift, mode: this.props.mode, hours });
        this.previoursState = { hours, shift: this.props.shift }
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.shift, nextProps.shift)) {
            let hours = DateHelper.subtractTime(this.props.shift.endTime, this.props.shift.startTime).toFixed(FLOAT_POINT_ROUNDING.REGULAR_HOURS);
            this.setState({
                shift: nextProps.shift,
                hours
            });
            this.previoursState = { hours, shift: nextProps.shift }
        }
        if (this.props.mode != nextProps.mode) {
            this.setState({ mode: nextProps.mode });
        }
    }

    renderJobRoles() {
        if (_.isEmpty(this.props.jobRoles)) {
            return;
        }
        return _.map(this.props.jobRoles, (role, index) => {
            const roleFound = _.find(this.state.shift.requires, (item) => {
                if (item.jobRole) {
                    return item.jobRole.id == role.id;
                }
            });
            this.requireEmployees[index] = { id: role.id, name: role.name };
            return (
                <div key={index} className="job-role">
                    <span>{role.name}</span>
                    <div>
                        <NumberInput
                            value={_.get(roleFound, 'number', 0)}
                            ref={(input) => this.requireEmployees[index] = input}
                            disableAddon
                            min={0}
                            max={MAX_ASSIGN_EMPLOYEE}
                            integerOnly
                            onChange={this.props.onChange}
                        />
                    </div>
                </div>
            );
        });
    }

    handleOnBlurDateTime() {
        if (this.startTime.getValue() && this.endTime.getValue()) {
            this.setState({
                hours: DateHelper.subtractTime(
                    this.startTime.getValue(), this.endTime.getValue()
                ).toFixed(FLOAT_POINT_ROUNDING.REGULAR_HOURS)
            });
        }
        this.props.onChange && this.props.onChange();
    }

    renderOption(option) {
        return (
            <div className="template-color" style={{ "backgroundColor": option.color }} />
        );
    }

    handleRemoveShift() {
        this.props.handleRemove && this.props.handleRemove();
    }

    validate() {
        let fields = ['startTime', 'endTime', 'regularHours'];
        let isValid = true;

        _.forEach(fields, field => {
            if (!this[field].validate()) {
                isValid = false;
            }
        })

        let hasRequireValue = !!_.find(this.requireEmployees, (require) => {
            let value = require.getValue();
            return value && (parseInt(value) > 0);
        });

        return isValid && hasRequireValue;
    }
    onChangeRegularHour(e, value) {
        this.setState({ shift: _.assign({}, this.state.shift, { regularHours: value }) },
            () => { this.props.onChange && this.props.onChange() })
    }

    getValue() {
        let shift = _.cloneDeep(this.state.shift);

        shift.startTime = this.startTime.getValue();
        shift.endTime = this.endTime.getValue();
        shift.startTimeString = DateHelper.formatTimeWithPattern(shift.startTime, TIMEFORMAT.WITHOUT_SECONDS);
        shift.endTimeString = DateHelper.formatTimeWithPattern(shift.endTime, TIMEFORMAT.WITHOUT_SECONDS);

        let requires = [];
        _.forEach(this.requireEmployees, (require, index) => {
            if (require.getValue() != 0) {
                requires.push({
                    jobRole: this.props.jobRoles[index],
                    number: require.getValue()
                })
            }
        });
        shift.requires = requires;

        return shift;
    }

    render() {
        if (!this.state.shift) {
            return null;
        }
        let regularHoursConstraint = _.assign({}, constraints.required, constraints.minmax(0, parseFloat(this.state.hours)));

        return (
            <div className="flexible-shift">
                <div className="working-time-actions" key="working-time-action">
                    <div className="working-time-info">
                        <div className="template-color options">
                            <MyColorPicker
                                ref={input => this.color = input}
                                myColor={this.state.shift.color}
                                onChange={(color) => {
                                    this.setState({ shift: _.assign({}, this.state.shift, { color: color.hex }) })
                                }}
                            />
                        </div>

                        <div className="info">
                            <span>{RS.getString('WORKING_TIME')}</span>
                            <CommonTimePicker
                                defaultValue={this.state.shift.startTime}
                                ref={(timePicker) => this.startTime = timePicker}
                                constraint={constraints.required}
                                onBlur={() => {
                                    this.handleOnBlurDateTime();
                                    this.setState({ shift: _.assign({}, this.state.shift, { startTime: this.startTime.getValue() }) })
                                }}
                            />
                            <span className="separate">-</span>
                            <CommonTimePicker
                                defaultValue={this.state.shift.endTime}
                                ref={(timePicker) => this.endTime = timePicker}
                                constraint={constraints.required}
                                onBlur={() => {
                                    this.handleOnBlurDateTime();
                                    this.setState({ shift: _.assign({}, this.state.shift, { endTime: this.endTime.getValue() }) })
                                }}
                            />
                        </div>
                    </div>

                    <div className="regular-hours-actions">
                        <span>{RS.getString('REGULAR_HOURS')}</span>
                        <CommonTextField
                            type="number"
                            className="regular-hours-input"
                            ref={(input) => this.regularHours = input}
                            defaultValue={this.state.shift.regularHours}
                            onChange={this.onChangeRegularHour}
                            constraint={regularHoursConstraint}
                        />
                        <span>{`/${this.state.hours}${RS.getString('H')}`}</span>
                        <i
                            className="fa fa-trash-o"
                            aria-hidden="true"
                            data-toggle="tooltip"
                            title={RS.getString('P126')}
                            onClick={() => { this.handleRemoveShift() }}
                        />
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

FlexibleShift.defaultProps = {
    mode: SHIFT_MODE.NEW_SHIFT
}

export default FlexibleShift;