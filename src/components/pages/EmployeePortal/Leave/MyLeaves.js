import React, { PropTypes } from 'react';
import _ from 'lodash';
import RaisedButton from '../../../elements/RaisedButton';
import ItemsDisplayPerPage from '../../../elements/ItemsDisplayPerPage';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import RS from '../../../../resources/resourceManager';
import Pagination from '../../../elements/Paginate/Pagination'
import * as toastr from '../../../../utils/toastr';
import RIGHTS from '../../../../constants/rights';
import { STATUS, QUERY_STRING } from '../../../../core/common/constants';
import DialogViewLeaveDetail from './DialogViewLeaveDetail';
import DialogAlert from '../../../elements/DialogAlert';
import DialogNewLeave from './DialogNewLeave';
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';
import * as leaveActions from '../../../../actionsv2/leaveActions';

const propTypes = {
  leaveActions: PropTypes.object,
  payload: PropTypes.object,
  globalAction: PropTypes.object
};

class MyLeaves extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myLeaves: [],
      leave: {},
      isOpenLeaveDetail: false,
      isOpenCancelLeave: false
    };
    this.queryString = {
      order_by: 'createdDate',
      is_desc: true,
      page_size: QUERY_STRING.PAGE_SIZE,
      page: 0
    };
    this.leaveSelected = null;
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleChangeDisplayPerPage = this.handleChangeDisplayPerPage.bind(this);
    this.handleOnClickLeave = this.handleOnClickLeave.bind(this);
    this.handleClickCancelLeave = this.handleClickCancelLeave.bind(this);
    this.handleSubmitCancelLeave = this.handleSubmitCancelLeave.bind(this);
    this.handleSubmitLeaveSuccess = this.handleSubmitLeaveSuccess.bind(this);
  }

  componentDidMount() {
    LoadingIndicatorActions.showAppLoadingIndicator();
    leaveActions.loadMyLeaves(this.queryString, (err, result, meta) => this.handleCallbackAction(err, result, meta, 'myLeaves'));
  }

  handleCallbackAction(err, result, meta, field) {
    if (err) {
      toastr.error(RS.getString(err.message), RS.getString('ERROR'));
      this.setState({
        isOpenCancelLeave: false,
        isOpenDialogAddLeave: false
      });
      LoadingIndicatorActions.hideAppLoadingIndicator();
      return;
    }
    switch (field) {
      case 'myLeaves':
        this.setState({ myLeaves: result, meta: meta }, LoadingIndicatorActions.hideAppLoadingIndicator);
        break;
      case 'leave':
        this.setState({ leave: result }, LoadingIndicatorActions.hideAppLoadingIndicator);
        break;
      case 'updatedLeave':
        this.setState({ leave: {}, isOpenCancelLeave: false });
        toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
        leaveActions.loadMyLeaves(this.queryString, (err, result, meta) => this.handleCallbackAction(err, result, meta, 'myLeaves'));
    }
  }

  handlePageClick(page) {
    this.queryString.page = page - 1;
    LoadingIndicatorActions.showAppLoadingIndicator();
    leaveActions.loadMyLeaves(this.queryString, (err, result, meta) => this.handleCallbackAction(err, result, meta, 'myLeaves'));
  }

  handleChangeDisplayPerPage(pageSize) {
    this.queryString.page_size = pageSize;
    LoadingIndicatorActions.showAppLoadingIndicator();
    leaveActions.loadMyLeaves(this.queryString, (err, result, meta) => this.handleCallbackAction(err, result, meta, 'myLeaves'));
  }

  handleOnClickLeave(leaveId) {
    this.setState({
      isOpenLeaveDetail: true
    });
    LoadingIndicatorActions.showAppLoadingIndicator();
    leaveActions.loadLeave(leaveId, (err, result) => this.handleCallbackAction(err, result, null, 'leave'));
  }

  handleClickCancelLeave(leave, e) {
    e.stopPropagation();
    this.setState({
      isOpenCancelLeave: true
    });
    this.leaveSelected = _.cloneDeep(leave);
  }

  handleSubmitCancelLeave() {
    this.leaveSelected.leaveStatus = STATUS.CANCELED;
    LoadingIndicatorActions.showAppLoadingIndicator();
    leaveActions.updateLeave(this.leaveSelected.id, this.leaveSelected, (err, result) => this.handleCallbackAction(err, result, null, 'updatedLeave'));
  }

  handleSubmitLeaveSuccess(){
    this.setState({isOpenDialogAddLeave: false});
    leaveActions.loadMyLeaves(this.queryString, (err, result, meta) => this.handleCallbackAction(err, result, meta, 'myLeaves'));
  }

  render() {
    let actionAlert = [
      <RaisedButton
        key={0}
        label={RS.getString("CANCEL")}
        onClick={() => { this.setState({ isOpenCancelLeave: false }) }}
        className="raised-button-fourth"
      />,
      <RaisedButton
        key={1}
        label={RS.getString("CONFIRM")}
        onClick={this.handleSubmitCancelLeave}
      />
    ]
    return (
      <div className="page-container my-leaves">
        <div className="header">
          {RS.getString('MY_LEAVES')}
        </div>
        <div className="row row-header">
          <div className="employees-actions-group">
            {
              this.props.curEmp.rights.find(x => x == RIGHTS.CREATE_LEAVE) ?
                <RaisedButton
                  label={RS.getString('NEW_LEAVE', null, Option.CAPEACHWORD)}
                  onClick={() => this.setState({ isOpenDialogAddLeave: true })}
                /> : null
            }
          </div>
        </div>
        <div className="row row-body">
          <table className="metro-table">
            <MyHeader>
              <MyRowHeader>
                <MyTableHeader>{RS.getString('LEAVE_TYPE')}</MyTableHeader>
                <MyTableHeader>{RS.getString('START')}</MyTableHeader>
                <MyTableHeader>{RS.getString('END')}</MyTableHeader>
                <MyTableHeader>{RS.getString('LEAVE_HOURS')}</MyTableHeader>
                <MyTableHeader>{RS.getString('STATUS')}</MyTableHeader>
                <MyTableHeader>{RS.getString('ACTION')}</MyTableHeader>
              </MyRowHeader>
            </MyHeader>
            <tbody>
              {this.state.myLeaves ? this.state.myLeaves.map(function (leave) {
                return (
                  <tr key={leave.id} onClick={this.handleOnClickLeave.bind(this, leave.id)}>
                    <td>
                      {leave.leaveType.name}
                    </td>
                    <td>
                      {leave.leaveFromString}
                    </td>
                    <td>
                      {leave.leaveToString}
                    </td>
                    <td>
                      {leave.leaveHours || "0.0"}
                    </td>
                    <td>
                      <div className={"status " + leave.leaveStatus}>
                        {leave.leaveStatus}
                      </div>
                    </td>
                    <td className="action-cell one-action">
                      {
                        leave.leaveStatus == STATUS.PENDING ?
                          <i
                            onClick={this.handleClickCancelLeave.bind(this, leave)}
                            className="icon-close"
                            data-toggle="tooltip"
                            title={RS.getString('P120')}
                          /> : null
                      }
                    </td>
                  </tr>
                )
              }.bind(this)) : []}
            </tbody>
          </table>

          {
            this.state.meta != null && this.state.meta.count > 0 ?
              <div className="listing-footer">
                <div className="pull-left">
                  <ItemsDisplayPerPage
                    name="ItemsDisplayPerPage"
                    value={this.queryString.page_size}
                    totalRecord={this.state.meta.count}
                    onChange={this.handleChangeDisplayPerPage}
                  />
                </div>

                <div className="pull-right">
                  {
                    this.state.meta.count > this.queryString.page_size ?
                      <Pagination
                        firstPageText={<i className="fa fa-angle-double-left" aria-hidden="true"></i>}
                        lastPageText={<i className="fa fa-angle-double-right" aria-hidden="true"></i>}
                        prevPageText={<i className="fa fa-angle-left" aria-hidden="true"></i>}
                        nextPageText={<i className="fa fa-angle-right" aria-hidden="true"></i>}
                        activePage={this.queryString.page + 1}
                        itemsCountPerPage={this.queryString.page_size}
                        totalItemsCount={this.state.meta.count}
                        onChange={this.handlePageClick}
                      /> : undefined
                  }

                </div>
              </div>
              : null
          }
        </div>
        <DialogViewLeaveDetail
          isOpen={this.state.isOpenLeaveDetail}
          leave={this.state.leave}
          handleClose={() => this.setState({ isOpenLeaveDetail: false })}
        />
        <DialogNewLeave
          leaveBalances={this.props.leaveBalances}
          leaveHours={this.props.leaveHours}
          leaveActions={this.props.leaveActions}
          approvers={this.props.approvers}
          getApprovers={this.props.getApprovers}
          isOpen={this.state.isOpenDialogAddLeave}
          handleClose={() => this.setState({ isOpenDialogAddLeave: false })}
          handleSubmitSuccess  = {this.handleSubmitLeaveSuccess}
        />
        <DialogAlert
          modal={false}
          icon={require("../../../../images/info-icon.png")}
          isOpen={this.state.isOpenCancelLeave}
          title={RS.getString('CONFIRMATION')}
          handleClose={() => { this.setState({ isOpenCancelLeave: false }) }}
          actions={actionAlert}
        >
          {RS.getString("P129")}
        </DialogAlert>
      </div>
    );
  }
}

MyLeaves.propTypes = propTypes;
export default MyLeaves;
