import React, { PropTypes } from 'react'
import RS, { Option } from '../../../resources/resourceManager';
import TextView from '../../elements/TextView';
import SkillTagView from '../../pages/EmployeePortal/SkillTagView';
import { DEFAULT_MONTH_NOTIFY } from '../../../core/common/constants'

const JobRoleAndSkillsView = React.createClass({
    propTypes: {
        job: PropTypes.object.isRequired,
        permissionEdit: PropTypes.bool.isRequired,
        handleEditEmployee: PropTypes.func
    },
    renderJobSkills: function (jobSkills) {
        return jobSkills.map(function (skill, index) {
            return (
                <SkillTagView
                    key={index}
                    skill={skill}
                    defaultMonthNotify={DEFAULT_MONTH_NOTIFY}
                />
            );
        }.bind(this));
    },

    handleColumnSkills(skills) {
        let firstColumnJobSkills = [], secondColumnJobSkills = [], thirdColumnJobSkills = [];

        if (skills.length > 0) {
            firstColumnJobSkills = skills.filter((x, index) => index % 3 === 0);
            secondColumnJobSkills = skills.filter((x, index) => index % 3 === 1);
            thirdColumnJobSkills = skills.filter((x, index) => index % 3 === 2);
        }

        return {
            first: firstColumnJobSkills,
            second: secondColumnJobSkills,
            third: thirdColumnJobSkills
        };
    },

    renderSkills(employeeJobSkills, skillsInJobRoles, isMandatory) {
        let employeeJobSkillsCopy = _.cloneDeep(employeeJobSkills);
        let skills = [];

        _.map(employeeJobSkillsCopy, (skill, idx) => {
            let item = _.filter(skillsInJobRoles, {
                id: skill.jobSkill.id
            }, true);

            if (isMandatory) {
                if (item.length > 0) {
                    skills.push(skill);
                }
            } else {
                if (item.length === 0) {
                    skills.push(skill);
                }
            }

        });

        let columns = this.handleColumnSkills(skills);
        let titleClassName = isMandatory ? 'required' : '';

        return (
            <div className="row">
                <div className={"col-md-12 title-skills title " + titleClassName}>
                    {isMandatory ? RS.getString('MANDATORY_SKILLS') : RS.getString('OPTIONAL_SKILLS')}
                </div>
                <div className="col-md-4">
                    {this.renderJobSkills(columns.first, skillsInJobRoles)}
                </div>
                <div className="col-md-4">
                    {this.renderJobSkills(columns.second, skillsInJobRoles)}
                </div>
                <div className="col-md-4">
                    {this.renderJobSkills(columns.third, skillsInJobRoles)}
                </div>
            </div>
        );
    },
    render: function () {
        if (!this.props.job) return null;
        let { job } = this.props;

        const employeeJobSkills = job && job.employeeJobSkills || [];
        const skillsInJobRoles = job && job.jobRole && job.jobRole.jobSkills || [];
        const jobRole = job.jobRole && job.jobRole.id || job.jobRole;

        return (
            <div className="job-role-skills">
                <div className="row">
                    <div className="col-md-12 new-employee-title uppercase title"> {RS.getString('JOB_ROLE_SKILLS')} </div>
                </div>
                <div className="row" >
                    <div className="col-md-4" >
                        <TextView
                            value={job && job.jobRole ? job.jobRole.name : ''}
                        />
                    </div>
                </div>
                {jobRole != null ? this.renderSkills(employeeJobSkills, skillsInJobRoles, true) : ''}
                {jobRole != null ? this.renderSkills(employeeJobSkills, skillsInJobRoles) : ''}
            </div>
        );
    }
})
export default JobRoleAndSkillsView;