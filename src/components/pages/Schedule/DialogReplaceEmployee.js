import React, { PropTypes } from 'react'
import Dialog from '../../elements/Dialog';
import { TIMEFORMAT, DATETIME, ERROR_SCHEDULE_STATUS, SCHEDULE_STATUS, REPLACE_OPTIONS } from '../../../core/common/constants';
import dateHelper, { days } from '../../../utils/dateHelper';
import * as apiHelper from '../../../utils/apiHelper';
import RaisedButton from '../../elements/RaisedButton';
import RadioButton from '../../elements/RadioButton';
import CommonDatePicker from '../../elements/DatePicker/CommonDatePicker';
import CommonSelect from '../../elements/CommonSelect.component';
import MyCheckBox from '../../elements/MyCheckBox';
import RS, { Option } from '../../../resources/resourceManager';

const propTypes = {
}

class DialogReplaceEmployee extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            replaceOption: REPLACE_OPTIONS.SELECTED_SHIFT_ONLY,
            replaceFrom: new Date(),
            replaceTo: new Date(),
            dateRangesSelected: []
        }

        this.handleOnChangeSelection = this.handleOnChangeSelection.bind(this);
        this.handleChangeCheckBox = this.handleChangeCheckBox.bind(this);
        this.handleSaveOrNotify = this.handleSaveOrNotify.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleOpenDialogAddEmployee = this.handleOpenDialogAddEmployee.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isOpen && nextProps.isOpen) {
            this.props.searchReplacementAvailability({
                groupIds: [nextProps.scheduleGroup.id],
                jobRoleId: nextProps.jobRole.id,
                from: nextProps.shift.startTime,
                to: nextProps.shift.endTime
            });
        }
        if (this.props.isOpen && !nextProps.isOpen) {
            this.state = {
                replaceOption: REPLACE_OPTIONS.SELECTED_SHIFT_ONLY,
                replaceFrom: new Date(),
                replaceTo: new Date(),
                dateRangesSelected: []
            }
        }
        if (!_.isEqual(this.props.replacement, nextProps.replacement)) {
            let isCheckOT = !!_.size(_.get(nextProps.replacement, 'employee.shifts', []));
            this.setState({
                isCheckOT: isCheckOT,
                replacement: nextProps.replacement
            });
        }
    }

    handleOnChangeReplaceOption(option) {
        this.setState({
            replaceOption: option
        });
        switch (option) {
            case REPLACE_OPTIONS.SELECTED_SHIFT_ONLY:
                this.props.searchReplacementAvailability({
                    groupIds: [this.props.scheduleGroup.id],
                    jobRoleId: this.props.jobRole.id,
                    from: this.props.shift.startTime,
                    to: this.props.shift.endTime
                });
                break;
            case REPLACE_OPTIONS.FOR_THE_PARTIAL_SHIFT:
                this.props.searchReplacementAvailability({
                    groupIds: [this.props.scheduleGroup.id],
                    jobRoleId: this.props.jobRole.id,
                    from: this.props.assignment.replacement.replaceFrom,
                    to: this.props.assignment.replacement.replaceTo
                });
                break;
            case REPLACE_OPTIONS.IN_DATE_RANGE:
            case REPLACE_OPTIONS.ALL:
                this.props.searchResourcePool({ groupId: this.props.scheduleGroup.id });
        }
    }

    handleOnChangeSelection(employee) {
        const employeeDto = _.cloneDeep(employee);
        delete employeeDto['shifts'];
        this.setState({
            isCheckOT: !!employee.shifts.length,
            replacement: _.assign({}, this.state.replacement, { employee: employeeDto })
        });
    }

    handleChangeCheckBox(isChecked) {
        this.setState({ isCheckOT: isChecked });
    }

    handleSaveOrNotify(action) {
        let replaceInfo = {
            replacementEmployeeId: this.state.replacement.employee.id,
            replaceOption: this.state.replaceOption,
            replaceFrom: this.state.replaceFrom,
            replaceTo: this.state.replaceTo,
            action: action,
            isOvertime: this.state.isCheckOT
        };
        this.setState({
            replaceOption: REPLACE_OPTIONS.SELECTED_SHIFT_ONLY,
            replacement: {},
            replaceFrom: new Date(),
            replaceTo: new Date(),
            isCheckOT: false
        });
        this.props.handleReplaceEmployee(replaceInfo);
        this.props.handleClose();
    }

    handleNext() {
        let replaceInfo = {
            replacementEmployeeId: this.state.replacement.employee.id,
            replaceOption: this.state.replaceOption,
            replaceFrom: this.state.replaceFrom,
            replaceTo: this.state.replaceTo,
            action: 'Notify',
            isOvertime: true
        };
        this.props.handleNext && this.props.handleNext([_.get(this.state, 'replacement.employee')], replaceInfo);
    }

    handleOpenDialogAddEmployee() {
        let replaceInfo = {
            replaceOption: this.state.replaceOption,
            replaceFrom: this.state.replaceFrom,
            replaceTo: this.state.replaceTo,
        };
        this.props.handleOpenDialogAddEmployee(replaceInfo);
    }

    render() {
        let { assignment } = this.props;

        if (_.isEmpty(assignment)) {
            return null;
        }

        const replacement = this.state.replacement;
        const defaultAvatar = require("../../../images/avatarDefault.png");
        const employeeOptions = _.map(this.props.employeesToAssign, item => {
            const employee = _.cloneDeep(item.employee);
            employee.shifts = item.shifts;
            return employee;
        });
        let timeOt = {};
        const { startTime, endTime } = this.props.shift;
        switch (this.state.replaceOption) {
            case REPLACE_OPTIONS.FOR_THE_PARTIAL_SHIFT: {
                timeOt = {
                    from: replacement ? dateHelper.formatTimeWithPattern(replacement.replaceFrom, TIMEFORMAT.OVERTIME) : '',
                    to: replacement ? dateHelper.formatTimeWithPattern(replacement.replaceTo, TIMEFORMAT.OVERTIME) : ''
                };
                break;
            }
            default: {
                timeOt = {
                    from: dateHelper.formatTimeWithPattern(startTime, TIMEFORMAT.END_START_TIME) + ' ' + dateHelper.formatTimeWithPattern(startTime, TIMEFORMAT.WITHOUT_SECONDS),
                    to: dateHelper.formatTimeWithPattern(endTime, TIMEFORMAT.END_START_TIME) + ' ' + dateHelper.formatTimeWithPattern(endTime, TIMEFORMAT.WITHOUT_SECONDS),
                };
            }
        }

        let isOvertime = this.createOTCheckbox && this.state.isCheckOT;

        let actions = [
            <RaisedButton
                key={0}
                className="raised-button-fourth"
                label={RS.getString('CANCEL', null, Option.CAPEACHWORD)}
                onClick={this.props.handleCancel}
            />,
            <RaisedButton
                key={1}
                className="raised-button-first-secondary"
                label={RS.getString('SAVE', null, Option.CAPEACHWORD)}
                onClick={this.handleSaveOrNotify.bind(this, 'Save')}
                disabled={isOvertime || !_.get(replacement, 'employee')}
            />,
            <RaisedButton
                key={2}
                label={RS.getString('NOTIFY', null, Option.CAPEACHWORD)}
                onClick={isOvertime ? this.handleNext : this.handleSaveOrNotify.bind(this, 'Notify')}
                disabled={!_.get(replacement, 'employee')}
            />
        ];

        return (
            <Dialog
                style={{ widthBody: '450px' }}
                isOpen={this.props.isOpen}
                title={this.props.title}
                actions={actions}
                handleClose={this.props.handleClose}
                className="dialog-replace-employee"
                modal
            >
                <div className="replace-employee-popover-content">
                    <div>
                        <RadioButton
                            title={RS.getString("REPLACE_THIS_SHIFT_ONLY")}
                            checked={this.state.replaceOption == REPLACE_OPTIONS.SELECTED_SHIFT_ONLY}
                            onChange={this.handleOnChangeReplaceOption.bind(this, REPLACE_OPTIONS.SELECTED_SHIFT_ONLY)}
                        />
                    </div>
                    {
                        assignment.error === ERROR_SCHEDULE_STATUS.LEAVE &&
                        <div>
                            <RadioButton
                                title={`${RS.getString("REPLACE_FOR_THE_PARTIAL_SHFIT_FROM")}
                                    ${dateHelper.formatTimeWithPattern(assignment.replacement.replaceFrom, TIMEFORMAT.WITHOUT_SECONDS)}
                                    ${RS.getString('TO', null, 'LOWER')
                                    }
                                ${dateHelper.formatTimeWithPattern(assignment.replacement.replaceTo, TIMEFORMAT.WITHOUT_SECONDS)}`}
                                checked={this.state.replaceOption == REPLACE_OPTIONS.FOR_THE_PARTIAL_SHIFT}
                                onChange={this.handleOnChangeReplaceOption.bind(this, REPLACE_OPTIONS.FOR_THE_PARTIAL_SHIFT)}
                            />
                        </div>
                    }
                    <div>
                        <RadioButton
                            title={RS.getString("REPLACE_FROM")}
                            checked={this.state.replaceOption == REPLACE_OPTIONS.IN_DATE_RANGE}
                            onChange={this.handleOnChangeReplaceOption.bind(this, REPLACE_OPTIONS.IN_DATE_RANGE)}
                        />
                        <CommonDatePicker
                            language={RS.getString('LANG_KEY')}
                            ref={(input) => this.dateA = input}
                            hintText="dd/mm/yyyy"
                            id="start-date"
                            defaultValue={this.state.replaceFrom}
                            onChange={(value) => this.setState({ replaceFrom: value })}
                            disabled={this.state.replaceOption != REPLACE_OPTIONS.IN_DATE_RANGE}
                        />
                        <span>{RS.getString("TO")}</span>
                        <CommonDatePicker
                            language={RS.getString('LANG_KEY')}
                            ref={(input) => this.dateB = input}
                            hintText="dd/mm/yyyy"
                            id="end-date"
                            defaultValue={this.state.replaceTo}
                            startDate={this.state.replaceFrom}
                            onChange={(value) => this.setState({ replaceTo: value })}
                            disabled={this.state.replaceOption != REPLACE_OPTIONS.IN_DATE_RANGE}
                        />
                    </div>
                    <div>
                        <RadioButton
                            title={RS.getString("REPLACE_ALL")}
                            checked={this.state.replaceOption == REPLACE_OPTIONS.ALL}
                            onChange={this.handleOnChangeReplaceOption.bind(this, REPLACE_OPTIONS.ALL)}
                        />
                    </div>
                    <div className="replacement">
                        <div className="employee-replacement-info">
                            <div className="avatar-content">
                                <img src={assignment.employee.photoUrl ? (API_FILE + assignment.employee.photoUrl) : defaultAvatar} />
                                <div className="cell-content">
                                    <div className="main-label">
                                        {assignment.employee.fullName}
                                    </div>
                                    <div className="sub-label">
                                        {assignment.employee.jobRole.name}
                                    </div>
                                </div>
                            </div>
                            <div className="line-through">
                                <div className="left-line" />
                                <div className="swap-icon"><i className="icon-swap-icon-2" /></div>
                                <div className="right-line" />
                            </div>
                            <div className="avatar-content">
                                <img src={replacement && replacement.employee ? (API_FILE + replacement.employee.photoUrl) : defaultAvatar} />
                            </div>
                            <div className="employee-selection">
                                <CommonSelect
                                    clearable={false}
                                    className="employee-common-select"
                                    placeholder={RS.getString('TYPE_TO_SEARCH_EMPLOYEE')}
                                    options={employeeOptions}
                                    value={_.get(this.state, 'replacement.employee')}
                                    propertyItem={{ label: 'fullName', value: 'id' }}
                                    onChange={this.handleOnChangeSelection}
                                />
                                {
                                    replacement && replacement.employee &&
                                    <div className="clear-button" >
                                        <a onClick={() => {
                                            this.setState({
                                                replacement: _.assign({}, this.state.replacement, { employee: null }),
                                                isCheckOT: false
                                            });
                                            //this.createOTCheckbox && this.createOTCheckbox.setValue(false);
                                        }
                                        }>{RS.getString('CLEAR')}</a>
                                    </div>
                                }
                            </div>
                            <div className="advanced-search">
                                <a onClick={this.handleOpenDialogAddEmployee}>{RS.getString('ADVANCED_SEARCH')}</a>
                            </div>
                        </div>
                    </div>
                    {
                        (this.state.replaceOption == REPLACE_OPTIONS.SELECTED_SHIFT_ONLY
                            || this.state.replaceOption == REPLACE_OPTIONS.FOR_THE_PARTIAL_SHIFT) &&
                        <div>
                            <MyCheckBox
                                ref={(input) => { this.createOTCheckbox = input; }}
                                defaultValue={this.state.isCheckOT}
                                onChange={this.handleChangeCheckBox}
                                label={RS.getString('CREATE_OVERTIME_REQUEST')}
                                disabled={!_.get(replacement, 'employee')}
                            />
                        </div>
                    }
                </div>
            </Dialog>
        )
    }
}

DialogReplaceEmployee.propTypes = propTypes;

export default DialogReplaceEmployee;
