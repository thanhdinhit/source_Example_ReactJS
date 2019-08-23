import React, { PropTypes } from 'react';
import RS, { Options } from '../../../../resources/resourceManager';
import _ from 'lodash';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { URL } from '../../../../core/common/app.routes';
import Breadcrumb from '../../../elements/Breadcrumb';
import CommonSelect from '../../../elements/CommonSelect.component';
import { getNewOvertimeConstraints } from '../../../../validation/newOvertimeConstraints';
import CommonDatePicker from '../../../elements/DatePicker/CommonDatePicker';
import CommonTimePicker from '../../../elements/DatePicker/CommonTimePicker';
import TextArea from '../../../elements/TextArea';
import RaisedButton from '../../../elements/RaisedButton';
import { WAITING_TIME, DATETIME } from '../../../../core/common/constants';
import DialogAddEmployeeContainer from '../../../../containers/EmployeePortal/DialogAddEmployeesContainer';
import * as toastr from '../../../../utils/toastr';
import { browserHistory } from 'react-router';
import DateHelper from '../../../../utils/dateHelper';
import PopoverIcon from '../../../elements/PopoverIcon/PopoverIcon';
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';

const propTypes = {

}
class NewOvertime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            endDate: null,
            startTime: null,
            endTime: null,
            disabledSendRequests: true,
            isOpenAddEmployee: false,
            contractIDs: [],
        }
        this.DATETIME_TYPE = {
            START_DATE: 'startDate',
            END_DATE: 'endDate',
            START_TIME: 'startTime',
            END_TIME: 'endTime'
        }
        this.dateTime = {};
        this.handleOnChangeSelect = this.handleOnChangeSelect.bind(this)
        this.handleOnBlurDateTime = this.handleOnBlurDateTime.bind(this)
        this.hasFullInfoTimeOvertime = this.hasFullInfoTimeOvertime.bind(this);
        this.handleAddEmployees = this.handleAddEmployees.bind(this);
        this.removeSelectedEmployee = this.removeSelectedEmployee.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.routerWillLeave = this.routerWillLeave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        LoadingIndicatorActions.showAppLoadingIndicator();
        let overtimeFrom = this.getOvertimeFrom();
        setTimeout(() => {
            this.props.overtimeActions.loadOvertimeStatistic({ overtimeFrom })
            this.props.locationActions.loadLocations({});
            this.props.settingAction.loadPayRateSetting();
            this.props.overtimeActions.loadOvertimeSetting();
            this.props.loadCustomers({});
            this.props.loadAllContract({});
        }, 0);
        this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
        window.onbeforeunload = function (ev) {
            ev.preventDefault();
            return ev.returnValue = RS.getString("P115");
        }
    }

    componentWillReceiveProps(nextProps) {
        LoadingIndicatorActions.hideAppLoadingIndicator();
        if (nextProps.payload.success) {
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'))
            this.state.isSaved = true;
            setTimeout(() => {
                this.props.globalAction.resetState();
                this.props.overtimeActions.resetOvertimeDto();
                browserHistory.push(getUrlPath(URL.OVERTIME));
            }, WAITING_TIME);
        }
        if (nextProps.payload.error.message != '' || nextProps.payload.error.exception) {
            toastr.error(nextProps.payload.error.message, RS.getString('ERROR'));
            this.props.globalAction.resetError();
        }
        if (nextProps.payload.errors.length) {
            nextProps.payload.errors.forEach(function (errElement) {
                let content = errElement.employee.contactDetail.fullName + RS.getString('ERROR')
                toastr.error(nextProps.payload.error.message, content);
            }, this);
            this.props.globalAction.resetError();
        }
    }
    componentWillUnmount() {
        window.onbeforeunload = null;
        this.props.globalAction.resetState();
        this.props.overtimeActions.resetOvertimeDto()
    }

    routerWillLeave(nextLocation) {
        // return false to prevent a transition w/o prompting the user,
        // or return a string to allow the user to decide:
        if (!this.state.isSaved)
            return RS.getString("P115");
    }
    getOvertimeFrom() {
        const date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0);
        return DateHelper.convertDateTimeToQueryString(firstDay, lastDay);
    }
    hasFullInfoTimeOvertime() {
        const fields = ['startDate', 'startTime', 'endDate', 'endTime'];
        const self = this;
        let isValid = true;

        _.forEach(fields, function (field) {
            const value = self[field].getValue();
            self.dateTime[field] = value;
            !value && (isValid = false);
        });

        return isValid;
    }
    validateFieldHasErrors(fields) {
        const fieldErrors = this.getFieldHasErrors(fields);
        this.validateFields(fieldErrors);
    }
    getFieldHasErrors(fields) {
        let fieldValidates = [];
        _.forEach(fields, (item) => {
            this[item].hasError() && fieldValidates.push(item);
        });
        return fieldValidates;
    }
    validateFields(fields) {
        _.forEach(fields, (field) => {
            if (!this[field].validate()) rs = false;
        });
    }
    handleOnChangeSelect(name, value) {
        let id = this.props.overtimeActions.updateNewOvertime(name, value).value.id;
        let arrID = []
        this.props.contracts.map(item => {
            if (item.customer.id === id) {
                    arrID.push(item)
            }
        })
        this.setState({ contractID: arrID })
        this.props.overtimeActions.updateNewOvertime(name, value);
        setTimeout(() => {
            this.validateData()
        }, WAITING_TIME);
    }
    handleOnBlurDateTime(type, value) {
        setTimeout(() => {
            this.validateData();
        }, WAITING_TIME);
        if (this.hasFullInfoTimeOvertime()) {
            type && this.setState({ [type]: value }, () => {
                switch (type) {
                    case 'startDate': {
                        this.validateFieldHasErrors(['startTime', 'endDate', 'endTime']);
                        break;
                    }
                    case 'startTime': {
                        this.validateFieldHasErrors(['endTime']);
                        break;
                    }
                    case 'endDate': {
                        this.validateFieldHasErrors(['startDate', 'startTime', 'endTime']);
                        break;
                    }
                    case 'endTime': {
                        this.validateFieldHasErrors(['startTime']);
                        break;
                    }
                }
            });
        } else {
            type && this.setState({ [type]: value }, () => {
                if (this.dateTime['startDate'] && this.dateTime['endDate']) {
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
                }
            });
        }
    }

    getValues() {
        let newOvertime = _.cloneDeep(this.props.newOvertime);

        const overtimeTime = this.getOvertimeTime();
        newOvertime = _.assign(newOvertime, overtimeTime);

        return newOvertime;
    }

    validateData() {
        let rs = true;
        let data = this.getValues();
        const requiredField = ['customerName', 'contract', 'location', 'payRate', 'overtimeFrom', 'overtimeTo']
        requiredField.forEach((field) => {
            if (!data[field]) {
                rs = false;
                return;
            }
        });

        if (rs && (data.overtimeFrom.getTime() >= data.overtimeTo.getTime())) {
            rs = false;
        }
        if (rs && data.employees.length == 0) {
            rs = false;
        }
        this.setState({ disabledSendRequests: !rs })
        return rs;
    }

    getOvertimeTime() {
        const { startDate, startTime, endDate, endTime } = this.dateTime;
        if (!startDate || !startTime || !endDate || !endTime) return {}
        const overtimeFrom = new Date(
            startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startTime.getHours(), startTime.getMinutes(), 0
        );
        const overtimeTo = new Date(
            endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endTime.getHours(), endTime.getMinutes(), 0
        );
        return {
            overtimeFrom,
            overtimeTo
        };
    }
    handleSubmit() {
        this.setState({ disabledSendRequests: true })
        setTimeout(() => {
            this.props.overtimeActions.submitNewOvertimes(this.getValues());
        }, WAITING_TIME);
    }
    handleCancel() {
        browserHistory.goBack();
    }
    handleAddEmployees(employees) {
        if (this.props.overtimeStatistic.length > 0) {
            employees.forEach(function (employee) {
                let employeeStatistic = this.props.overtimeStatistic.find(x => x.employee.id == employee.id);
                if (employeeStatistic) {
                    employee.hours = employeeStatistic.hours;
                }
            }, this);
        }
        this.props.overtimeActions.updateNewOvertime('employees', employees);
        this.setState({ isOpenAddEmployee: false })
        setTimeout(() => {
            this.validateData()
        }, WAITING_TIME);
    }
    removeSelectedEmployee(employee) {
        let newEmployees = this.props.newOvertime.employees.filter(x => x.id != employee.id)
        this.props.overtimeActions.updateNewOvertime('employees', newEmployees);
        setTimeout(() => {
            this.validateData()
        }, WAITING_TIME);
    }
    render() {
        const newOvertimeConstraints = getNewOvertimeConstraints();

        const startDateConstraint = newOvertimeConstraints.startDate(this.state.endDate);
        const endDateConstraint = newOvertimeConstraints.endDate(this.state.startDate);

        let startTimeConstraint = newOvertimeConstraints.startTime(null);
        let endTimeConstraint = newOvertimeConstraints.endTime(null);

        if (this.state.startDate && this.state.endDate
            && (this.state.startDate.getTime() === this.state.endDate.getTime())) {
            startTimeConstraint = newOvertimeConstraints.startTime(this.state.endTime);
            endTimeConstraint = newOvertimeConstraints.endTime(this.state.startTime);
        }


        const breadCrumb = [
            {
                key: RS.getString("OVERTIME"),
                value: getUrlPath(URL.OVERTIME)
            }
        ];
        let curMonth = DateHelper.getCurMonth();

        return (
            <div className="page-container new-overtime">
                <div className="header">
                    {RS.getString('NEW_OVERTIME')}
                </div>
                <div className="row row-header">
                    <Breadcrumb link={breadCrumb} />
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-sm-6">
                                <CommonSelect
                                    title={RS.getString("CUSTOMER_NAME")}
                                    required
                                    placeholder={RS.getString('SELECT')}
                                    clearable={false}
                                    searchable={false}
                                    propertyItem={{ label: 'customerName', value: 'id' }}
                                    options={this.props.customers}
                                    constraint={newOvertimeConstraints.customerName}
                                    ref={(input) => this.customerName = input}
                                    onChange={this.handleOnChangeSelect.bind(this, 'customerName')}
                                />
                            </div>
                            <div className="col-sm-6">
                                <CommonSelect
                                    title={RS.getString("CONTRACT_ID")}
                                    required
                                    placeholder={RS.getString('SELECT')}
                                    clearable={false}
                                    searchable={false}
                                    propertyItem={{ label: 'identifier', value: 'id' }}
                                    options={this.state.contractID}
                                    ref={(input) => this.contract = input}
                                    onChange={this.handleOnChangeSelect.bind(this, 'contract')}
                                />
                            </div>
                            <div className="col-sm-6">
                                <CommonSelect
                                    title={RS.getString("LOCATION")}
                                    required
                                    placeholder={RS.getString('SELECT')}
                                    clearable={false}
                                    searchable={false}
                                    propertyItem={{ label: 'name', value: 'id' }}
                                    options={this.props.locations}
                                    constraint={newOvertimeConstraints.location}
                                    ref={(input) => this.location = input}
                                    onChange={this.handleOnChangeSelect.bind(this, 'location')}
                                    value={this.props.newOvertime.location}
                                />
                            </div>
                            <div className="col-sm-6">
                                <CommonSelect
                                    title={RS.getString("PAY_RATE")}
                                    required
                                    placeholder={RS.getString('SELECT')}
                                    clearable={false}
                                    searchable={false}
                                    propertyItem={{ label: 'name', value: 'id' }}
                                    options={this.props.payRateSetting}
                                    constraint={newOvertimeConstraints.payRate}
                                    ref={(input) => this.payRate = input}
                                    onChange={this.handleOnChangeSelect.bind(this, 'payRate')}
                                />
                            </div>
                            <div className="col-sm-6">
                                <div className="row date-time-picker">
                                    <div className="col-xs-6">
                                        <CommonDatePicker
                                            required
                                            title={RS.getString('START')}
                                            ref={(input) => this.startDate = input}
                                            hintText="dd/mm/yyyy"
                                            id="start-date"
                                            orientation="bottom auto"
                                            language={RS.getString("LANG_KEY")}
                                            onBlur={this.handleOnBlurDateTime.bind(this, this.DATETIME_TYPE.START_DATE)}
                                            constraint={startDateConstraint}
                                        />
                                    </div>
                                    <div className="col-xs-6">
                                        <CommonTimePicker
                                            title=" "
                                            ref={(timePicker) => this.startTime = timePicker}
                                            onBlur={this.handleOnBlurDateTime.bind(this, this.DATETIME_TYPE.START_TIME)}
                                            constraint={startTimeConstraint}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="row date-time-picker">
                                    <div className="col-xs-6">
                                        <CommonDatePicker
                                            required
                                            title={RS.getString('START')}
                                            ref={(input) => this.endDate = input}
                                            hintText="dd/mm/yyyy"
                                            id="start-date"
                                            orientation="bottom auto"
                                            language={RS.getString("LANG_KEY")}
                                            onBlur={this.handleOnBlurDateTime.bind(this, this.DATETIME_TYPE.END_DATE)}
                                            constraint={endDateConstraint}
                                        />
                                    </div>
                                    <div className="col-xs-6">
                                        <CommonTimePicker
                                            title=" "
                                            ref={(timePicker) => this.endTime = timePicker}
                                            onBlur={this.handleOnBlurDateTime.bind(this, this.DATETIME_TYPE.END_TIME)}
                                            constraint={endTimeConstraint}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <TextArea
                                    title={RS.getString("COMMENT")}
                                    line={3}
                                    placeholder={RS.getString('WRITE_YOUR_REASON')}
                                    ref={(input) => this.reason = input}
                                    defaultValue={this.props.newOvertime.comment}
                                    onChange={(e, value) => this.props.overtimeActions.updateNewOvertime('comment', value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="label-button ">
                            <div className="pull-right" onClick={() => this.setState({ isOpenAddEmployee: true })}>
                                <i className="icon-add-employee"> </i>
                                <span>{RS.getString("ADD_EMPLOYEES")} </span>
                            </div>
                        </div>
                        <div className="employee-panel">
                            {
                                this.props.newOvertime.employees.map((employee, index) => {
                                    return (
                                        <div key={index}
                                            className={"employee-chip " + (employee.hours >= this.props.overtimeSetting.maxHoursPerMonth ? 'warning-chip' : '')}>
                                            <img
                                                src={employee.contactDetail.photoUrl ?
                                                    (API_FILE + employee.contactDetail.photoUrl) :
                                                    require("../../../../images/avatarDefault1.png")} />
                                            <span>{employee.contactDetail.fullName} </span>
                                            {
                                                employee.hours >= this.props.overtimeSetting.maxHoursPerMonth ?
                                                    <PopoverIcon
                                                        message={RS.getString("E137", [employee.contactDetail.fullName, curMonth, employee.hours])}
                                                        ref={(popoverIcon) => this.popoverIcon = popoverIcon}
                                                        show={true}
                                                        iconPath='warning-icon.png'
                                                        className="popover-warning popover-top-left"
                                                        iconClassName="img-popover-warning"
                                                    />
                                                    : null
                                            }
                                            <i className="icon-close" onClick={this.removeSelectedEmployee.bind(this, employee)}></i>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="footer-container pull-right">
                        <RaisedButton
                            label={RS.getString('CANCEL')}
                            onClick={this.handleCancel}
                            className="raised-button-fourth"
                        />
                        <RaisedButton
                            disabled={this.state.disabledSendRequests}
                            label={RS.getString('SEND_REQUESTS')}
                            onClick={this.handleSubmit}
                        />
                    </div>
                </div>
                <DialogAddEmployeeContainer
                    isOpen={this.state.isOpenAddEmployee}
                    handleAddEmployees={this.handleAddEmployees}
                    handleClose={() => this.setState({ isOpenAddEmployee: false })}
                    selectedEmployees={this.props.newOvertime.employees}
                />
            </div>
        )
    }

}
NewOvertime.propTypes = propTypes;
NewOvertime.contextTypes = {
    router: React.PropTypes.object.isRequired
}
export default NewOvertime;

