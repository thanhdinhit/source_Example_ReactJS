import React, { PropTypes } from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import Overlay from 'react-bootstrap/lib/Overlay';
import moment from 'moment';

import RS from '../../../../resources/resourceManager';
import fieldValidations from '../../../../validation/common.field.validation';
import CommonDatePicker from '../../../elements/DatePicker/CommonDatePicker';
import CommonSelect from '../../../elements/CommonSelect.component';
import DialogAddRole from '../../../elements/Dialog';
import RaisedButton from '../../../elements/RaisedButton';
import NumberInput from '../../../elements/NumberInput';
import DateHelper from '../../../../utils/dateHelper';
import { DATETIME } from '../../../../core/common/constants';

import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';

class CustomPopover extends React.Component {
    constructor(props) {
        super(props);
        this.renderNumberRequiredEmployees = this.renderNumberRequiredEmployees.bind(this);
    }

    renderNumberRequiredEmployees(jobRoles) {
        let result = '';
        _.forEach(jobRoles, item => {
            result += `${item.number} ${item.jobRole.name}, `;
        });
        return result.slice(0, result.length - 2);
    }

    render() {
        return (
            <div className="popover-container edit-role-history">
                <div className="arrow-down" />
                <div className="edit-history-popover-content">
                    <div className="popover-header">
                        <span>{RS.getString('EDIT_HISTORY', null, 'UPPER')}</span>
                        <img className="icon-close"
                            onClick={this.props.handleClose}
                            src={require('../../../../images/closeDialog.png')}
                        />
                    </div>
                    <div className="popover-body">
                        <table className="metro-table">
                            <MyHeader>
                                <MyRowHeader>
                                    <MyTableHeader>
                                        {RS.getString('EDIT_DATE')}
                                    </MyTableHeader>
                                    <MyTableHeader>
                                        {RS.getString("EFFECTIVE_DATE")}
                                    </MyTableHeader>
                                    <MyTableHeader>
                                        {RS.getString("NUMBER_OF_RESOURCE")}
                                    </MyTableHeader>
                                </MyRowHeader>
                            </MyHeader>
                            <tbody>
                                {
                                    _.map(this.props.history, (item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {DateHelper.formatTimeWithPattern(item.editDate, DATETIME.DATE_CONTRACT)}
                                                </td>
                                                <td>
                                                    {DateHelper.formatTimeWithPattern(item.effectiveDate, DATETIME.DATE_CONTRACT)}
                                                </td>
                                                <td>
                                                    {this.renderNumberRequiredEmployees(item.require)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

const propTypes = {
    scheduleShift: PropTypes.object,
    isEdit: PropTypes.bool,
    viewMode: PropTypes.bool,
    handleUpdateRequireEmployees: PropTypes.func
};
class CellRoleWorkingLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditHistory: false
        };
        this.renderEditHistory = this.renderEditHistory.bind(this);
        this.renderNumberRequiredEmployees = this.renderNumberRequiredEmployees.bind(this);
    }

    renderNumberRequiredEmployees(jobRoles) {
        let result = '';
        _.forEach(jobRoles, item => {
            result += `${item.number} ${item.jobRole.name}, `;
        });
        return result.slice(0, result.length - 2);
    }

    renderEditHistory(history) {
        return (
            <Overlay
                animation={false}
                rootClose
                show={this.state.showEditHistory}
                placement="top"
                container={this}
                onHide={() => this.setState({ showEditHistory: false })}
                target={() => ReactDOM.findDOMNode(this.target)}
            >
                <CustomPopover
                    history={history}
                    handleClose={() => this.setState({ showEditHistory: false })}
                />
            </Overlay>
        );
    }
    render() {
        return (
            <div>
                <span className="show-roles__name">
                    {this.renderNumberRequiredEmployees(this.props.scheduleShift.require)}
                    {
                        this.props.isEdit &&
                        <i
                            className="fa fa-history"
                            ref={(input) => this.target = input}
                            onClick={() => { this.setState({ showEditHistory: true }); }}
                        />
                    }
                    {
                        this.props.isEdit &&
                        this.renderEditHistory(this.props.scheduleShift.history)
                    }
                </span>
                {
                    !this.props.viewMode &&
                    <i
                        className="fa fa-pencil edit-employee"
                        aria-hidden="true"
                        data-toggle="tooltip"
                        title={RS.getString('EDIT')}
                        onClick={this.props.handleUpdateRequireEmployees}
                    />
                }
            </div>
        )
    }
}

CellRoleWorkingLocation.propTypes = propTypes;

export default CellRoleWorkingLocation;