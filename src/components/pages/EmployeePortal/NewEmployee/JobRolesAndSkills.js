import React, { PropTypes } from 'react';
import RS, { Option } from '../../../../resources/resourceManager';
import CommonSelect from '../../../elements/CommonSelect.component';
import RaisedButton from '../../../elements/RaisedButton';
import DialogAttachFile from '../../../elements/UploadComponent/DialogAttachFile';
import DialogAddSkills from '../DialogAddSkills';
import SkillTag from '../../EmployeePortal/SkillTag';
import { STATUS, WAITING_TIME } from '../../../../core/common/constants';
import _ from 'lodash';
import update from 'react-addons-update';
import DialogConfirm from '../../../elements/DialogConfirm';
import * as employeeConstraints from '../../../../validation/employeeConstraints';
import Promise from 'bluebird';

const propTypes = {
    jobRoles: PropTypes.array,
    skills: PropTypes.array,
    job: PropTypes.object,
};

class JobRolesAndSkills extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            openDialogAttachCertificates: false,
            openAddSkills: false,
            openConfirm: false,
            job: null
        };
        this.openDialogAddSkill = this.openDialogAddSkill.bind(this);
        this.handleClosePopup = this.handleClosePopup.bind(this);
        this.handleJobRoleChange = this.handleJobRoleChange.bind(this);
        this.handleAttachCertificates = this.handleAttachCertificates.bind(this);
        this.handleChangeCertificate = this.handleChangeCertificate.bind(this);
        this.openDialogAttach = this.openDialogAttach.bind(this);
        this.handleSkillChange = this.handleSkillChange.bind(this);
        this.renderJobSkills = this.renderJobSkills.bind(this);
        this.handleDeleteSkill = this.handleDeleteSkill.bind(this);
        this.handleRemoveCertificate = this.handleRemoveCertificate.bind(this);
        this.handleSubmitConfirmPopup = this.handleSubmitConfirmPopup.bind(this);
        this.validateSkillsJobroles = this.validateSkillsJobroles.bind(this);
        this.handleUpdateJobRolesAndSkills = this.handleUpdateJobRolesAndSkills.bind(this);
    }

    componentDidMount() {
        this.setState({
            job: _.cloneDeep(this.props.job)
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.job, nextProps.job)) {
            this.setState({ job: _.cloneDeep(nextProps.job) });
        }
    }

    getValue() {
        const employeeJobSkills = _.map(this.state.job.employeeJobSkills, employeeJobSkill => {
            let employeeJobSkillClone = _.cloneDeep(employeeJobSkill);
            delete employeeJobSkillClone.jobSkill.errorText;
            return employeeJobSkillClone;
        });
        return _.assign({}, this.state.job, { employeeJobSkills });
    }

    handleUpdateJobRolesAndSkills() {
        this.props.onUpdateJob && this.props.onUpdateJob();
    }

    handleClosePopup() {
        this.setState({
            openAddSkills: false,
            openConfirm: false
        });
    }

    handleAttachCertificates(files) {
        let employeeJobSkill = _.cloneDeep(this.state.job.employeeJobSkills.find(x => x.jobSkill.id == this.chosenSkillToAddCertificate.jobSkill.id));
        if (employeeJobSkill) {
            employeeJobSkill.jobSkill.errorText = '';
            files.forEach(function (file) {
                if (file.status == STATUS.COMPLETED) {
                    if (employeeJobSkill.certificates && employeeJobSkill.certificates.length) {
                        if (!employeeJobSkill.certificates.find(x => x.url == file.url)) {
                            employeeJobSkill.certificates.push({ url: file.url, name: file.name, expiredDate: undefined });
                        }
                    }
                    else {
                        employeeJobSkill.certificates = [];
                        employeeJobSkill.certificates.push({ url: file.url, name: file.name, expiredDate: undefined });
                    }
                }
            });
            let index = this.state.job.employeeJobSkills.findIndex(x => x.jobSkill.id == employeeJobSkill.jobSkill.id);
            let employeeJobSkills = update(this.state.job.employeeJobSkills, {
                $splice: [[index, 1, employeeJobSkill]]
            });

            this.setState({
                job: {
                    jobRole: this.state.job.jobRole,
                    employeeJobSkills: employeeJobSkills
                }
            }, this.handleUpdateJobRolesAndSkills);
        }
    }

    handleJobRoleChange(value) {
        let totalSkills = [];
        totalSkills.push(...this.state.job.employeeJobSkills);
        let newJobRole = value;

        if (newJobRole) {
            newJobRole.jobSkills.forEach(function (skill) {
                if (_.isEmpty(this.state.job.employeeJobSkills) || _.isEmpty(totalSkills.find(x => x.jobSkill.name === skill.name))) {
                    let obj = {
                        required: true,
                        note: '',
                        jobSkill: skill
                    };

                    totalSkills.push(obj);
                }
            }, this);
        }
        this.setState({
            job: {
                jobRole: value,
                employeeJobSkills: totalSkills
            }
        }, this.handleUpdateJobRolesAndSkills);
    }

    handleChangeCertificate(skill, newCertificate) {
        let index = this.state.job.employeeJobSkills.findIndex(x => x.jobSkill.id == skill.jobSkill.id);
        let indexCer = this.state.job.employeeJobSkills[index].certificates.findIndex(x => x.name == newCertificate.name);
        let newEmployeeJobSkills = update(this.state.job.employeeJobSkills, {
            [index]: {
                certificates: {
                    [indexCer]: {
                        $set: newCertificate
                    }
                }
            }
        });
        this.setState({
            job: {
                jobRole: this.state.job.jobRole,
                employeeJobSkills: newEmployeeJobSkills
            }
        }, this.handleUpdateJobRolesAndSkills);
    }

    openDialogAddSkill() {
        this.setState({ openAddSkills: true });
    }

    openDialogAttach(skill) {
        this.setState({
            openDialogAttachCertificates: true,
        });
        this.chosenSkillToAddCertificate = skill;
    }

    handleSkillChange(skillsSelected) {
        let self = this;
        let currentSkills = _.cloneDeep(self.state.job.employeeJobSkills);
        let newSkills = [];

        if (skillsSelected.length > 0) {
            skillsSelected.forEach((skill, index) => {
                currentSkills.push({ jobSkill: skill });
            });
        }

        this.setState({
            job: {
                jobRole: this.state.job.jobRole,
                employeeJobSkills: currentSkills
            }
        }, this.handleUpdateJobRolesAndSkills);
    }

    handleDeleteSkill(skill) {
        this.setState({ deleteSkill: skill, openConfirm: true });
    }

    handleSubmitConfirmPopup(data) {
        let skill = this.state.job.employeeJobSkills.find(x => x.jobSkill.name === data.name);
        if (skill) {
            let newJobSkills = this.state.job.employeeJobSkills.filter(x => x.jobSkill.name != skill.jobSkill.name);

            this.setState({
                job: {
                    employeeJobSkills: newJobSkills,
                    jobRole: this.state.job.jobRole
                },
                openConfirm: false
            }, this.handleUpdateJobRolesAndSkills);
        }
    }

    handleRemoveCertificate(skill, certificate, indexCertificate) {
        let index = this.state.job.employeeJobSkills.findIndex(x => x.jobSkill.id == skill.jobSkill.id);
        this.state.job.employeeJobSkills[index].certificates.splice(indexCertificate, 1);
        this.setState({
            job: {
                jobRole: this.state.job.jobRole,
                employeeJobSkills: this.state.job.employeeJobSkills
            }
        }, this.handleUpdateJobRolesAndSkills);
    }

    validateSkillsJobroles() {
        let rs = true;
        let employeeJobSkills = _.cloneDeep(this.state.job.employeeJobSkills);
        rs = this.JobRoleSelect.validate();
        employeeJobSkills.forEach(function (skill, index) {
            if (skill.jobSkill.requireCertificate && skill.required) {
                if (!skill.certificates || _.isEmpty(skill.certificates)) {
                    rs = false;
                    skill.jobSkill.errorText = RS.getString('THIS_SKILL_REQUIRES_CERTIFICATE');
                }
            }
        }, this);

        this.setState({
            job: {
                employeeJobSkills: employeeJobSkills,
                jobRole: this.state.job.jobRole
            }
        }, this.handleUpdateJobRolesAndSkills);

        if (!rs) {
            Promise.delay(200).then(() => {
                let errorDiv = $('.has-error').first();
                if (errorDiv.length) {
                    let scrollPos = errorDiv.offset().top - 100;
                    $('html, body').animate({ scrollTop: scrollPos }, WAITING_TIME);
                }
            })
        }
        return rs;
    }

    handleChangeRequiredSkill = (skill) => {
        if (this.state.job && this.state.job.employeeJobSkills) {
            let employeeJobSkills = _.cloneDeep(this.state.job.employeeJobSkills);

            let newEmployeeJobSkills = _.map(employeeJobSkills, (s, idx) => {
                if (s.jobSkill.id === skill.jobSkill.id) {
                    s.jobSkill.errorText = skill.jobSkill.errorText;
                    s.required = skill.required;
                    s.note = '';
                }

                return s;
            });

            this.setState({
                job: {
                    jobRole: this.state.job.jobRole,
                    employeeJobSkills: newEmployeeJobSkills
                }
            }, this.handleUpdateJobRolesAndSkills);
        }
    }

    handleAddNoteToSkill = (skill, certificates) => {
        if (this.state.job && this.state.job.employeeJobSkills) {
            let employeeJobSkills = _.cloneDeep(this.state.job.employeeJobSkills);

            let newEmployeeJobSkills = _.map(employeeJobSkills, (s, idx) => {
                if (s.jobSkill.id === skill.jobSkill.id) {
                    s.note = skill.note;
                    s.required = skill.required;
                    s.certificates = certificates;
                }

                return s;
            });

            this.setState({
                job: {
                    jobRole: this.state.job.jobRole,
                    employeeJobSkills: newEmployeeJobSkills
                }
            }, this.handleUpdateJobRolesAndSkills);
        }
    }

    handleColumnSkills(skills, isOptional) {
        let firstColumnJobSkills = [], secondColumnJobSkills = [], thirdColumnJobSkills = [];

        if (isOptional) {
            let length = skills.length;

            skills[length] = {
                isButton: true,
                name: RS.getString('ADD_SKILL', ['ADD', 'SKILLS'])
            };
        }

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
    }

    renderJobSkills(jobSkills, skillsInJobRoles, isOptional) {
       
        return jobSkills.map(function (skill, index) {
            if (skill.isButton) {
                return (
                    <div className="col-md-12 button-add-skill" key={index}>
                        <div className="add-skill text-center">
                            <label className="label-input" onClick={this.openDialogAddSkill}>
                                <img src={require("../../../../images/add-icon.png")} />
                                <span>{RS.getString('ADD_SKILL', ['ADD', 'SKILLS'])}</span>
                            </label>
                        </div>
                    </div>
                );
            }
            return (
                <SkillTag
                    key={index}
                    skill={skill.jobSkill}
                    certificates={skill.certificates}
                    skillJobRoles={skillsInJobRoles}
                    handleRemove={this.handleDeleteSkill}
                    onRemoveCertificate={this.handleRemoveCertificate.bind(this, skill)}
                    openDialogAddCertificates={this.openDialogAttach.bind(this, skill)}
                    onChangeCertificate={this.handleChangeCertificate.bind(this, skill)}
                    errorText={skill.jobSkill.errorText}
                    handleChangeRequiredSkill={this.handleChangeRequiredSkill}
                    handleAddNoteToSkill={this.handleAddNoteToSkill}
                    isOptional={isOptional}
                    employeeSkill={skill}

                />
            );
        }.bind(this));
    }

    renderMandatorySkills(employeeJobSkills, skillsInJobRoles) {
        let employeeJobSkillsCopy = _.cloneDeep(employeeJobSkills);
        let mandatorySkills = [];

        _.map(employeeJobSkillsCopy, (skill, idx) => {
            let item = _.filter(skillsInJobRoles, {
                id: skill.jobSkill.id
            }, true);

            if (item.length > 0) {
                mandatorySkills.push(skill);
            }
        });

        let columns = this.handleColumnSkills(mandatorySkills);

        return (
            <div className="row">
                <div className="col-md-12 title-skills title required">
                    {RS.getString('MANDATORY_SKILLS')}
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
    }

    renderOptionalSkills(employeeJobSkills, skillsInJobRoles) {
        let employeeJobSkillsCopy = _.cloneDeep(employeeJobSkills);
        let optionSkills = [];

        _.map(employeeJobSkillsCopy, (skill, idx) => {
            let item = _.filter(skillsInJobRoles, {
                id: skill.jobSkill.id
            }, true);

            if (item.length === 0) {
                optionSkills.push(skill);
            }
        });

        let columns = this.handleColumnSkills(optionSkills, true);

        return (
            <div className="row">
                <div className="col-md-12 title-skills title">
                    {RS.getString('OPTIONAL_SKILLS')}
                </div>
                <div className="col-md-4">
                    {this.renderJobSkills(columns.first, skillsInJobRoles, true)}
                </div>
                <div className="col-md-4">
                    {this.renderJobSkills(columns.second, skillsInJobRoles, true)}
                </div>
                <div className="col-md-4">
                    {this.renderJobSkills(columns.third, skillsInJobRoles, true)}
                </div>
            </div>
        );
    }

    render() {
        let jobRoles = [];
        let skillsInJobRoles = [];
        if (this.state.job && this.state.job.jobRole) {
            skillsInJobRoles.push(...this.state.job.jobRole.jobSkills);
        }
        if (this.props.jobRoles) {
            this.props.jobRoles.forEach(function (element) {
                let newJobRole = _.assign({}, element);
                newJobRole.label = newJobRole.name;
                newJobRole.value = newJobRole.id;
                jobRoles.push(newJobRole);
            }, this);
        }

        const employeeJobSkills = this.state.job && this.state.job.employeeJobSkills || [];
        let job = this.state.job || {};
        const jobRole = job.jobRole && job.jobRole.id || job.jobRole;

        return (
            <div className="job-role-skills">
                <div className="row">
                    <div className="col-md-12 new-employee-title uppercase title required"> {RS.getString('JOB_ROLE_SKILLS')} </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <CommonSelect
                            placeholder="---"
                            searchable={true}
                            clearable={false}
                            name="select-job-roles "
                            value={jobRole}
                            options={jobRoles}
                            constraint={employeeConstraints.getEmployeeConstraints().jobRole}
                            onChange={this.handleJobRoleChange}
                            propertyItem={{ value: 'id', label: 'name' }}
                            ref={(input) => this.JobRoleSelect = input}
                        />
                    </div>
                </div>
                {jobRole != null ? this.renderMandatorySkills(employeeJobSkills, skillsInJobRoles) : null}
                {jobRole != null ? this.renderOptionalSkills(employeeJobSkills, skillsInJobRoles) : null}
                <DialogAttachFile
                    title={RS.getString("ADD_CERTIFICATES", null, Option.UPPER)}
                    attachLabel={RS.getString("ADD")}
                    isOpen={this.state.openDialogAttachCertificates}
                    allowTypes={['png', 'jpg', 'bmp', 'pdf']}
                    maxSize={10}
                    handleClose={() => { this.setState({ openDialogAttachCertificates: false }); }}
                    handleAttach={this.handleAttachCertificates}
                />
                <DialogAddSkills
                    modal
                    onChange={this.handleSkillChange}
                    skillSelected={this.state.job && this.state.job.employeeJobSkills}
                    skills={this.props.skills}
                    isOpen={this.state.openAddSkills}
                    handleClose={this.handleClosePopup}
                    title={RS.getString('SELECT_SKILLS', null, Option.UPPER)}
                />
                <DialogConfirm
                    title={RS.getString('CONFIRM')}
                    isOpen={this.state.openConfirm}
                    handleSubmit={this.handleSubmitConfirmPopup}
                    handleClose={this.handleClosePopup}
                    data={this.state.deleteSkill}
                    className="delete-confirm"
                >
                    <span>{RS.getString('CONFIRM_DELETE', 'SKILL')} </span>
                </DialogConfirm>
            </div>
        );
    }
}

JobRolesAndSkills.propTypes = propTypes;

export default JobRolesAndSkills;