import React, { PropTypes } from 'react';
import _ from 'lodash';
import RIGHTS from '../../../../constants/rights';
import PayRate from './PayRate';
import JobRolesAndSkills from './JobRolesAndSkills';

const propTypes = {
    job: PropTypes.object,
    jobRoles: PropTypes.array,
    skills: PropTypes.array,
    regular: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    employeeConstraints: PropTypes.object,
    onBlurPayRate: PropTypes.func
};
class JobRolesAndPayRate extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnBlurPayRate = this.handleOnBlurPayRate.bind(this);
        this.handleUpdateJobRolesAndPayRate = this.handleUpdateJobRolesAndPayRate.bind(this);
    }

    validate() {
        const validPayRate = this.payRate.validate();
        const validJobRole = this.jobRoleAndSkills.validateSkillsJobroles();
        return validPayRate && validJobRole;
    }

    validatePayRate() {
        return this.payRate.validate();
    }

    getValue() {
        return _.assign({}, this.jobRoleAndSkills.getValue(), { payRate: this.payRate.getValue() });
    }

    handleOnBlurPayRate(value) {
        this.props.onBlurPayRate && this.props.onBlurPayRate(value);
    }

    setPayRate(value) {
        this.payRate.setValue(value);
    }

    handleUpdateJobRolesAndPayRate() {
        this.props.onUpdateJobRolesAndPayRate && this.props.onUpdateJobRolesAndPayRate(this.getValue());
    }

    render() {
        return (
            <div>
                {
                    this.props.curEmp.rights.find(x => x === RIGHTS.MODIFY_PAY_RATE_SETTING) ?
                        <PayRate
                            regular={this.props.job.payRate}
                            employeeConstraints={this.employeeConstraints}
                            ref={(payRate) => this.payRate = payRate}
                            onBlurPayRate={this.handleOnBlurPayRate}
                            onUpdatePayRate={this.handleUpdateJobRolesAndPayRate}
                        /> : null
                }
                <JobRolesAndSkills
                    job={this.props.job}
                    jobRoles={this.props.jobRoles}
                    skills={this.props.skills}
                    ref={(component) => this.jobRoleAndSkills = component}
                    onUpdateJob={this.handleUpdateJobRolesAndPayRate}
                />
            </div>
        );
    }
}

JobRolesAndPayRate.propTypes = propTypes;
export default JobRolesAndPayRate;