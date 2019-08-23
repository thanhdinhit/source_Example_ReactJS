import React from 'react'
import RaisedButton from '../../../elements/RaisedButton';
import Breadcrumb from '../../../elements/Breadcrumb';
import { browserHistory } from 'react-router'
import ItemsDisplayPerPage from '../../../elements/ItemsDisplayPerPage';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { URL } from '../../../../core/common/app.routes';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import RS from '../../../../resources/resourceManager';
import Pagination from '../../../elements/Paginate/Pagination'
import * as toastr from '../../../../utils/toastr';
import RIGHTS from '../../../../constants/rights';
import {
    STATUS, WAITING_TIME, FILTER_DATE, YEAR_LIMIT_DELTA, TIMEFORMAT, getOvertimeStatusOptions,
    QUERY_STRING
} from '../../../../core/common/constants';
import CommonSelect from '../../../elements/CommonSelect.component';
import debounceHelper from '../../../../utils/debounceHelper';
import dateHelper from '../../../../utils/dateHelper'
import * as apiHelper from '../../../../utils/apiHelper'
import FilterDateTime from '../../../elements/Filter/FilterDateTime';
import ShowHideColumn from '../../../elements/table/ShowHideColumn';
import DialogOvertimeActions from './DialogOvertimeActions';
import { OVERTIME_ACTION_TYPE } from '../../../../core/common/constants';
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';

const redirect = getUrlPath(URL.OVERTIME);
class MyOvertime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                filterStatus: 'Pending'
            },
            columns: this.getInitialColumns(),
            isOpen: false
        }
        this.queryString = {
            order_by: 'overtimeFrom',
            is_desc: true,
            page_size: QUERY_STRING.PAGE_SIZE,
            page: 0,
            overtimeStatus: 'Pending'
        };

        if (!_.isEmpty(props.queryString)) this.queryString = props.queryString;
        if (!_.isEmpty(props.filter)) this.state.filter = _.cloneDeep(props.filter);

        this.overtimeSelected = null;
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleChangeDisplayPerPage = this.handleChangeDisplayPerPage.bind(this);
        this.handleShowHideColumns = this.handleShowHideColumns.bind(this);
        this.handleFilterStatus = this.handleFilterStatus.bind(this);
        this.handleDeclineOvertimeRquest = this.handleDeclineOvertimeRquest.bind(this);
        this.handleSubmitDeclineOvertime = this.handleSubmitDeclineOvertime.bind(this);
        this.handleAcceptedOvertimeRquest = this.handleAcceptedOvertimeRquest.bind(this);
    }

    componentDidMount() {
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.overtimeActions.loadMyOvertimes(this.queryString, redirect);
    }

    componentWillReceiveProps(nextProps) {
        LoadingIndicatorActions.hideAppLoadingIndicator();
        if (nextProps.payload.success) {
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'))
            this.props.globalAction.resetState();
            this.props.overtimeActions.loadMyOvertimes(this.queryString, redirect);
        }
        if (nextProps.payload.error.message != '' || nextProps.payload.error.exception) {
            toastr.error(nextProps.payload.error.message, RS.getString('ERROR'))
            this.props.globalAction.resetError();
        }
    }

    getInitialColumns() {
        return [{
            name: 'overtimeFrom',
            label: RS.getString('START'),
            show: true
        }, {
            name: 'overtimeTo',
            label: RS.getString('END'),
            show: true
        }, {
            name: 'location',
            label: RS.getString('LOCATION'),
            show: true
        }, {
            name: 'requestedBy',
            label: RS.getString('REQUESTED_BY'),
            show: false
        }, {
            name: 'payRate',
            label: RS.getString('PAY_RATE'),
            show: false
        }, {
            name: 'comment',
            label: RS.getString('COMMENT'),
            show: false
        }, {
            name: 'contractId',
            label: RS.getString('CONTRACT_ID'),
            show: false
        }, {
            name: 'status',
            label: RS.getString('STATUS'),
            show: true
        }];
    }

    handlePageClick(page) {
        this.queryString.page = page - 1;
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.overtimeActions.loadMyOvertimes(this.queryString, redirect);
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString);
    }

    handleChangeDisplayPerPage(pageSize) {
        this.queryString.page_size = pageSize;
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.overtimeActions.loadMyOvertimes(this.queryString, redirect);
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString);
    }

    handleShowHideColumns(columns) {
        this.setState({ columns });
    }

    handleFilterStatus(option) {
        option = option || {};
        this.setState({
            filter: {
                filterStatus: option.value
            }
        }, () => {
            this.props.onchangeFilter && this.props.onchangeFilter(_.cloneDeep(this.state.filter));
        });
        this.queryString.overtimeStatus = option.value;
        if (!option.value) {
            _.unset(this.queryString, 'overtimeStatus');
        }
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.overtimeActions.loadMyOvertimes(this.queryString, redirect);
        this.props.onChangeQueryString && this.props.onChangeQueryString(this.queryString);
    }

    handleDeclineOvertimeRquest(overtime, e) {
        e.stopPropagation();
        this.setState({
            isOpen: true
        });
        this.overtimeSelected = _.cloneDeep(overtime);
    }

    handleSubmitDeclineOvertime(reason) {
        this.overtimeSelected.commentDeclinedOrCanceled = reason;
        this.overtimeSelected.overtimeStatus = STATUS.DECLINED;
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.overtimeActions.updateOvertime(this.overtimeSelected.id, this.overtimeSelected);
        this.setState({
            isOpen: false
        });
    }

    handleAcceptedOvertimeRquest(overtime) {
        this.overtimeSelected = _.cloneDeep(overtime);
        this.overtimeSelected.overtimeStatus = STATUS.ACCEPTED;
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.overtimeActions.updateOvertime(this.overtimeSelected.id, this.overtimeSelected);
    }
    renderValueComponent(option) {
        return (
            <div className="Select-value">
                <span className="Select-value-label" role="option" aria-selected="true" >
                    <span className="select-value-label-normal"> {RS.getString('STATUS')}: </span>
                    {option.value.label}
                </span>
            </div>
        )
    }
    render() {
        let columns = _.keyBy(this.state.columns, 'name');
        return (
            <div className="my-overtimes">
                <div className="row-header">
                    <div className="filter-status">
                        <CommonSelect
                            options={getOvertimeStatusOptions()}
                            allowOptionAll={true}
                            optionAllText={RS.getString('ALL')}
                            value={this.state.filter.filterStatus}
                            onChange={this.handleFilterStatus}
                            valueComponent={this.renderValueComponent}
                        />
                    </div>
                    <div className="pull-right">
                        <ShowHideColumn
                            columns={this.state.columns}
                            onChange={this.handleShowHideColumns}
                        />
                    </div>
                </div>
                <table className="metro-table">
                    <MyHeader>
                        <MyRowHeader>
                            <MyTableHeader
                                show={columns['overtimeFrom'].show}
                            >
                                {RS.getString("START")}
                            </MyTableHeader>
                            <MyTableHeader
                                show={columns['overtimeTo'].show}
                            >
                                {RS.getString("END")}
                            </MyTableHeader>
                            <MyTableHeader
                                show={columns['location'].show}
                            >
                                {RS.getString("LOCATION")}
                            </MyTableHeader>
                            <MyTableHeader
                                show={columns['requestedBy'].show}
                            >
                                {RS.getString("REQUESTED_BY")}
                            </MyTableHeader>
                            <MyTableHeader
                                show={columns['payRate'].show}
                            >
                                {RS.getString("PAY_RATE")}
                            </MyTableHeader>
                            <MyTableHeader
                                show={columns['comment'].show}
                            >
                                {RS.getString("COMMENT")}
                            </MyTableHeader>
                            <MyTableHeader
                                show={columns['contractId'].show}
                            >
                                {RS.getString("CONTRACT_ID")}
                            </MyTableHeader>
                            <MyTableHeader
                                show={columns['status'].show}
                            >
                                {RS.getString("STATUS")}
                            </MyTableHeader>
                            <MyTableHeader className="column-action">{RS.getString("ACTION")}</MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {
                            _.map(this.props.myOvertimes, function (ot) {
                                let overtimeStatus = '';
                                switch (ot.overtimeStatus) {
                                    case STATUS.PENDING:
                                        overtimeStatus = RS.getString('STATUS_PENDING');
                                        break;
                                    case STATUS.CANCELED:
                                        overtimeStatus = RS.getString('STATUS_CANCELED');
                                        break;
                                    case STATUS.DECLINED:
                                        overtimeStatus = RS.getString('STATUS_DECLINED');
                                        break;
                                    case STATUS.ACCEPTED:
                                        overtimeStatus = RS.getString('STATUS_ACCEPTED');
                                        break;
                                }
                                return (
                                    <tr key={ot.id}>
                                        {
                                            columns['overtimeFrom'].show &&
                                            <td >
                                                {ot.overtimeFrom ? dateHelper.formatTimeWithPattern(ot.overtimeFrom, TIMEFORMAT.OVERTIME) : ''}
                                            </td>
                                        }
                                        {
                                            columns['overtimeTo'].show &&
                                            <td >
                                                {ot.overtimeTo ? dateHelper.formatTimeWithPattern(ot.overtimeTo, TIMEFORMAT.OVERTIME) : ''}
                                            </td>
                                        }
                                        {
                                            columns['location'].show &&
                                            <td >
                                                {_.get(ot, 'location.name')}
                                            </td>
                                        }
                                        {
                                            columns['requestedBy'].show &&
                                            <td className="primary-avatar-cell">
                                                <img src={ot.manager.photoUrl ? (API_FILE + ot.manager.photoUrl) : require("../../../../images/avatarDefault.png")} />
                                                <div className="cell-content">
                                                    <div className="main-label">
                                                        {_.get(ot, 'manager.fullName')}
                                                    </div>
                                                </div>
                                            </td>
                                        }
                                        {
                                            columns['payRate'].show &&
                                            <td >
                                                {_.get(ot, 'payRate.name')}
                                            </td>
                                        }
                                        {
                                            columns['comment'].show &&
                                            <td >
                                                {_.get(ot, 'comment')}
                                            </td>
                                        }
                                        {
                                            columns['contractId'].show &&
                                            <td >
                                                {_.get(ot, 'contract.id')}
                                            </td>
                                        }
                                        {
                                            columns['status'].show &&
                                            <td>
                                                <div className={"status " + ot.overtimeStatus}>
                                                    {overtimeStatus}
                                                </div>
                                            </td>
                                        }
                                        <td className="col-action">
                                            {
                                                ot.overtimeStatus == STATUS.PENDING ?
                                                    <span>
                                                        <i
                                                            onClick={this.handleAcceptedOvertimeRquest.bind(this, ot)}
                                                            className="icon-approve"
                                                            data-toggle="tooltip"
                                                            title={RS.getString('P124')}
                                                        />
                                                        <i
                                                            onClick={this.handleDeclineOvertimeRquest.bind(this, ot)}
                                                            className="icon-decline"
                                                            data-toggle="tooltip"
                                                            title={RS.getString('P125')}
                                                        />
                                                    </span> : null
                                            }
                                        </td>
                                    </tr>
                                );

                            }.bind(this))
                        }
                    </tbody>
                </table>

                {
                    this.props.meta != null && this.props.meta.count > 0 ?
                        <div className="listing-footer">
                            {/* <div className="pull-left">
                                <ItemsDisplayPerPage
                                    name="ItemsDisplayPerPage"
                                    value={this.queryString.page_size}
                                    totalRecord={this.props.meta.count}
                                    onChange={this.handleChangeDisplayPerPage}
                                />
                            </div> */}
                            <div className="pull-right">
                                {
                                    this.props.meta.count > this.queryString.page_size ?
                                        <Pagination
                                            firstPageText={<i className="fa fa-angle-double-left" aria-hidden="true"></i>}
                                            lastPageText={<i className="fa fa-angle-double-right" aria-hidden="true"></i>}
                                            prevPageText={<i className="fa fa-angle-left" aria-hidden="true"></i>}
                                            nextPageText={<i className="fa fa-angle-right" aria-hidden="true"></i>}
                                            activePage={this.queryString.page + 1}
                                            itemsCountPerPage={this.queryString.page_size}
                                            totalItemsCount={this.props.meta.count}
                                            onChange={this.handlePageClick}
                                        /> : null
                                }
                            </div>
                            <DialogOvertimeActions
                                isOpen={this.state.isOpen}
                                handleClose={() => this.setState({ isOpen: false })}
                                handleSubmit={this.handleSubmitDeclineOvertime}
                                actionType={OVERTIME_ACTION_TYPE.DECLINE}
                            />
                        </div>
                        : null
                }
            </div>
        )
    }
}

export default MyOvertime;