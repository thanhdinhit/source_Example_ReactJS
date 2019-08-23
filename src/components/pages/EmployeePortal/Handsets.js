import React, { PropTypes } from 'react';
import * as toastr from 'toastr';
import RS, { Option } from '../../../resources/resourceManager';
import { API } from '../../../core/common/app.routes';
import RaisedButton from '../../elements/RaisedButton';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import DialogReturnHandset from './DialogReturnHandsets';
import dateHelper from '../../../utils/dateHelper';
import AssignHandsetContainer from '../../../containers/EmployeePortal/AssignHandsetContainer';
import _ from 'lodash';

let Handsets = React.createClass({
    propTypes: {
        handsets: PropTypes.array,
        payload: PropTypes.object,
        resetError: PropTypes.func,
        resetState: PropTypes.func,
        employee: PropTypes.object
    },

    getInitialState: function () {
        return {
            isOpenReturnHandsetDialog: false,
            isOpenAssignHandset: false
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.payload.success) {
            this.setState({ isOpenAssignHandset: false });
        }
    },

    componentDidUpdate: function () {
        if (this.props.payload.success) {
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
            this.props.loadEmployeeHandsets(this.props.curEmp.employeeId);
            this.props.resetState();
        }
        if (this.props.payload.error.message != '' || this.props.payload.error.exception) {
            toastr.error(this.props.payload.error.message, RS.getString('ERROR'))
            this.props.resetError();
        }
    },

    handleOpenReturnHandsetsDialog: function (item) {
        this.setState({ isOpenReturnHandsetDialog: true, curHandset: item });
    },

    handleCloseReturnHandsetsDialog: function () {
        this.setState({ isOpenReturnHandsetDialog: false, curHandset: null });
    },

    render: function () {
        const { handsets } = this.props;
        return (
            <div className="employee-handsets">
                <div className="content-position">
                    <div className="text-right">
                        <RaisedButton
                            label={RS.getString('ASSIGN_HANDSET')}
                            onClick={() => this.setState({ isOpenAssignHandset: true })}
                            className="raised-button-first-secondary"
                        />
                    </div>
                    <table className="metro-table">
                        <MyHeader>
                            <MyRowHeader>
                                <MyTableHeader>{RS.getString('HANDSET_TYPE')}</MyTableHeader>
                                <MyTableHeader>{RS.getString('HANDSET_ID')}</MyTableHeader>
                                <MyTableHeader>{RS.getString('IMEI')}</MyTableHeader>
                                <MyTableHeader>{RS.getString('SERIAL_NUMBER')}</MyTableHeader>
                                <MyTableHeader>{RS.getString('ASSIGNED_DATE')}</MyTableHeader>
                                {
                                    this.props.isEdit &&
                                    <MyTableHeader className="action-cell one-action">{RS.getString('ACTION')}</MyTableHeader>
                                }

                            </MyRowHeader>
                        </MyHeader>
                        <tbody>
                            {
                                handsets ?
                                    handsets.map(function (item, index) {
                                        return (
                                            <tr key={index}>
                                                <td >
                                                    {_.get(item, 'type.type', '')}
                                                </td>
                                                <td >
                                                    {item.identifier}
                                                </td>
                                                <td >
                                                    {item.imei}
                                                </td>
                                                <td >
                                                    {item.serialNumber}
                                                </td>
                                                <td >
                                                    {item.lastUpdatedStatusDate ? dateHelper.handleFormatDateAsian(item.lastUpdatedStatusDate) : ''}
                                                </td>
                                                {
                                                    this.props.isEdit &&
                                                    <td className="action-cell one-action">
                                                        <i className="icon-return"
                                                            onClick={this.handleOpenReturnHandsetsDialog.bind(this, item)}
                                                            data-toggle="tooltip"
                                                            title={RS.getString('RETURN_TO_STOCK',null,Option.LOWER)}
                                                        />
                                                    </td>
                                                }
                                            </tr>
                                        );
                                    }.bind(this)) : []
                            }
                        </tbody>
                    </table>
                </div>
                <DialogReturnHandset
                    isOpen={this.state.isOpenReturnHandsetDialog}
                    title={RS.getString('RETURN_TO_STOCK', null, Option.UPPER)}
                    handset={this.state.curHandset}
                    employee={this.props.employee}
                    employeeInfo={this.props.employeeInfo}
                    handleSave={this.props.returnHandset}
                    handleCancel={this.handleCloseReturnHandsetsDialog}
                />
                <AssignHandsetContainer
                    isOpen={this.state.isOpenAssignHandset}
                    handleClose={() => this.setState({ isOpenAssignHandset: false })}
                />
            </div>
        );
    },

});

export default Handsets;