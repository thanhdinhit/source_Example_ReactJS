

import React, { PropTypes } from 'react';
import _ from 'lodash';
import RIGHTS from '../../../constants/rights';
import PayRateView from './PayRateView';
import JobRoleAndSkillsView from './JobRoleAndSkillsView';

const propTypes = {
    job: PropTypes.object,
    permissionEdit: PropTypes.bool
};
class JobRoleAndPayRateView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {
                    this.props.curEmp.rights.find(x => x === RIGHTS.VIEW_PAY_RATE_SETTING) ?
                        <PayRateView
                            payRate={this.props.job.payRate}
                            permissionEdit={this.props.permissionEdit}
                        /> : null
                }
                <JobRoleAndSkillsView
                    permissionEdit={this.props.permissionEdit}
                    job={this.props.job}
                />
            </div>
        );
    }
}

JobRoleAndPayRateView.propTypes = propTypes;
export default JobRoleAndPayRateView;