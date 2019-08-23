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

class CellShifts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };

        this.renderNumberRequiredEmployees = this.renderNumberRequiredEmployees.bind(this);
    }

    renderNumberRequiredEmployees(jobRoles) {
        let result = [];
        _.forEach(jobRoles, item => {
            result.push(`${item.number} ${item.jobRole.name}`);
        });
        return _.join(result, ', ');
    }

    render() {
        return (
            <div className="shifts-cell">
                {
                    this.props.viewMode ?
                        null
                        :
                        <div className="btn-add-shift" onClick={this.props.handleOpenDialogAddShift}>
                            <i className="fa fa-plus" aria-hidden="true"></i>
                            <span> {RS.getString("ADD_SHIFT")}</span>
                        </div>
                }
                {
                    _.map(this.props.shifts, (shift, index) => {
                        return (
                            <div key={index} className="location-shift" style={{ backgroundColor: shift.color }}>
                                <div>{`${shift.startTimeString} - ${shift.endTimeString}`}</div>
                                <div>{this.renderNumberRequiredEmployees(shift.requires)}</div>
                                <div>{`${shift.regularHours}${RS.getString("HRS")}`}</div>
                                {
                                    !this.props.viewMode &&
                                    <div className="actions">
                                        <i className="fa fa-pencil" data-toggle="tooltip"
                                            onClick={() => { this.props.handleEdit && this.props.handleEdit(shift.index) }}></i>
                                        <i className="fa fa-close" data-toggle="tooltip"
                                            onClick={() => { this.props.handleDelete && this.props.handleDelete(shift.index) }}></i>
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

CellShifts.propTypes = {};

export default CellShifts;