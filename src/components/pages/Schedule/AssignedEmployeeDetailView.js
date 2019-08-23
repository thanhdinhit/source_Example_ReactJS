import React, { PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment';

import RS from '../../../resources/resourceManager';
import dateHelper from '../../../utils/dateHelper';
import { DATETIME, TIMEFORMAT } from '../../../core/common/constants';

const propTypes = {
}

class AssignedEmployeeDetailView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        let { assignment } = this.props;
        let isMainEmpOvertime = assignment.isOvertime;
        let isReplaceEmpOvertime = !!_.get(assignment, 'replacement.isOvertime');
        let mainEmp = _.get(assignment, 'employee');
        let replaceEmp = _.get(assignment, 'replacement.employee');
        let statusClassName = assignment.error ? 'error' : _.toLower(assignment.status);
        const avatarDefault = require("../../../images/avatarDefault.png");
        return !!replaceEmp ? (
            <div className="assigned-emp-info has-replacement">
                <div className="emp-details">
                    <div className={'emp-avatar-group ' + statusClassName}>
                        <div className="main-emp">
                            <img src={mainEmp.photoUrl ? (API_FILE + mainEmp.photoUrl) : avatarDefault} />
                            <div className={'emp-status ' + statusClassName}/>
                        </div>
                        <div className="replace-emp">
                            <img src={replaceEmp.photoUrl ? (API_FILE + replaceEmp.photoUrl) : avatarDefault} />
                            <div className={'emp-status ' + statusClassName}/>
                        </div>
                    </div>
                    <div className={'emp-name-group' + (isMainEmpOvertime || isReplaceEmpOvertime ? ' has-overtime' : '')}>
                        <div>{mainEmp.fullName}</div>
                        <div>{replaceEmp.fullName}</div>
                    </div>
                    <div className="overtime-flag-group">
                        <div>
                        {
                            isMainEmpOvertime &&
                            <span>{RS.getString('OT')}</span>
                        }
                        </div>
                        <div>
                        {
                            isReplaceEmpOvertime &&
                            <span>{RS.getString('OT')}</span>
                        }
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="assigned-emp-info">
                <div className="emp-details">
                    <div className="emp-avatar">
                        <img src={mainEmp.photoUrl ? (API_FILE + mainEmp.photoUrl) : avatarDefault} />
                        <div className={'emp-status ' + statusClassName}/>
                    </div>
                    <div className={'emp-name' + (isMainEmpOvertime ? ' has-overtime' : '')}>{mainEmp.fullName}</div>
                    {
                        isMainEmpOvertime &&
                        <div className="overtime-flag">{RS.getString('OT')}</div>
                    }
                </div>
            </div>
        );
    }
}

export default AssignedEmployeeDetailView;