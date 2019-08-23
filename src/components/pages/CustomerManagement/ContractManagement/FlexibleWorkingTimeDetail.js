import React, { PropTypes } from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import Overlay from 'react-bootstrap/lib/Overlay';
import moment from 'moment';

import RS, { Option } from '../../../../resources/resourceManager';
import fieldValidations from '../../../../validation/common.field.validation';
import CommonDatePicker from '../../../elements/DatePicker/CommonDatePicker';
import CommonSelect from '../../../elements/CommonSelect.component';
import DialogAddFlexibleShift from './DialogAddFlexibleShift';
import DialogEditLocationShift from './DialogEditLocationShift';
import DateHelper from '../../../../utils/dateHelper';
import { DATE, WEEKDAYS, SHIFT_MODE, TIMEFORMAT } from '../../../../core/common/constants';

import CellShifts from './CellShifts';
import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import DialogConfirm from '../../../elements/DialogConfirm';
import DialogCopyDayToDays from '../../Schedule/DialogCopyDayToDays'
import { MAX_LENGTH_INPUT } from '../../../../core/common/config';

const propTypes = {
    flexibleWorkingTime: PropTypes.object,
    shiftTemplate: PropTypes.object,
    jobRoles: PropTypes.array,
    scheduleTemplate: PropTypes.object,
    handleDeleteFlexibleWorkingTime: PropTypes.func,
    contractTime: PropTypes.object,
    viewMode: PropTypes.bool,
    groups: PropTypes.array,
    isEdit: PropTypes.bool,
    handleUpdateFlexibleWorkingTime: PropTypes.func,
    handleCopyFlexibleWorkingTime: PropTypes.func
};
class FlexibleWorkingTimeDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            flexibleWorkingTime: {},
            isOpenAddShift: false,
            showEditHistory: null,
            isOpenConfirmDeleteShift: false,
            isOpenCopyDialog: false
        };

        this.shiftBlockTargets = [];
        this.requireEmployees = [];
        this.weekdaySelected = null;
        this.shiftSelected = null;
        this.renderFlexibleWorkingTime = this.renderFlexibleWorkingTime.bind(this);
        this.handleUpdateFlexibleWorkingTime = this.handleUpdateFlexibleWorkingTime.bind(this);
        this.handleAddFlexibleShift = this.handleAddFlexibleShift.bind(this);
        this.handleOnBlurDateTime = this.handleOnBlurDateTime.bind(this);
        this.handleAddShift = this.handleAddShift.bind(this);
        this.validate = this.validate.bind(this);
        this.handleDeleteShift = this.handleDeleteShift.bind(this);
        this.handleOpenDialogDeleteShift = this.handleOpenDialogDeleteShift.bind(this);
        this.handleOpenDialogEditShift = this.handleOpenDialogEditShift.bind(this);
        this.handleEditShift = this.handleEditShift.bind(this);
        this.handleSubmitCopy = this.handleSubmitCopy.bind(this);
    }

    componentDidMount() {
        let { startDate, endDate, group } = this.props.flexibleWorkingTime;
        startDate = startDate || this.props.contractTime.startDate;
        endDate = endDate || this.props.contractTime.endDate;
        group = group || this.props.group;

        this.setState({
            flexibleWorkingTime: _.cloneDeep(this.props.flexibleWorkingTime),
            startDate,
            endDate,
            group
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.flexibleWorkingTime, nextProps.flexibleWorkingTime)) {
            this.setState({
                flexibleWorkingTime: _.cloneDeep(nextProps.flexibleWorkingTime),
                group: nextProps.flexibleWorkingTime.group || nextProps.group
            });
        }
        if (_.isEmpty(nextProps.flexibleWorkingTime.group)) {
            this.groupSubs.setValue(nextProps.locationGroupSubs[0]);
        }
    }

    getValue() {
        let flexibleWorkingTime = _.cloneDeep(this.state.flexibleWorkingTime);
        flexibleWorkingTime.name = _.clone(this.identifier.getValue());
        flexibleWorkingTime.startDate = _.cloneDeep(this.state.startDate);
        flexibleWorkingTime.endDate = _.cloneDeep(this.state.endDate);

        let group = _.cloneDeep(this.groupSubs.getValue());
        delete group.label;
        delete group.value;
        delete group.supervisor;
        flexibleWorkingTime.group = group;

        _.forEach(flexibleWorkingTime.shifts, shift => {
            delete shift.index;
        })

        return flexibleWorkingTime;
    }

    validate() {
        let isValid = true;
        _.forEach(['startDate', 'endDate', 'identifier'], field => {
            if (!this[field].validate()) {
                isValid = false;
            }
        });
        return isValid;
    }

    handleDeleteFlexibleWorkingTime() {
        this.props.handleDeleteFlexibleWorkingTime();
    }

    handleUpdateFlexibleWorkingTime() {
        this.props.handleUpdateFlexibleWorkingTime && this.props.handleUpdateFlexibleWorkingTime(this.getValue());
    }

    handleAddShift(weekday) {
        this.setState({ isOpenAddShift: true });
        this.weekdaySelected = weekday;
    }

    handleOpenDialogDeleteShift(index) {
        this.shiftSelected = index;
        this.setState({ isOpenConfirmDeleteShift: true });
    }

    handleOpenDialogEditShift(index) {
        this.shiftSelected = index;
        this.setState({ isOpenEditShift: true });
    }

    handleDeleteShift() {
        this.state.flexibleWorkingTime.shifts.splice(this.shiftSelected, 1);
        this.setState({
            flexibleWorkingTime: this.state.flexibleWorkingTime, isOpenConfirmDeleteShift: false
        }, this.handleUpdateFlexibleWorkingTime)
    }

    handleEditShift(shift) {
        this.state.flexibleWorkingTime.shifts[this.shiftSelected] = shift;
        this.setState({
            flexibleWorkingTime: this.state.flexibleWorkingTime, isOpenEditShift: false
        }, this.handleUpdateFlexibleWorkingTime)
    }

    renderFlexibleWorkingTime() {
        return (
            <div className="working-table">
                <div className="col-md-12 col-sm-12 working-table__header">
                    <div className="col-md-7 col-sm-7 working-table__header-title">
                        {
                            _.map(WEEKDAYS, (value, key) => {
                                let shifts = _.filter(this.state.flexibleWorkingTime.shifts, item => item.weekday == value);
                                return (
                                    <div key={key} className="col-md-1 col-sm-1 day">{RS.getString(key)}
                                        {
                                            shifts.length && !this.props.viewMode ? <i className="icon-copy" aria-hidden="true" onClick={() => { this.setState({ isOpenCopyDialog: true }), this.daySelected = new Date(moment().day(value)) }} /> : null
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="col-md-12 col-sm-12 working-table__content">
                    <div className="col-md-7 col-sm-7 location-shifts-content">
                        {
                            _.map(WEEKDAYS, (value, key) => {
                                let shifts = _.filter(this.state.flexibleWorkingTime.shifts, (shift, index) => {
                                    shift.index = index;
                                    return shift.weekday == value;
                                });
                                return (
                                    <CellShifts
                                        key={key}
                                        viewMode={this.props.viewMode}
                                        handleOpenDialogAddShift={this.handleAddShift.bind(this, value)}
                                        handleDelete={this.handleOpenDialogDeleteShift}
                                        shifts={shifts}
                                        viewMode={this.props.viewMode}
                                        handleEdit={this.handleOpenDialogEditShift}
                                    />
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }

    handleOnBlurDateTime(type, value) {
        this.setState({ [type]: value }, () => {
            switch (type) {
                case 'startDate': {
                    this.validateFieldHasErrors(['endDate']);
                    break;
                }
                case 'endDate': {
                    this.validateFieldHasErrors(['startDate']);
                    break;
                }
            }
            this.handleUpdateFlexibleWorkingTime();
        });
    }

    validateFieldHasErrors(fields) {
        _.forEach(fields, field => {
            if (this[field].hasError()) {
                this[field].validate();
            }
        });
    }

    handleSubmitCopy(dateRangeCopy) {
        let sourceWeekday = DateHelper.formatTimeWithPattern(this.daySelected, TIMEFORMAT.DAY_OF_WEEK_LONG);
        let sourceShifts = _.cloneDeep(_.filter(this.state.flexibleWorkingTime.shifts, (item) => item.weekday == sourceWeekday));
        dateRangeCopy.forEach(day => {
            let weekday = DateHelper.formatTimeWithPattern(day, TIMEFORMAT.DAY_OF_WEEK_LONG);
            let shifts = _.filter(this.state.flexibleWorkingTime.shifts, (item) => item.weekday != weekday);
            let newShifts = _.map(sourceShifts, (item) => {
                let newItem = _.cloneDeep(item)
                delete newItem.id;
                newItem.weekday = weekday;
                return newItem;
            })
            shifts.push(...newShifts)
            this.state.flexibleWorkingTime.shifts = shifts;
        });
        this.setState({ isOpenCopyDialog: false, flexibleWorkingTime: this.state.flexibleWorkingTime }, this.handleUpdateFlexibleWorkingTime)
    }

    handleAddFlexibleShift(shifts) {
        let flexibleShifts = _.map(shifts, shift => {
            let propertys = { weekday: this.weekdaySelected };
            if (this.state.flexibleWorkingTime.contractId) {
                propertys.contractFlexibleScheduleId = this.state.flexibleWorkingTime.contractId;
            }
            return _.assign({}, shift, propertys);
        });

        this.setState({
            flexibleWorkingTime: _.assign(
                {}, this.state.flexibleWorkingTime, {
                    shifts: [...this.state.flexibleWorkingTime.shifts, ...flexibleShifts]
                }
            )
        }, this.handleUpdateFlexibleWorkingTime);
    }

    render() {
        const group = _.get(this.props.flexibleWorkingTime, 'group.name', '');
        const { startDate, endDate } = this.props.contractTime;
        let startDateConstraint = {}, endDateConstraint = {};
        if (!this.props.viewMode) {
            let minDate = this.state.startDate && startDate && this.state.startDate.getTime() > startDate.getTime() ? this.state.startDate : startDate;
            let maxDate = this.state.endDate && endDate && this.state.endDate.getTime() < endDate.getTime() ? this.state.endDate : endDate;
            let minDateString = DateHelper.formatTimeWithPattern(minDate, DATE.FORMAT);
            let maxDateString = DateHelper.formatTimeWithPattern(maxDate, DATE.FORMAT);
            startDateConstraint = _.assign({},
                fieldValidations.date,
                fieldValidations.dateRange(startDate, maxDate, RS.getString("E142", ['START_DATE', DateHelper.formatTimeWithPattern(startDate, DATE.FORMAT)]), RS.getString("E148", ['START_DATE', maxDateString]))
            );
            endDateConstraint = _.assign({},
                fieldValidations.date,
                fieldValidations.dateRange(minDate, endDate, RS.getString("E142", ['END_DATE', minDateString]), RS.getString("E148", ['END_DATE', DateHelper.formatTimeWithPattern(endDate, DATE.FORMAT)]))
            );
        }

        let nameConstraint = _.assign({}, fieldValidations.fieldRequired, fieldValidations.unique(this.props.flexibleNames, RS.getString('E143')));

        return (
            <div className="row flexible-working-time">
                <div className={"flexible " + (this.props.viewMode ? 'view-mode' : '')}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="flexible-info">
                                        <i className="fa fa-clock-o flexible-info__icon" aria-hidden="true"></i>
                                        <div className="flexible-name-wrapper">
                                        {
                                            this.props.viewMode ?
                                                <p className="flexible-info__name">{`${RS.getString('FLEXIBLE_WORKING_TIME')} - ${_.get(this.props.flexibleWorkingTime, 'name')}`}</p> :
                                                <p className="flexible-info__name">{RS.getString('FLEXIBLE_WORKING_TIME')}</p>
                                        }
                                        </div>
                                    </div>
                                </td>
                                {
                                    this.props.viewMode &&
                                    <td>
                                        <div className="text-view">
                                            <div className="group-info">
                                                <div className="field-title">{RS.getString("GROUP")}: </div>
                                                <div className="field-value">{group}</div>
                                            </div>
                                            <div className="date-info">
                                                <span className="field-title">{RS.getString("FROM")} </span>
                                                <span className="field-value">{DateHelper.formatTimeWithPattern(this.state.startDate, DATE.FORMAT)}</span>
                                                <span className="field-title"> {RS.getString("TO", null, Option.LOWER)} </span>
                                                <span className="field-value">{DateHelper.formatTimeWithPattern(this.state.endDate, DATE.FORMAT)}</span>
                                            </div>
                                        </div>
                                    </td>
                                }
                                {
                                    !this.props.viewMode &&
                                    <td>
                                        <div className="flexible-name">
                                            <div className="title required">
                                                {RS.getString('NAME')}
                                            </div>
                                            <div className="identifier">
                                                <CommonTextField
                                                    ref={(input) => this.identifier = input}
                                                    id="name"
                                                    defaultValue={_.get(this.props, 'flexibleWorkingTime.name')}
                                                    constraint={nameConstraint}
                                                    onBlur={this.handleUpdateFlexibleWorkingTime}
                                                    maxLength = {MAX_LENGTH_INPUT.CONTRACT_ID}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                }
                                {
                                    !this.props.viewMode &&
                                    <td>
                                        <div className="flexible-group">
                                            <div className="title">
                                                {RS.getString('GROUP')}
                                            </div>
                                            <div className="select-group">
                                                <CommonSelect
                                                    placeholder={RS.getString('SELECT')}
                                                    clearable={false}
                                                    searchable={false}
                                                    name="select-location"
                                                    value={this.state.group}
                                                    propertyItem={{ label: 'name', value: 'id' }}
                                                    options={this.props.locationGroupSubs}
                                                    ref={(input) => this.groupSubs = input}
                                                    onChange={this.handleUpdateFlexibleWorkingTime}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                }
                                {
                                    !this.props.viewMode &&
                                    <td>
                                        <div className="flexible-date">
                                            <div className="title required">
                                                {RS.getString('FROM')}
                                            </div>
                                            <CommonDatePicker
                                                ref={(input) => this.startDate = input}
                                                hintText="dd/mm/yyyy"
                                                id="startDate"
                                                defaultValue={this.state.startDate}
                                                orientation="bottom auto"
                                                language={RS.getString("LANG_KEY")}
                                                onBlur={this.handleOnBlurDateTime.bind(this, 'startDate')}
                                                constraint={startDateConstraint}
                                                className="date-picker"
                                            />
                                        </div>
                                    </td>
                                }
                                {
                                    !this.props.viewMode &&
                                    <td>
                                        <div className="flexible-date">
                                            <div className="title required">
                                                {RS.getString('TO')}
                                            </div>
                                            <CommonDatePicker
                                                ref={(input) => this.endDate = input}
                                                hintText="dd/mm/yyyy"
                                                id="endDate"
                                                defaultValue={this.state.endDate}
                                                orientation="bottom auto"
                                                language={RS.getString("LANG_KEY")}
                                                onBlur={this.handleOnBlurDateTime.bind(this, 'endDate')}
                                                constraint={endDateConstraint}
                                                className="date-picker"
                                            />
                                        </div>
                                    </td>
                                }
                                {
                                    !this.props.viewMode &&
                                    <td>
                                        <div className="btn-copy-flexible" onClick={this.props.handleCopyFlexibleWorkingTime}>
                                            {RS.getString("COPY")}
                                        </div>
                                        <div className="btn-delete-flexible" onClick={this.props.handleDeleteFlexibleWorkingTime}>
                                            {RS.getString("DELETE")}
                                        </div>
                                    </td>
                                }
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="working">
                    {this.renderFlexibleWorkingTime()}
                </div>
                <DialogAddFlexibleShift
                    isOpen={this.state.isOpenAddShift}
                    title={RS.getString('ADD_FLEXIBLE_SHIFT')}
                    jobRoles={this.props.jobRoles}
                    handleSave={this.handleAddFlexibleShift}
                    handleClose={() => this.setState({ isOpenAddShift: false })}
                    mode={SHIFT_MODE.NEW_SHIFT}
                    modal
                />
                <DialogConfirm
                    title={RS.getString('DELETE_TITLE')}
                    isOpen={this.state.isOpenConfirmDeleteShift}
                    handleSubmit={this.handleDeleteShift}
                    handleClose={() => this.setState({ isOpenConfirmDeleteShift: false })}
                >
                    <span>{RS.getString('CONFIRM_DELETE', 'FLEXIBLE_SHIFT', Option.FIRSTCAP)}</span>
                </DialogConfirm>
                {
                    this.state.isOpenCopyDialog &&
                    <DialogCopyDayToDays
                        isOpen={this.state.isOpenCopyDialog}
                        title={RS.getString("COPY_SHIFT")}
                        handleClose={() => this.setState({ isOpenCopyDialog: false })}
                        from={new Date(moment().startOf('isoWeek'))}
                        to={new Date(moment().endOf('isoWeek'))}
                        daySelected={this.daySelected}
                        handleSubmitCopy={this.handleSubmitCopy}
                    />
                }
                {
                    this.state.isOpenEditShift &&
                    <DialogEditLocationShift
                        isOpen={this.state.isOpenEditShift}
                        isFlexible={true}
                        title={RS.getString("EDIT_FLEXIBLE_SHIFT", null, Option.UPPER)}
                        className="dialog-add-flexible-shift"
                        shift={this.state.flexibleWorkingTime.shifts[this.shiftSelected]}
                        handleSubmit={this.handleEditShift}
                        handleClose={() => { this.setState({ isOpenEditShift: false }); }}
                        jobRoles={this.props.jobRoles}
                        curEmp={this.props.curEmp}
                    />
                }
            </div >
        );
    }
}

FlexibleWorkingTimeDetail.propTypes = propTypes;
export default FlexibleWorkingTimeDetail;