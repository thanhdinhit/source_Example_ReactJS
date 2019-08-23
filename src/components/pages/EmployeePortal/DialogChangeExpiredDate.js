import React, { PropTypes } from 'react';
import Dialog from '../../elements/Dialog';
import RaisedButton from '../../../components/elements/RaisedButton';
import RS, { Option } from '../../../resources/resourceManager';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import moment from 'moment';
import dateHelper from '../../../utils/dateHelper';
import update from 'react-addons-update';
import { getEmployeeConstraints } from '../../../validation/employeeConstraints';
import _ from 'lodash';
import { DATE } from '../../../core/common/constants';
import CommonDatePickerInline from '../../elements/DatePicker/CommonDatePickerInline';
import CommonSelect from '../../elements/CommonSelect.component';
import MyCheckBox from '../../elements/MyCheckBox';
import { getExtension, getName } from '../../../utils/iconUtils';
import FilePreview from '../../elements/UploadComponent/FilePreview';
import typeConfig from '../../../constants/typeConfig';
import { updateFilesDTO, deleteFile } from '../../../actions/uploadActions';
import * as config from '../../../core/common/config';
import * as UploadService from '../../../services/upload.service';


export const MODE = {
    EDIT: 'edit',
    NEW: 'New'
};
export default React.createClass({
    propTypes: {
        isOpen: PropTypes.bool.isRequired,
        handleClose: PropTypes.func.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        title: PropTypes.string,
        allowNumFile: PropTypes.number,
        mod: PropTypes.string
    },
    getDefaultProps: function () {
        return {
            allowTypes: config.EMPLOYEE_ATTACHFILE.allowTypes,
            allowNumFile: 1,
            maxSize: config.EMPLOYEE_ATTACHFILE.maxSize
        };
    },
    getInitialState: function () {
        return {
            textValue: dateHelper.handleFormatDateAsian(new Date()),
            certificate: {
                isNeverExpired: true,
                monthsNotify: 1,
                expiredDate: new Date(),
                isChecked: false
            },
            file: [],
            isUploading: false,
            uploadSuccess: false,
        };
    },
    componentWillReceiveProps: function () {
        this.setState({
            isUploading: false
        });
    },


    defaultCertificate: {
        isNeverExpired: true,
        monthsNotify: 1,
        expiredDate: undefined,
        isChecked: false
    },
    notifyBeforeMonthOptions: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 }
    ],
    handleClose: function () {
        this.props.handleClose();
    },
    handleCancel: function () {
        this.props.handleClose();
    },
    handleUserInput: function () {
        if (!this.state.certificate.isNeverExpired) {
            if (this.certificateDate.validate()) {
                this.props.handleSubmit(_.cloneDeep(this.state.certificate));
                this.props.handleClose();
            }
        }
        else {
            this.props.handleSubmit(_.cloneDeep(this.state.certificate));
            this.props.handleClose();
        }
    },

    handleDateChange: function (date) {
        this.setState({
            textValue: _.isUndefined(date) ? '' : dateHelper.handleFormatDateAsian(date),
            certificate: update(this.state.certificate, {
                expiredDate: {
                    $set: date
                }
            }),
        });
        if (this.state.certificate.expiredDate) {
            this.setState({
                certificate: update(this.state.certificate, {
                    isChecked: {
                        $set: true
                    }
                }),
            })
        }
    },

    handleTextFieldChange: function () {
        if (this.certificateDate.validate()) {
            let dateValue = moment(this.certificateDate.getValue(), DATE.FORMAT)._d
            this.setState({
                certificate: update(this.state.certificate, {
                    expiredDate: {
                        $set: dateValue
                    }
                }),
                isChecked: {
                    $set: false
                },
            });
        }
    },

    handleChangeOption: function () {
        if (this.state.certificate.isChecked) {
            return this.setState({
                certificate: update(this.state.certificate, {
                    expiredDate: {
                        $set: null
                    },
                    isNeverExpired: {
                        $set: true
                    },
                    isChecked: {
                        $set: false
                    },
                })
            });
        }
        return this.setState({
            certificate: update(this.state.certificate, {
                isNeverExpired: {
                    $set: false
                },
                isChecked: {
                    $set: true
                },
            })
        });
    },

    handleFile: function (e) {
        let file = e.target.files[0];
        let newFile = {};
        newFile.size = file.size;
        newFile.name = file.name;
        newFile.status = typeConfig.Status.PENDING;
        newFile.percent = 100;
        this.validateFile(newFile, this.props.allowTypes, this.props.maxSize);
        this.setState({
            isUploading: true,
            file: newFile
        });
        if (newFile.status == typeConfig.Status.PENDING)
            if (newFile.name) {
                newFile.status = typeConfig.Status.UPLOADING;
                var data = new FormData();
                data.append('uploadingFiles', file, file.name);
                UploadService.uploadFile(data, (error, result) => {
                    if (error) {
                        this.setState({
                            file: update(this.state.file, {
                                status: {
                                    $set: typeConfig.Status.FAILED
                                }
                            }),
                            isUploading: false,
                            uploadSuccess: false,
                        });
                    }
                    else {
                        let fileDTO = {
                            name: file.name,
                            relativeFilePath: result.items[0].data.relativeFilePath
                        };
                        this.setState({
                            file: update(this.state.file, {
                                status: {
                                    $set: typeConfig.Status.COMPLETED
                                }
                            }),
                            certificate: update(this.state.certificate, {
                                url: {
                                    $set: fileDTO.relativeFilePath
                                },
                                expiredDate: {
                                    $set: new Date()
                                }
                            }),
                            uploadSuccess: true,
                            isUploading: false
                        });
                    }
                });
            }
    },
    validateFile: function (file, arrAllowType, maxSize) {
        let extension = file.name.split('.');
        let type = extension[extension.length - 1].toLowerCase();
        if (file.size / (1024 * 1024) > maxSize) {
            file.status = typeConfig.Status.FAILED_OVERSIZE;
        }
        if (!arrAllowType.find(x => x.toLowerCase() == type)) {
            file.status = typeConfig.Status.FAILED_TYPE_NOT_SUPPORT;
        }
    },

    renderAttachFile: function () {
        return (
            <div className="attach-body-file">
                <FilePreview
                    className="attach-file-expired"
                    fileUpload={this.state.file}
                    handleRemove={this.handleRemove}
                    maxSize={this.props.maxSize} />
            </div>
        );
    },

    handleRemove: function (file) {
        if (file.url) {
            deleteFile(file.url);
        }
        updateFilesDTO(file);
        this.setState({
            isUploading: false
        })
    },

    getValue: function () {
        return _.clone(this.state.certificate);
    },

    setValue: function (certificate) {
        const certificateClone = _.cloneDeep(certificate);
        let textValue = '';
        let newCertificate;
        if (certificate.expiredDate) {
            textValue = dateHelper.handleFormatDateAsian(certificate.expiredDate);
            newCertificate = _.assign({}, this.defaultCertificate, certificateClone);
        }
        else {
            newCertificate = _.merge(certificateClone, this.defaultCertificate)
            if (newCertificate.expiredDate === null) {
                newCertificate.expiredDate = undefined;
            }
        }
        this.setState({
            certificate: newCertificate,
            textValue
        });
    },

    renderCertificates: function () {
        let certificate = {}
        if (this.state.certificate)
            certificate = this.state.certificate;
        else {
            certificate = this.props.selectedCertificate;
        }
        let status = dateHelper.formatExpiredDate(certificate.expiredDate);
        switch (status) {
            case 'Nearly_Expired':
                status = '';
                break;
            case 'Expired':
                status = 'expired';
                break;
        }
        let labelStatus = ''
        if (this.state.uploadSuccess) {
            labelStatus = 'Completed';
            status = 'completed'
        }
        else {
            labelStatus = RS.getString((dateHelper.formatExpiredDate(certificate.expiredDate)).toUpperCase())
        }
        return (
            <tr className="line">
                <td className="td-icon">
                    <img src={require('../../../images/svg/' + getExtension(certificate.url))} />
                </td>
                <td className="td-name">
                    <div>
                        <a href={API_FILE + certificate.url}>
                            <span>{getName(certificate.url)}</span>
                        </a>
                        <div className="td-expiredDate">
                            {
                                certificate.expiredDate ?
                                    <div>
                                        <span className={status}>
                                            {labelStatus}
                                        </span>
                                    </div> : ''
                            }
                        </div>
                    </div>
                </td>
                <td>
                    <label htmlFor="anotherFile" className="label-button-first-secondary">
                        {RS.getString('UPLOAD_ANOTHER_FILE')}
                    </label>
                    <input ref="inputFile" className="inputfile" id="anotherFile" type="file" onChange={this.handleFile} />
                </td>
            </tr>
        );
    },

    render: function () {
        let mode = this.props.mode;
        switch (mode) {
            case MODE.NEW: mode = [
                <RaisedButton
                    key={1}
                    className="raised-button-fourth"
                    label={RS.getString('CANCEL')}
                    onClick={this.handleClose}
                />,
                <RaisedButton
                    key={0}
                    label={RS.getString('SAVE')}
                    onClick={this.handleUserInput}
                />]
                break;
            case MODE.EDIT:
                mode = [
                    <RaisedButton
                        key={1}
                        className="raised-button-fourth"
                        label={RS.getString('CANCEL')}
                        onClick={this.handleClose}
                    />,
                    <RaisedButton
                        key={0}
                        label={RS.getString('UPDATE')}
                        onClick={this.handleUserInput}
                        disabled={this.state.file.length == 0 ? true : false}
                    />]; break;
        }
        let curDay = dateHelper.formatTimeWithPattern(new Date);
        let expiredDateContrains = getEmployeeConstraints().expiredCertificate;
        return (
            <Dialog
                style={{ widthBody: '366px' }}
                isOpen={this.props.isOpen}
                actions={mode}
                title={(this.props.mode == MODE.EDIT) ? RS.getString('UPDATE_ATTACHED_FILE', null, Option.UPPER)
                    : RS.getString('ADD_EXPIRY_DATE', null, Option.UPPER)}
                modal={this.props.modal ? this.props.modal : false}
                handleClose={this.handleClose}>
                <div className="dialog-change-expired-date">
                    <div>
                        {
                            this.state.isUploading ? this.renderAttachFile(this.state.file) :
                                <div className="table-container view">
                                    <table>
                                        <tbody>
                                            {
                                                !this.props.nonUpload &&
                                                this.renderCertificates()
                                            }
                                        </tbody>
                                    </table>
                                </div>
                        }
                        <div className="expired-checked">
                            <MyCheckBox
                                label={RS.getString('VALID_UNTIL')}
                                className="filled-in"
                                id="valid"
                                defaultValue={this.state.certificate.isChecked}
                                onChange={this.handleChangeOption}
                            />
                            <div className="expired-on-text-field">
                                <CommonTextField
                                    hintText="dd/mm/yyyy"
                                    fullWidth={true}
                                    className="textfield-noanimation"
                                    constraint={expiredDateContrains}
                                    ref={(input) => this.certificateDate = input}
                                    onBlur={this.handleTextFieldChange}
                                    defaultValue={this.state.textValue}
                                    disabled={this.state.certificate.isNeverExpired}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="expired-calendar">
                        <CommonDatePickerInline
                            language={RS.getString('LANG_KEY')}
                            ref={(input) => this.dateC = input}
                            hintText="dd/mm/yyyy"
                            defaultValue={this.state.certificate.expiredDate}
                            onChange={this.handleDateChange}
                            today={true}
                            startDate={curDay}
                        />
                        {
                            this.state.certificate.isNeverExpired ? <div className="disable-calendar" /> : null
                        }
                    </div>
                    <div className="notify-before-months">
                        <label>{RS.getString('REMIND')}</label>
                        <CommonSelect
                            className="dialog-select-month"
                            placeholder={RS.getString('SELECT')}
                            clearable={false}
                            name="notify"
                            value={this.state.certificate.monthsNotify}
                            options={this.notifyBeforeMonthOptions}
                            disabled={this.state.certificate.isNeverExpired}
                            onChange={(option) => {
                                this.setState({
                                    certificate: update(this.state.certificate,
                                        {
                                            monthsNotify: {
                                                $set: option.value
                                            }
                                        })
                                });
                            }}
                        />
                        <label>{RS.getString('P130')}</label>
                    </div>
                </div>
            </Dialog>
        );
    }
});