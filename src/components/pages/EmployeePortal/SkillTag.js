import React, { PropTypes } from 'react';
import RS from '../../../resources/resourceManager';
import { getExtension, getName } from '../../../utils/iconUtils';
import DialogChangeExpiredDate, { MODE } from './DialogChangeExpiredDate';
import dateHelper from '../../../utils/dateHelper';
import _ from 'lodash';
import DialogConfirm from '../../elements/DialogConfirm';
import DropdownButton from '../../elements/DropdownButton';
import { ACTIONS_CRUD, TIMEFORMAT } from '../../../core/common/constants';
import MyCheckBox from '../../elements/MyCheckBox';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import PopoverIcon from '../../elements/PopoverIcon/PopoverIcon';

const SkillTag = React.createClass({
    propTypes: {
        skill: PropTypes.object,
        skillJobRoles: PropTypes.array.isRequired,
        openDialogAddCertificates: PropTypes.func.isRequired,
        handleRemove: PropTypes.func.isRequired,
        onChangeCertificate: PropTypes.func.isRequired,
        onRemoveCertificate: PropTypes.func.isRequired,
        errorText: PropTypes.string,
        certificates: PropTypes.array,
        handleChangeRequiredSkill: PropTypes.func,
        handleAddNoteToSkill: PropTypes.func,
        isOptional: PropTypes.bool,
        updateNote: PropTypes.bool,
        employeeSkill: PropTypes.object.isRequired
    },

    getInitialState: function () {
        return {
            certificates: [],
            employeeSkill: {},
            openChangeExpiredDate: false,
            errorText: '',
            openConfirmRemoveCertificate: false,
            updateNote: false,
            mode: MODE.NEW
        };
    },

    componentWillMount: function () {
        if (this.props.errorText) {
            this.setState({ errorText: this.props.errorText });
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (this.props.errorText != nextProps.errorText) {
            this.setState({ errorText: nextProps.errorText })
        }
    },

    componentDidUpdate: function () {
        setTimeout(() => {
            this.inputText && this.inputText.focus();
        }, 0);
    },

    certificateToDelete: undefined,

    handleSubmitDeleteCertificate: function () {
        this.setState({ openConfirmRemoveCertificate: false });
        this.props.onRemoveCertificate(this.certificateToDelete, this.indexCertificateToDelete);
        this.indexCertificateToDelete = undefined;
    },

    handleRemoveCertificate: function (certificate, index) {
        this.certificateToDelete = certificate;
        this.indexCertificateToDelete = index;
        this.setState({ openConfirmRemoveCertificate: true });
    },

    handleRemove: function () {
        this.props.handleRemove(this.props.skill)
    },

    handleClosePopup: function () {
        this.setState({ openChangeExpiredDate: false, openConfirmRemoveCertificate: false });
    },
    handleOpenPopupExpiredDateWithUpload: function (certificate) {
        this.setState({
            openChangeExpiredDate: true,
            selectedCertificate: certificate,
            nonUpload: false,
            mode: certificate.expiredDate ? MODE.EDIT : MODE.NEW
        }, () => {
            this.dialogChangeExpiredDate.setValue(certificate);
        });
    },

    handleOpenPopupExpiredDate: function (certificate) {
        this.setState({
            openChangeExpiredDate: true, selectedCertificate: certificate,
            nonUpload: true,
            mode: certificate.expiredDate ? MODE.EDIT : MODE.NEW
        },()=>{
            this.dialogChangeExpiredDate.setValue(certificate);
        });
    },

    handleSubmitPopup: function (newCertificate) {
        this.props.onChangeCertificate(newCertificate);
    },

    handleGetCertificateAction: function (listDropDownActions, certificate) {
        if (certificate.expiredDate) {
            return listDropDownActions;
        } else {
            return _.filter(listDropDownActions, (action, index) => {
                return action.id != ACTIONS_CRUD.UPDATE;
            });
        }
    },

    handleChangeCertificateAction: function (certificate, index, action) {
        switch (action) {
            case ACTIONS_CRUD.UPDATE: {
                this.handleOpenPopupExpiredDateWithUpload(certificate);
                break;
            }
            case ACTIONS_CRUD.DELETE: {
                this.handleRemoveCertificate(certificate, index);
                break;
            }
            default:
                break;
        }
    },

    handleCheckboxChange: function () {
        if (!this.flag) {
            let newSkill = _.cloneDeep(this.props.employeeSkill);
            newSkill.required = !newSkill.required;

            if (newSkill.required === false) {
                newSkill.jobSkill.errorText = '';
            }

            this.props.handleChangeRequiredSkill(newSkill);
            this.flag = false;
        }
        else {
            this.checkbox.setValue(true);
            this.flag = false;
        }
    },

    handleEnterNote: function (e) {
        if (e.keyCode == 13) {
            this.setState({ updateNote: false });
            let note = e.target.value;
            let newSkill = _.cloneDeep(this.props.employeeSkill);
            let certificates = _.cloneDeep(this.props.certificates);

            newSkill.note = note;
            certificates = [];

            this.props.handleAddNoteToSkill(newSkill, certificates);
        }
    },

    handleBlurNote: function (value) {
        this.flag = true;
        let newSkill = _.cloneDeep(this.props.employeeSkill);
        let certificates = _.cloneDeep(this.props.certificates);
        this.inputText.value = '';

        if (newSkill.note == '') {
            newSkill.note = '';
            newSkill.required = !newSkill.required;
        } else {
            this.setState({ updateNote: false });
            newSkill.note = newSkill.note;
        }

        this.props.handleAddNoteToSkill(newSkill, certificates);

        setTimeout(() => {
            this.flag = false;
        }, 200);
    },

    handleUpdateNote: function (action) {
        if (action = ACTIONS_CRUD.UPDATE) {
            this.setState({ updateNote: true });
        }
    },

    renderCertificates: function () {
        let rs = [];

        const listDropDownActions = [
            {
                id: ACTIONS_CRUD.UPDATE,
                icon: (
                    <i className="fa fa-pencil"></i>
                ),
                name: RS.getString('UPDATE')
            },
            {
                id: ACTIONS_CRUD.DELETE,
                icon: (
                    <i className="fa fa-trash-o"></i>
                ),
                name: RS.getString('DELETE')
            }
        ];

        if (this.props.certificates && this.props.certificates.length > 0)
            this.props.certificates.forEach((certificate, index) => {
                let status = dateHelper.formatExpiredDate(certificate.expiredDate);

                switch (status) {
                    case 'Nearly_Expired':
                        status = 'nearly-expired';
                        break;
                    case 'Expired':
                        status = 'expired';
                        break;
                };

                rs.push(
                    <tr key={index} className="certificate">
                        <td className="td-icon">
                            <img src={require('../../../images/svg/' + getExtension(certificate.url))} />
                        </td>
                        <td className="td-name">
                            <div>
                                <span>
                                    {getName(certificate.url)}
                                </span>
                                <div className="td-expiredDate">
                                    {
                                        certificate.expiredDate ?
                                            <div>
                                                {
                                                    status === '' ?
                                                        <span>
                                                            {RS.getString('REMIND')}&nbsp;
                                                    <span className="status-expiredDate">
                                                                {RS.getString('MONTH_VALUE', certificate.monthsNotify)}
                                                            </span>&nbsp;
                                                    {RS.getString('BEFORE_EXPIRY_DATE')}
                                                            <span className="status-expiredDate">
                                                                {dateHelper.formatTimeWithPattern(certificate.expiredDate, TIMEFORMAT.END_START_TIME)}
                                                            </span>
                                                        </span> :
                                                        <span className={status}>
                                                            {RS.getString((dateHelper.formatExpiredDate(certificate.expiredDate)).toUpperCase())}
                                                        </span>
                                                }

                                            </div> :
                                            <span
                                                className="add-update"
                                                onClick={this.handleOpenPopupExpiredDate.bind(this, certificate)}>
                                                <i className="fa fa-plus" aria-hidden="true"></i>
                                                {RS.getString('ADD_EXPIRY_DATE')}
                                            </span>
                                    }
                                </div>
                            </div>
                        </td>
                        <td className="td-actions">
                            <DropdownButton
                                button={
                                    <div className="columnName" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <a href="javascript:void(0)">
                                            <span>
                                                <i className="icon-tree-dot"></i>
                                            </span>
                                        </a>
                                    </div>
                                }
                                isRight
                                label=""
                                listActions={this.handleGetCertificateAction.bind(this, listDropDownActions, certificate)()}
                                onClick={this.handleChangeCertificateAction.bind(this, certificate, index)}
                            />
                        </td>
                    </tr>);
            }, this);
        return rs;
    },
    render: function () {
        let imgPath = this.props.new ? "closeDialog.png" : "remove.png";
        if (this.props.skill.certificates
            && this.props.skill.certificates.length > 0
            && this.state.certificates.length == 0) {
            this.state.certificates = _.assign([], this.props.skill.certificates);
        }
        let checkboxId = 'skillRequired_' + this.props.skill.id;
        let noteId = 'noteSkill_' + this.props.skill.id;

        const listDropDownNoteActions = [
            {
                id: ACTIONS_CRUD.UPDATE,
                icon: (
                    <i className="fa fa-pencil"></i>
                ),
                name: RS.getString('UPDATE')
            }
        ];

        let errorClass = !_.isEmpty(this.state.errorText) ? ' has-error' : '';
        let hasBorderBottom = (this.props.skill.renderCertificates
            || this.props.skill.requireCertificate
            || !this.props.employeeSkill.required) ? ' has-border-bottom' : '';
        let noMinHeight = !this.props.skill.renderCertificates ? ' table-container no-min-height' : 'table-container';
        let classNameHeader = this.props.isOptional ? 'title title-optional' : 'title';
        let classNameBoxContent = this.props.isOptional ? 'col-md-12 border-box-content' : 'border-box-content';

        return (
            <div className={classNameBoxContent + errorClass}>
                <div className={"border-box-header" + hasBorderBottom}>
                    {!this.props.isOptional ?
                        <MyCheckBox
                            ref={(checkbox) => this.checkbox = checkbox}
                            label=''
                            className="filled-in"
                            id={checkboxId}
                            defaultValue={this.props.employeeSkill.required}
                            onChange={this.handleCheckboxChange}
                        /> : null
                    }

                    <div className={classNameHeader}>{this.props.skill.name}
                        {
                            this.props.isOptional &&
                            <i onClick={this.handleRemove} className="trash-icon fa fa-times" aria-hidden="true" />
                        }
                        {
                            !_.isEmpty(this.state.errorText) ?
                                <PopoverIcon
                                    className="popover-error popover-input"
                                    ref={(popoverIcon) => this.popoverIcon = popoverIcon}
                                    message={this.state.errorText}
                                    showOnHover
                                    iconPath='error-icon.png'
                                />
                                : null
                        }
                    </div>
                </div>
                <div className={noMinHeight}>
                    <table>
                        <tbody>
                            {!this.props.employeeSkill.required && !this.props.isOptional ? <tr>
                                <td colSpan="4">
                                    {
                                        (this.props.employeeSkill.note == '' || this.state.updateNote) ?
                                            <CommonTextField
                                                title=''
                                                hintText={RS.getString('WRITE_YOUR_REASON')}
                                                id={noteId}
                                                defaultValue={this.props.employeeSkill.note}
                                                ref={input => this.inputText = input}
                                                onKeyDown={this.handleEnterNote}
                                                onBlur={this.handleBlurNote}
                                            /> :
                                            <div className="note-action">
                                                <div className="title-note">{RS.getString('NOTE')}</div>
                                                <div className="reason-note">{this.props.employeeSkill.note}</div>
                                                <div className="td-actions">
                                                    <DropdownButton
                                                        button={
                                                            <div className="columnName" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                <a href="javascript:void(0)">
                                                                    <span>
                                                                        <i className="icon-tree-dot"></i>
                                                                    </span>
                                                                </a>
                                                            </div>
                                                        }
                                                        isRight
                                                        label=""
                                                        listActions={listDropDownNoteActions}
                                                        onClick={this.handleUpdateNote}
                                                    />
                                                </div>
                                            </div>
                                    }
                                </td>
                            </tr> : null}
                            {(this.props.employeeSkill.required || this.props.isOptional) ? this.renderCertificates() : null}
                            {this.props.skill.requireCertificate && (this.props.employeeSkill.required || this.props.isOptional) ?
                                <tr>
                                    <td colSpan="4">
                                        <label
                                            className="label-input "
                                            onClick={() => this.props.openDialogAddCertificates()}
                                        >
                                            <img src={require("../../../images/add-icon.png")} />
                                            <span>{RS.getString('ADD_CERTIFICATES')}</span>
                                        </label>
                                    </td>
                                </tr> : null}
                        </tbody>
                    </table>
                </div>

                {
                    this.state.openChangeExpiredDate &&
                    <DialogChangeExpiredDate
                        ref={(input) => this.dialogChangeExpiredDate = input}
                        isOpen={this.state.openChangeExpiredDate}
                        handleClose={this.handleClosePopup}
                        handleSubmit={this.handleSubmitPopup}
                        skill={this.props.skill}
                        certificates={this.props.certificates}
                        skillJobRoles={this.props.skillJobRoles}
                        selectedCertificate={this.state.selectedCertificate}
                        nonUpload={this.state.nonUpload}
                        mode={this.state.mode}
                    />
                }
                <DialogConfirm
                    title={RS.getString('DELETE')}
                    isOpen={this.state.openConfirmRemoveCertificate}
                    handleSubmit={this.handleSubmitDeleteCertificate}
                    handleClose={this.handleClosePopup}
                    data={this.state.deleteSkill}
                    className="delete-confirm"
                >
                    <span>{RS.getString('CONFIRM_DELETE', 'CERTIFICATE')} </span>
                </DialogConfirm>
            </div >
        );
    }
});

export default SkillTag;