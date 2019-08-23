import React, { PropTypes } from 'react';
import _ from 'lodash';
import RS from '../../../../resources/resourceManager';
import Dialog from '../../../elements/Dialog';
import RaisedButton from '../../../elements/RaisedButton';
import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import CommonSelect from '../../../elements/CommonSelect.component';
import { COUNTRY } from '../../../../core/common/config';
import { loadAllMember } from '../../../../actions/employeeActions';
import { loadStates } from '../../../../actionsv2/geographicActions';
import { editEmployeeOrganization, addNewEmployeeOrganization } from '../../../../actionsv2/employeeActions';
import { MODE_PAGE } from '../../../../core/common/constants';
import { getEditAddNewOrganizationConstraints } from '../../../../validation/editAddNewOrganizationConstraints';
import { checkBelongParentGroups, getNearestParent } from '../../../../utils/arrayHelper';
import * as toastr from '../../../../utils/toastr';
import * as loadingIndicatorActions from '../../../../utils/loadingIndicatorActions';

class DialogAddEditOrganization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMounted: false,
            isEdit: false,
            isOpenDialogConfirmTransfer: false,
        };
        this.defaultManagedby = null;
        this.validateForm = this.validateForm.bind(this);
        this.handleAddNew = this.handleAddNew.bind(this);
        this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
        this.renderOption = this.renderOption.bind(this);
        this.loadAllEmployees = this.loadAllEmployees.bind(this);
        this.valueRenderer = this.valueRenderer.bind(this);
        this.optionRenderer = this.optionRenderer.bind(this);
        this.handleAddEditGroupOrganization = this.handleAddEditGroupOrganization.bind(this);
        this.handleActionCallback = this.handleActionCallback.bind(this);
    }

    componentDidMount() {
        loadStates((er, states) => {
            if (states) {
                this.setState({ states })
            }
        });
        this.setState({
            isMounted: true
        });
    }

    valueRenderer(option) {
        return (
            <div className="avatar-option">
                <img className="avatar-img" src={option.photoUrl ? (API_FILE + option.photoUrl)
                    : require('../../../../images/avatarDefault.png')} />
                <span className="avatar-label">{option.label}</span>
            </div>
        );
    }
    optionRenderer(option) {
        let label = ''
        {
            option.jobRole ?
                label = option.fullName + " - " + _.get(option.jobRole, 'name', '')
                : label = option.fullName;
        }
        return (
            <div className="avatar-option">
                <img className="avatar-img" src={option.photoUrl ? (API_FILE + option.photoUrl)
                    : require('../../../../images/avatarDefault.png')} />
                <span className="avatar-label">{label}</span>
            </div>
        );
    }

    getValues() {
        const organization = {};
        if (this.state.isEdit) {
            organization.id = _.get(this.props.groupSelected, 'id');
            organization.stamp = _.get(this.props.groupSelected, 'stamp');
            organization.lastSubmission = _.get(this.props.groupSelected, 'lastSubmission');
        }
        organization.name = this.name.getValue();
        organization.state = this.states.getValue();
        organization.parent = this.parentGroup.getValue();
        organization.supervisor = this.managedBy.getValue();
        return organization;
    }

    validateForm() {
        let rs = true;
        const fieldValidates = [
            'name', 'parentGroup', 'managedBy', 'states'];
        fieldValidates.forEach(function (field) {
            if (!this[field].validate() && rs) {
                rs = false;
            }
        }, this);
        return rs;
    }

    handleSubmitEdit() {
        loadingIndicatorActions.showAppLoadingIndicator();
        editEmployeeOrganization(this.getValues(), this.handleActionCallback);
    }

    handleAddNew() {
        loadingIndicatorActions.showAppLoadingIndicator();
        addNewEmployeeOrganization(this.getValues(), this.handleActionCallback);
    }

    handleActionCallback(err, value) {
        loadingIndicatorActions.hideAppLoadingIndicator();
        if (err) {
            toastr.error(RS.getString(err.message), RS.getString('ERROR'));
        }
        else {
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
            this.props.handleLoadAllGroup();
        }
    }

    groupsRebuildTree() {
        const groups = _.cloneDeep(this.props.groups);
        let rs = [];
        let parents = [];
        parents.push(groups[0]);
        rs.push(groups[0]);
        for (let i = 1; i < groups.length; i++) {
            if (_.get(groups[i], 'parent.id') == _.last(parents).id) {
                for (let j = 0; j < parents.length; j++) {
                    groups[i].name = '   ' + groups[i].name;
                }
                rs.push(groups[i]);
                if (_.get(groups[i + 1], 'parent.id') == groups[i].id) {
                    parents.push(groups[i]);
                }
            } else {
                parents.pop();
                i--;
            }
        }
        return rs;
    }

    renderOption(option) {
        return (
            <div className="parent-groups">
                {option.name}
            </div>
        );
    }

    loadAllEmployees(input) {
        if (!this.state.isMounted) return;
        return loadAllMember(input);
    }

    handleAddEditGroupOrganization() {
        if (this.validateForm()) {
            let groups = _.cloneDeep(this.props.groups);
            let groupManagedBy = this.managedBy.getValue().group;
            let groupSelected = _.cloneDeep(this.props.groupSelected);
            let rs = false;
            this.defaultManagedby = this.managedBy.getValue()
            if (!groupManagedBy) {
                groupManagedBy = groupSelected;
            }
            let isBelong = checkBelongParentGroups(groupSelected, groupManagedBy, groups);
            let nearestParent = getNearestParent(groupSelected, groupManagedBy, groups);
            if (isBelong) {
                this.defaultManagedby = null;
                if (this.state.isEdit) {
                    this.handleSubmitEdit();
                }
                else {
                    this.handleAddNew();
                }
            }
            else {
                rs = true;
            }
            this.handleOpendialogConfirm(rs, nearestParent);
        }
    }

    handleOpendialogConfirm(value, nearestParent) {
        let fullName = '';
        let parentGroup = '';
        if (this.managedBy) { fullName = this.managedBy.getValue().fullName }
        parentGroup = _.get(nearestParent,'name');
        this.props.handleOpendialogConfirm(value, fullName, parentGroup, nearestParent, this.managedBy.getValue().id);
    }

    clearDefaultManagedBy = () => {
        this.defaultManagedby = null;
    }

    render() {
        if (!this.props.isOpen) return null;
        const mode = this.props.mode;
        switch (mode) {
            case MODE_PAGE.EDIT: this.state.isEdit = true; break;
            case MODE_PAGE.NEW: this.state.isEdit = false; break;
        }
        let isEdit = this.state.isEdit;
        const OrganizationConstraints = getEditAddNewOrganizationConstraints();
        let groupSelected = _.cloneDeep(this.props.groupSelected);
        {
            groupSelected && groupSelected.supervisor ?
                groupSelected.supervisor.name = _.get(groupSelected.supervisor, 'fullName', '') + " - "
                + _.get(groupSelected.supervisor, 'jobRole.name', '') : null
        }
        return (
            <Dialog
                title={(isEdit ? RS.getString('EDIT_GROUP', null, 'UPPER')
                    : RS.getString('NEW_GROUP', null, 'UPPER'))}
                isOpen={this.props.isOpen}
                handleClose={this.props.handleClose}
                style={{ widthBody: '415px' }}
                modalBody="none-scroll"
            >
                <div className="dialog-organization">
                    <div className="row dialog-organization-container">
                        <div className="col-md-12">
                            <CommonTextField
                                required
                                title={RS.getString('NAME')}
                                id="name"
                                constraint={OrganizationConstraints.name}
                                ref={(input) => this.name = input}
                                defaultValue={isEdit ? groupSelected.name : ''}
                            />
                        </div>
                    </div>
                    <div className="row dialog-organization-container">
                        <div className="col-md-12">
                            <CommonSelect
                                required
                                title={RS.getString('PARENT_GROUP')}
                                placeholder={RS.getString('SELECT_A_GROUP')}
                                clearable={false}
                                searchable={true}
                                propertyItem={{ label: 'name', value: 'id' }}
                                options={this.groupsRebuildTree()}
                                name="parentGroup"
                                value={isEdit && groupSelected ? groupSelected.parent
                                    : groupSelected}
                                constraint={(groupSelected && groupSelected.parent > 0 || !isEdit && !groupSelected)
                                    ? OrganizationConstraints.groups : null}
                                ref={(input) => this.parentGroup = input}
                                disabled={groupSelected && groupSelected.parent == null && isEdit ? true : false}
                                optionRenderer={this.renderOption}
                            />
                        </div>
                    </div>
                    <div className="row dialog-organization-container">
                        <div className="col-md-12">
                            <CommonSelect
                                required
                                className="has-avatar"
                                title={RS.getString('MANAGED_BY')}
                                placeholder={RS.getString('SELECT_A_MANAGER')}
                                propertyItem={{ label: 'fullName', value: 'id' }}
                                clearable={false}
                                searchable={true}
                                name="managedBy"
                                value={isEdit ? (this.defaultManagedby || groupSelected.supervisor) : null}
                                loadOptions={this.loadAllEmployees}
                                valueRenderer={this.valueRenderer}
                                optionRenderer={this.optionRenderer}
                                ref={(input) => this.managedBy = input}
                                constraint={OrganizationConstraints.managedBy}
                            />
                        </div>
                    </div>
                    <div className="row dialog-organization-container">
                        {
                            LOCALIZE.COUNTRY != COUNTRY.VN ?
                                <div className="col-md-12">
                                    <CommonSelect
                                        required
                                        title={RS.getString('STATE')}
                                        placeholder={RS.getString('SELECT_STATE')}
                                        clearable={false}
                                        searchable={false}
                                        propertyItem={{ label: 'name', value: 'id' }}
                                        options={this.state.states}
                                        name="parent-group"
                                        constraint={OrganizationConstraints.states}
                                        ref={(input) => this.states = input}
                                        value={isEdit ? groupSelected.state : ''}
                                    />
                                </div> : null
                        }
                    </div>
                    <div className="row">
                        <div className="text-right">
                            <RaisedButton
                                label={RS.getString('CANCEL')}
                                onClick={() => { this.defaultManagedby = null; this.props.handleClose(); }}
                                className="raised-button-fourth"
                            />
                            <RaisedButton
                                label={<span className="label-icon">{RS.getString('SAVE')}</span>}
                                onClick={this.handleAddEditGroupOrganization}
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
        )
    }

}

export default DialogAddEditOrganization;