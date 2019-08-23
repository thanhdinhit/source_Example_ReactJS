import React from 'react';
import RaisedButton from '../../elements/RaisedButton';
import { browserHistory } from 'react-router';
import { QUERY_STRING, WAITING_TIME, CONTRACT_STATUS, getSchedulePeriod, TIMEFORMAT, DATETIME, TIMESPAN } from '../../../core/common/constants';
import RS, { Option } from '../../../resources/resourceManager';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import { URL } from '../../../core/common/app.routes';
import _ from 'lodash';
import FilterSearch from '../../elements/Filter/FilterSearch';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import Pagination from '../../elements/Paginate/Pagination';
import debounceHelper from '../../../utils/debounceHelper';
import dateHelper from '../../../utils/dateHelper';
import CommonSelect from '../../elements/CommonSelect.component';
import * as apiHelper from '../../../utils/apiHelper';
import Breadcrumb from '../../elements/Breadcrumb';
import ScheduleShiftView from './ScheduleShiftView';
import Moment from 'moment';
import TimeSlider from '../../elements/TimeSlider';
import DialogAlert from '../../elements/DialogAlert';
import * as toastr from '../../../utils/toastr';
import DialogCopySchedule from './DialogCopySchedule';
import * as LoadingIndicatorActions from '../../../utils/loadingIndicatorActions';
import * as scheduleActions from '../../../actionsv2/scheduleActions'
import { hideAppLoadingIndicator, showAppLoadingIndicator } from '../../../utils/loadingIndicatorActions';

const redirect = getUrlPath(URL.SCHEDULES);
const propTypes = {}
const MODEVIEW = {
    EMPLOYEE: 'EMPLOYEE',
    SHIFT: 'SHIFT'
}
class ScheduleDetail extends React.Component {
    constructor(props) {
        super(props);
        let { query } = this.props.location;
        let dateRange = dateHelper.getDateRange(new Date(), TIMESPAN.WEEK);
        this.state = {
            filter: this.getFilterFromUrl(),
            isOpenConfirmationRemoveAll: false,
            // rangeScheduleValue: TIMESPAN.WEEK,
            isOpenCopySchedule: false,
            isOpenConfirmNotify: false
        }
        this.queryString = {};

        this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter);
        this.handleFilterParamsChange = this.handleFilterParamsChange.bind(this);
        this.getEmployeeScheduleParams = this.getEmployeeScheduleParams.bind(this);
        this.handleRemoveAllScheduling = this.handleRemoveAllScheduling.bind(this);
        this.handleConfirmRemoveAll = this.handleConfirmRemoveAll.bind(this);
        this.handleSubmitCopySchedule = this.handleSubmitCopySchedule.bind(this);
        this.handleCallBackAction = this.handleCallBackAction.bind(this)
        this.handleCallBackNotify = this.handleCallBackNotify.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        hideAppLoadingIndicator();
    }
    componentDidMount() {
        let scheduleId = Number(this.props.params.scheduleId)
        if (!scheduleId) {
            browserHistory.replace(`/page_not_found`)
        }
        this.props.loadSchedule(this.props.params.scheduleId,
            {
                from: this.state.filter.shiftDateFrom,
                to: this.state.filter.shiftDateTo
            })
        this.props.loadAllContract({});
        this.props.jobRoleSettingAction.loadJobRolesSetting({});
        this.props.shiftTemplateSettingActions.loadShiftTemplatesSetting({});
    }

    componentDidUpdate() {
        if (this.props.payload.success) {
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'))
            this.props.resetScheduleState();
            LoadingIndicatorActions.hideAppLoadingIndicator(true);
        }
        if (this.props.payload.error.message != '' || this.props.payload.error.exception) {
            toastr.error(this.props.payload.error.message, RS.getString('ERROR'))
            this.props.resetError();
        }
    }

    componentWillUnmount() {
        this.props.resetScheduleShiftViewState();
    }

    getFilterFromUrl() {
        let { query } = this.props.location;
        let schedulePeriods = getSchedulePeriod();
        let filter = {};
        if (_.find(schedulePeriods, x => x.value == query.schedulePeriod)) {
            filter.schedulePeriod = query.schedulePeriod;
        }
        else {
            filter.schedulePeriod = schedulePeriods[0].value
        }
        let from;
        switch (filter.schedulePeriod) {
            case TIMESPAN.WEEK:
            case TIMESPAN.TWO_WEEKS:
            case TIMESPAN.THREE_WEEKS:
                from = query.shiftDateFrom ? new Date(Moment(query.shiftDateFrom).startOf('isoWeek')) : new Date(Moment().startOf('isoWeek'));
                break;
            case TIMESPAN.MONTH:
                from = query.shiftDateFrom ? new Date(Moment(query.shiftDateFrom).startOf('month')) : new Date(Moment().startOf('month'));
        }
        filter = _.assign(filter, {
            modeView: query.modeView || MODEVIEW.SHIFT,
            shiftDateFrom: from,

        })
        filter.shiftDateTo = dateHelper.getDateRange(filter.shiftDateFrom, filter.schedulePeriod).to;
        return filter;
    }

    convertFilterToQueryString(queryString, filter) {
        let query = _.assign({}, queryString, filter);
        delete query.shiftDateTo
        query.shiftDateFrom = Moment.utc(query.shiftDateFrom).format();
        // query.shiftDateTo = Moment.utc(query.shiftDateTo).format();
        return query;
    }

    handleFilterParamsChange(scheduleId) {
        let paramsString = _.map(_.keys(_.omitBy(this.queryString, _.isUndefined)), (key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(this.queryString[key]);
        }).join('&');
        browserHistory.replace(getUrlPath(URL.SCHEDULE, { scheduleId: scheduleId }) + '?' + paramsString);
    }

    handleRemoveAllScheduling() {
        this.setState({ isOpenConfirmationRemoveAll: true });
    }

    handleConfirmRemoveAll() {
        showAppLoadingIndicator();
        scheduleActions.removeScheduleFromTo(this.props.schedule.id, {
            from: this.state.filter.shiftDateFrom,
            to: this.state.filter.shiftDateTo
        }, (err) => { !err && this.setState({ isOpenConfirmationRemoveAll: false }), this.handleCallBackAction(err) });

    }
    handleCallBackNotify(err) {
        !err && this.setState({ isOpenConfirmNotify: false })
        this.handleCallBackAction(err)
    }
    handleCallBackAction(err) {
        hideAppLoadingIndicator();
        if (err) {
            toastr.error(err.message, RS.getString('ERROR'))
        }
        else {
            let scheduleRequest = this.getEmployeeScheduleParams();
            this.props.loadEmployeSchedules(scheduleRequest.params, scheduleRequest.mappingData);
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'))
        }
    }

    handleFilterSchedule(field, data) {
        switch (field) {
            case 'contract':
                if (data.schedules.length) {
                    this.changeSchedule(data.schedules[0].id)
                }
                else {
                    browserHistory.replace('/page_not_found')
                }
                break;
            case 'location':
                let contract = _.find(this.props.contracts, x => x.id == _.get(this.props.schedule, "contract.id"))
                if (contract) {
                    let schedule = _.find(contract.schedules, x => x.location.id == data.id);
                    this.changeSchedule(schedule.id)
                }
                else {
                    browserHistory.replace('/page_not_found')
                }
                break;
            case 'schedulePeriod':
                let dateRange = dateHelper.getDateRange(this.state.filter.shiftDateFrom, data.value);
                this.setState({
                    filter: {
                        ...this.state.filter,
                        shiftDateFrom: dateRange.from,
                        shiftDateTo: dateRange.to,
                        schedulePeriod: data.value
                    },
                }, () => {
                    this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter)
                    this.handleFilterParamsChange(this.props.schedule.id)
                    this.props.loadEmployeSchedules(
                        {
                            scheduleId: this.props.schedule.id,
                            from: this.state.filter.shiftDateFrom,
                            to: this.state.filter.shiftDateTo
                        },
                        {
                            schedule: this.props.schedule,
                            scheduleSubGroups: this.props.scheduleSubGroups,
                            managedGroups: this.props.managedGroups
                        }
                    )
                })

                break;
        }
    }

    changeShiftDate(shiftDateFrom, shiftDateTo) {
        this.setState({
            filter: {
                ...this.state.filter,
                shiftDateFrom,
                shiftDateTo
            }
        }, () => {
            this.queryString = this.convertFilterToQueryString(this.queryString, this.state.filter)
            this.handleFilterParamsChange(this.props.schedule.id)
            this.props.loadEmployeSchedules(
                {
                    scheduleId: this.props.schedule.id,
                    from: this.state.filter.shiftDateFrom,
                    to: this.state.filter.shiftDateTo
                },
                {
                    schedule: this.props.schedule,
                    scheduleSubGroups: this.props.scheduleSubGroups,
                    managedGroups: this.props.managedGroups
                }
            )
        });
    }

    changeSchedule(scheduleId) {
        this.props.loadSchedule(scheduleId,
            {
                from: this.state.filter.shiftDateFrom,
                to: this.state.filter.shiftDateTo
            })
        this.handleFilterParamsChange(scheduleId)
    }

    getQueryParams() {
        let filter = this.getFilterFromUrl();
        let queryString = this.queryString;

        queryString.from = this.state.filter.shiftDateFrom;
        queryString.to = this.state.filter.shiftDateTo

        return {
            scheduleId: Number(this.props.params.scheduleId),
            queryEmployeeSchedules: queryString
        };
    }

    getEmployeeScheduleParams() {
        return {
            scheduleId: Number(this.props.params.scheduleId),
            params: {
                scheduleId: this.props.schedule.id,
                from: this.state.filter.shiftDateFrom,
                to: this.state.filter.shiftDateTo
            },
            mappingData: {
                schedule: this.props.schedule,
                scheduleSubGroups: this.props.scheduleSubGroups,
                managedGroups: this.props.managedGroups
            }
        };
    }


    renderView() {
        switch (this.state.filter.modeView) {
            case MODEVIEW.SHIFT: {
                let days = dateHelper.generateDays(this.state.filter.shiftDateFrom, this.state.filter.shiftDateTo);
                return (
                    <ScheduleShiftView
                        days={days}
                        schedule={this.props.schedule}
                        jobRoles={this.props.jobRoles}
                        shiftTemplates={this.props.shiftTemplates}
                        scheduleShiftView={this.props.scheduleShiftView}
                        managedGroups={this.props.managedGroups}
                        employeesToAssign={this.props.employeesToAssign}
                        getEmployeeScheduleParams={this.getEmployeeScheduleParams}
                        loadManagedGroups={this.props.loadManagedGroups}
                        loadEmployeeAssigns={this.props.loadEmployeeAssigns}
                        loadEmployeSchedules={this.props.loadEmployeSchedules}
                        dateRange={{ from: this.state.filter.shiftDateFrom, to: this.state.filter.shiftDateTo }}
                    />
                );
            }
            case MODEVIEW.EMPLOYEE:
                return null;
        }
    }

    renderValueComponent(labelPrefix, option) {
        return (
            <div className="Select-value" >
                <span className="Select-value-label" role="option" aria-selected="true" >
                    <span className="select-value-label-normal"> {labelPrefix}: </span>
                    {option.value.label}
                </span>
            </div>
        );
    }
    handleSubmitCopySchedule = (data) => {
        LoadingIndicatorActions.showAppLoadingIndicator();
        scheduleActions.copyScheduleShifts(this.props.schedule.id, data, (err) => {
            !err && this.dialogCopySchedule.close();
            this.handleCallBackAction(err);
        });
    }

    render() {
        let linkBreadcrumb = [{
            key: RS.getString("SCHEDULES"),
            value: getUrlPath(URL.SCHEDULES)
        }];
        const status = this.props.scheduleShiftView.status;
        let contracts = _.filter(this.props.contracts, x => x.status != CONTRACT_STATUS.DRAFT);
        let contract = _.find(this.props.contracts, x => x.id == _.get(this.props.schedule, "contract.id")) || []
        let locations = _.map(contract.schedules, x => x.location);
        let schedulePeriods = getSchedulePeriod();
        let actionConfirmRemoveAll = [
            <RaisedButton
                key={0}
                label={RS.getString("NO")}
                onClick={() => { this.setState({ isOpenConfirmationRemoveAll: false }); }}
                className="raised-button-fourth"
            />,
            <RaisedButton
                key={1}
                label={RS.getString("YES")}
                onClick={this.handleConfirmRemoveAll}
            />
        ];
        const isCopySchedule = this.props.scheduleShiftView.status.missing == 0
            && this.state.filter.schedulePeriod != TIMESPAN.MONTH
            && (!(this.props.schedule.startDate && this.props.schedule.endDate) ||
                (this.props.schedule.startDate.getTime() <= this.state.filter.shiftDateFrom.getTime()
                    && this.props.schedule.endDate.getTime() >= this.state.filter.shiftDateTo.getTime()))
        const isDelete = this.state.filter.shiftDateTo < new Date();
        return (
            <div className="page-container schedule-detail">
                <div className="header">
                    {RS.getString('SCHEDULE')}
                </div>
                <Breadcrumb link={linkBreadcrumb} />
                <div className="row row-filter">
                    <div className="col-md float-left">
                        <div className="group-value">
                            <div className="text-view">
                                <div className="title">{RS.getString('SCHEDULE_NAME')}:</div>
                                <div className="value">{_.get(this.props.schedule, 'name', '')}</div>
                            </div>
                            <div className="text-view">
                                <div className="title">{RS.getString('LOCATION')}:</div>
                                <div className="value">{_.get(this.props.schedule, 'location.name', '')}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <CommonSelect
                            propertyItem={{ label: 'label', value: 'value' }}
                            options={schedulePeriods}
                            allowOptionAll={false}
                            clearable={false}
                            value={this.state.filter.schedulePeriod}
                            onChange={this.handleFilterSchedule.bind(this, "schedulePeriod")}
                            valueComponent={this.renderValueComponent.bind(this, RS.getString("DURATION"))}
                        />
                    </div>
                    <div className="employees-actions-group">
                        <RaisedButton
                            label={RS.getString('NOTIFY', null, Option.CAPEACHWORD)}
                            onClick={() => this.setState({ isOpenConfirmNotify: true })}
                        />
                    </div>
                </div>
                <div className="row row-action">
                    <div className="col-md-6">
                        <TimeSlider
                            startDate={this.state.filter.shiftDateFrom}
                            endDate={this.state.filter.shiftDateTo}
                            onChange={(from, to) => this.changeShiftDate(from, to)}
                            timeSpan={this.state.filter.schedulePeriod}
                        />
                    </div>
                    <div className="employees-actions-group">
                        <RaisedButton
                            className="raised-button-third-secondary"
                            label={RS.getString('REMOVE_ALL', null, Option.CAPEACHWORD)}
                            onClick={this.handleRemoveAllScheduling}
                            disabled={isDelete}
                        />
                        <RaisedButton
                            className="raised-button-first-secondary"
                            label={RS.getString('COPY', null, Option.CAPEACHWORD)}
                            onClick={() => { this.dialogCopySchedule.open() }}
                            disabled={isCopySchedule}
                        />
                        <RaisedButton
                            className="raised-button-first-secondary"
                            label={RS.getString('PRINT', null, Option.CAPEACHWORD)}
                        />
                    </div>
                </div>
                {this.renderView()}
                <div className="status-sumary">
                    <div className="status error" /><span><strong>{status.error}</strong> {RS.getString('STATUS_REQUIRE_ACTION')}</span>
                    <i className="status missing" aria-hidden="true" /><span><strong>{status.missing}</strong> {RS.getString('TO_BE_ASSIGNED')}</span>
                    <div className="status tobenotify" /><span><strong>{status.toBeNofity}</strong> {RS.getString('TO_BE_NOTIFIED')}</span>
                    <div className="status overtime-flag">{RS.getString('OT')}</div><span><strong>{status.pending}</strong> {RS.getString('STATUS_PENDING_OVERTIME')}</span>
                    <i className="status assignees-status fa fa-user" /><span><strong>{status.assigned}</strong> {RS.getString('ASSIGNEES')}</span>
                </div>
                <DialogCopySchedule
                    ref={(dialogCopySchedule) => this.dialogCopySchedule = dialogCopySchedule}
                    dateRangeCopy={{
                        start: this.state.filter.shiftDateFrom,
                        end: this.state.filter.shiftDateTo
                    }}
                    schedule={this.props.schedule}
                    rangeScheduleValue={this.state.filter.schedulePeriod}
                    handleSubmitCopySchedule={this.handleSubmitCopySchedule}
                />
                <DialogAlert
                    modal={true}
                    icon={require("../../../images/info-icon.png")}
                    isOpen={this.state.isOpenConfirmationRemoveAll}
                    title={RS.getString('CONFIRMATION')}
                    actions={actionConfirmRemoveAll}
                    handleClose={() => this.setState({ isOpenConfirmationRemoveAll: false })}
                >
                    <div
                        dangerouslySetInnerHTML={{
                            __html: `${RS.getString('P133')}`
                        }}
                    />
                </DialogAlert>
                <DialogAlert
                    icon={require("../../../images/infoIcon.png")}
                    isOpen={this.state.isOpenConfirmNotify}
                    title={RS.getString("CONFIRMATION")}
                    actions={[
                        <RaisedButton
                            key={1}
                            label={RS.getString("NO")}
                            onClick={() => { this.setState({ isOpenConfirmNotify: false }) }}
                            className="raised-button-fourth"
                        />,
                        <RaisedButton
                            key={0}
                            label={RS.getString("YES")}
                            onClick={() => { showAppLoadingIndicator(); scheduleActions.notifyScheudle(this.props.schedule.id, this.handleCallBackNotify) }}
                        />
                    ]}
                    handleClose={() => { this.setState({ isOpenConfirmNotify: false }) }}
                >
                    <span> {RS.getString("P145")}</span>
                </DialogAlert>
            </div>
        )
    }
}
ScheduleDetail.propTypes = propTypes;
export default ScheduleDetail;