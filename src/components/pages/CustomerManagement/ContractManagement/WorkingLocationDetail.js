import React, { PropTypes } from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import Overlay from 'react-bootstrap/lib/Overlay';
import moment from 'moment';

import RS, { Option } from '../../../../resources/resourceManager';
import fieldValidations from '../../../../validation/common.field.validation';
import CommonDatePicker from '../../../elements/DatePicker/CommonDatePicker';
import CommonSelect from '../../../elements/CommonSelect.component';
import DialogAddLocationShifts from './DialogAddLocationShifts';
import DialogEditLocationShift from './DialogEditLocationShift';
import RaisedButton from '../../../elements/RaisedButton';
import NumberInput from '../../../elements/NumberInput';
import DateHelper from '../../../../utils/dateHelper';
import { DATE, DATETIME, WEEKDAYS, TIMEFORMAT } from '../../../../core/common/constants';

import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import CellShifts from './CellShifts';
import DialogConfirm from '../../../elements/DialogConfirm';
import DialogCopyDayToDays from '../../Schedule/DialogCopyDayToDays'

const propTypes = {
    workingLocation: PropTypes.object,
    roles: PropTypes.array,
    handleDeleteWorkingLocation: PropTypes.func,
    contractTime: PropTypes.object,
    viewMode: PropTypes.bool,
    groups: PropTypes.array,
    isEdit: PropTypes.bool,
    handleCopyWorkingLocation: PropTypes.func
};
class WorkingLocationDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            workingLocation: {},
            weekday: '',
            isOpenConfirmDeleteShift: false,
            isOpenCopyDialog: false
        };

        this.validate = this.validate.bind(this);
        this.handleOpenAddLocationShiftDialog = this.handleOpenAddLocationShiftDialog.bind(this);
        this.handleDeleteWorkingLocation = this.handleDeleteWorkingLocation.bind(this);
        this.handleUpdateWorkingLocation = this.handleUpdateWorkingLocation.bind(this);
        this.handleOnBlurDateTime = this.handleOnBlurDateTime.bind(this);
        this.handleAddShifts = this.handleAddShifts.bind(this);
        this.renderWorkingTime = this.renderWorkingTime.bind(this);
        this.handleOpenDialogDeleteShift = this.handleOpenDialogDeleteShift.bind(this);
        this.handleDeleteShift = this.handleDeleteShift.bind(this)
        this.handleOpenDialogEditShift = this.handleOpenDialogEditShift.bind(this);
        this.handleEditShift = this.handleEditShift.bind(this);
        this.handleSubmitCopy = this.handleSubmitCopy.bind(this);
    }

    componentDidMount() {
        let { startDate, endDate, group } = this.props.workingLocation;
        startDate = startDate || this.props.contractTime.startDate;
        endDate = endDate || this.props.contractTime.endDate;
        group = group || this.props.group;

        this.setState({
            workingLocation: _.cloneDeep(this.props.workingLocation),
            startDate,
            endDate,
            group
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.workingLocation, nextProps.workingLocation)) {
            this.setState({
                workingLocation: _.cloneDeep(nextProps.workingLocation),
                group: nextProps.workingLocation.group || nextProps.group
            });
        }
        if (_.isEmpty(nextProps.workingLocation.group)) {
            this.groupSubs.setValue(nextProps.locationGroupSubs[0]);
        }
    }

    getValue() {
        let workingLocation = _.cloneDeep(this.state.workingLocation);
        workingLocation.startDate = _.cloneDeep(this.state.startDate);
        workingLocation.endDate = _.cloneDeep(this.state.endDate);

        let group = _.cloneDeep(this.groupSubs.getValue());
        delete group.label;
        delete group.value;
        delete group.supervisor;
        workingLocation.group = group;

        _.forEach(workingLocation.shifts, shift => {
            delete shift.index;
            let fields = ['breakTimeFrom', 'breakTimeFromString', 'breakTimeTo', 'breakTimeToString'];
            _.forEach(fields, field => {
                if (!shift[field]) {
                    delete shift[field];
                }
            })
        })

        return workingLocation;
    }

    validate() {
        let isValid = true;
        _.forEach(['startDate', 'endDate'], field => {
            if (!this[field].validate()) {
                isValid = false;
            }
        });
        return isValid;
    }

    handleOpenAddLocationShiftDialog(weekday) {
        this.setState({ isOpenAddLocationShifts: true, weekday });
    }

    handleDeleteWorkingLocation() {
        this.props.handleDeleteWorkingLocation(this.props.workingLocation.location.id);
    }

    handleUpdateWorkingLocation() {
        this.props.handleUpdateWorkingLocation && this.props.handleUpdateWorkingLocation(this.props.index, this.getValue());
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
            this.handleUpdateWorkingLocation();
        });
    }

    handleAddShifts(weekday, shifts) {
        _.forEach(shifts, shift => {
            if (this.state.workingLocation.contractId) {
                shift.contractScheduleId = this.state.workingLocation.contractId;
            }
            delete shift.id;
        })
        this.setState({
            workingLocation: {
                ...this.state.workingLocation,
                shifts: [...this.state.workingLocation.shifts, ...shifts]
            }
        }, () => {
            this.handleUpdateWorkingLocation();
        });
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
        this.state.workingLocation.shifts.splice(this.shiftSelected, 1);
        this.setState({
            workingLocation: this.state.workingLocation, isOpenConfirmDeleteShift: false
        }, this.handleUpdateWorkingLocation)
    }

    handleEditShift(shift) {
        this.state.workingLocation.shifts[this.shiftSelected] = shift;
        this.setState({
            workingLocation: this.state.workingLocation, isOpenEditShift: false
        }, this.handleUpdateWorkingLocation)
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
        let sourceShifts = _.cloneDeep(_.filter(this.state.workingLocation.shifts, (item) => item.weekday == sourceWeekday));
        dateRangeCopy.forEach(day => {
            let weekday = DateHelper.formatTimeWithPattern(day, TIMEFORMAT.DAY_OF_WEEK_LONG);
            let shifts = _.filter(this.state.workingLocation.shifts, (item) => item.weekday != weekday);
            let newShifts = _.map(sourceShifts, (item) => {
                let newItem = _.cloneDeep(item)
                delete newItem.id;
                newItem.weekday = weekday;
                return newItem;
            })
            shifts.push(...newShifts)
            this.state.workingLocation.shifts = shifts;
        });
        this.setState({ isOpenCopyDialog: false, workingLocation: this.state.workingLocation }, this.handleUpdateWorkingLocation)
    }
    renderWorkingTime() {
        return (
            <div className="working-table">
                <div className="col-md-12 col-sm-12 working-table__header">
                    <div className="working-table__header-title">
                        {
                            _.map(WEEKDAYS, (value, key) => {
                                let shifts = _.filter(this.state.workingLocation.shifts, (item) => item.weekday == value);
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
                <div className="working-table__content">
                    <div className="location-shifts-content">
                        {
                            _.map(WEEKDAYS, (value, key) => {
                                let shifts = _.filter(this.state.workingLocation.shifts, (item, index) => {
                                    item.index = index;
                                    return item.weekday == value
                                });
                                return (
                                    <CellShifts
                                        key={key}
                                        viewMode={this.props.viewMode}
                                        handleOpenDialogAddShift={this.handleOpenAddLocationShiftDialog.bind(this, value)}
                                        handleAddShifts={this.handleAddShift}
                                        shifts={shifts}
                                        handleDelete={this.handleOpenDialogDeleteShift}
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

    render() {
        const { name, address } = this.props.workingLocation.location;
        const group = _.get(this.props.workingLocation, 'group.name', '');
        const { startDate, endDate } = this.props.contractTime;
        let startDateConstraint = {}, endDateConstraint = {};
        if (!this.props.viewMode) {
            let minDate = this.state.startDate && startDate  && (this.state.startDate.getTime() > startDate.getTime()) ? this.state.startDate : startDate;
            let maxDate = this.state.endDate && endDate && (this.state.endDate.getTime() < endDate.getTime()) ? this.state.endDate : endDate;
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

        return (
            <div className="row contract-working-location">
                <div className={"location " + (this.props.viewMode ? 'view-mode' : '')}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="location-info">
                                        <i className="fa icon-building-type2 location-info__icon" aria-hidden="true"></i>
                                        <div>
                                            <p className="location-info__name">{name}</p>
                                            <p className="location-info__address">{address}</p>
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
                                        <div className="location-group">
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
                                                    onChange={this.handleUpdateWorkingLocation}
                                                    ref={(input) => this.groupSubs = input}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                }
                                {
                                    !this.props.viewMode &&
                                    <td>
                                        <div className="location-date">
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
                                        <div className="location-date">
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
                                        <div className="btn-copy-location" onClick={this.props.handleCopyWorkingLocation}>
                                            {RS.getString("COPY")}
                                        </div>
                                        <div className="btn-delete-location" onClick={this.handleDeleteWorkingLocation}>
                                            {RS.getString("DELETE")}
                                        </div>
                                    </td>
                                }
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="working">
                    {this.renderWorkingTime()}
                </div>
                <DialogAddLocationShifts
                    isOpen={this.state.isOpenAddLocationShifts}
                    title={RS.getString("ADD_SHIFT")}
                    handleAddShifts={this.handleAddShifts}
                    handleClose={() => { this.setState({ isOpenAddLocationShifts: false }); }}
                    shiftTemplates={this.props.shiftTemplates}
                    jobRoles={this.props.jobRoles}
                    weekday={this.state.weekday}
                    curEmp={this.props.curEmp}
                />
                {
                    this.state.isOpenConfirmDeleteShift &&
                    <DialogConfirm
                        title={RS.getString('DELETE_TITLE')}
                        isOpen={this.state.isOpenConfirmDeleteShift}
                        handleSubmit={this.handleDeleteShift}
                        handleClose={() => this.setState({ isOpenConfirmDeleteShift: false })}
                    >
                        <span>{RS.getString('CONFIRM_DELETE', 'WORKING_SHIFT', Option.LOWER)}</span>
                    </DialogConfirm>
                }

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
                        title={RS.getString("EDIT_SHIFT", null, Option.UPPER)}
                        className="dialog-add-location-shift"
                        shift={this.state.workingLocation.shifts[this.shiftSelected]}
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

WorkingLocationDetail.propTypes = propTypes;
export default WorkingLocationDetail;
