import React, { PropTypes } from 'react';
import _ from 'lodash';

import RS, { Option } from '../../../resources/resourceManager';
import RaisedButton from '../../elements/RaisedButton';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import DialogEmployeeTransfer from './DialogEmployeeTransfer';

import { DATE } from '../../../core/common/constants';
import dateHelper from '../../../utils/dateHelper';
import * as loadingIndicatorActions from '../../../utils/loadingIndicatorActions';

let EmployeeTransfer = React.createClass({
    propTypes: {
        employeeTransfers: PropTypes.array,
        transferEmployee: PropTypes.func,
        groups: PropTypes.array,
        employeeId: PropTypes.string,
        payload: PropTypes.object,
        loadEmployeeTransfers: PropTypes.func,
        contactDetail: PropTypes.object
    },

    getInitialState: function () {
        return {
            isOpenDialogTransfer: false
        };
    },

    componentDidUpdate: function () {
        loadingIndicatorActions.hideAppLoadingIndicator();
        if (this.props.payload.success) {
            this.setState({ isOpenDialogTransfer: false });
            this.props.loadEmployeeTransfers(this.props.employeeId);
        }
    },

    handleNewTransfer: function () {
        this.setState({
            isOpenDialogTransfer: true
        });
    },

    handleTransferEmployee: function (employeeTransfer) {
        loadingIndicatorActions.showAppLoadingIndicator();
        this.props.transferEmployee(this.props.employeeId, employeeTransfer);
    },

    renderEmployeeTransfer: function () {
        const { employeeTransfers } = this.props;
        return (
            <div className="content-position">
                <div className="text-right">
                    <RaisedButton
                        className="raised-button-first-secondary"
                        label={RS.getString('NEW_TRANSFER', null, Option.CAPEACHWORD)}
                        onClick={this.handleNewTransfer}
                    />
                </div>
                <table className="metro-table">
                    <MyHeader>
                        <MyRowHeader>
                            <MyTableHeader>{RS.getString('GROUP')}</MyTableHeader>
                            <MyTableHeader>{RS.getString('REPORT_TO')}</MyTableHeader>
                            <MyTableHeader>{RS.getString('START_FROM')}</MyTableHeader>
                            <MyTableHeader>{RS.getString('NOTES')}</MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {
                            employeeTransfers ?
                                employeeTransfers.map(function (item, index) {
                                    const photoUrl = _.get(item.group.supervisor, 'photoUrl', '');
                                    return (
                                        <tr key={index}>
                                            <td >
                                                {item.group.name}
                                            </td>
                                            <td className="primary-avatar-cell">
                                                <img
                                                    src={photoUrl ? (API_FILE + photoUrl) : require("../../../images/avatarDefault.png")} />
                                                <div className="cell-content">
                                                    <div className="main-label">
                                                        {item.group.supervisor.fullName}
                                                    </div>
                                                </div>
                                            </td>
                                            <td >
                                                {dateHelper.formatTimeWithPattern(item.startDate, DATE.FORMAT)}
                                            </td>
                                            <td >
                                                {item.notes}
                                            </td>
                                        </tr>
                                    );
                                }.bind(this)) : []
                        }
                    </tbody>
                </table>
            </div>
        );
    },

    render: function () {
        let startDate = this.props.contactDetail.startDate;
        let endDate = this.props.contactDetail.endDate;
        return (
            <div className="employee-transfer">
                {this.renderEmployeeTransfer()}
                <DialogEmployeeTransfer
                    isOpen={this.state.isOpenDialogTransfer}
                    handleCancel={() => this.setState({ isOpenDialogTransfer: false })}
                    label={[RS.getString('SAVE'), RS.getString('CANCEL')]}
                    handleTransferEmployee={this.handleTransferEmployee}
                    groups={this.props.groups}
                    startDate={startDate}
                    endDate={endDate}
                />
            </div>
        );
    }
});

export default EmployeeTransfer;