import React, { PropTypes } from 'react';
import _ from 'lodash';

import Dialog from '../../../elements/Dialog';
import TextView from '../../../elements/TextView';
import DialogAttachFile from '../../../elements/UploadComponent/DialogAttachFile';
import RaisedButton from '../../../elements/RaisedButton';
import EmailView from './EmailView';
import FileAttachment from './FileAttachment';
import DialogConfirm from '../../../elements/DialogConfirm';
import DialogLeaveActions from './DialogLeaveActions';
import MyCheckBox from '../../../elements/MyCheckBox';

import { STATUS, LEAVE_ACTION_TYPE, DATA_CONSTANT } from '../../../../core/common/constants';
import { EMPLOYEE_ATTACHFILE } from '../../../../core/common/config';
import RS from '../../../../resources/resourceManager';

const propTypes = {
    isOpen: PropTypes.bool,
    leave: PropTypes.object,
    handleClose: PropTypes.func,
    leaveActions: PropTypes.object,
    leaveId: PropTypes.number
};

class DialogViewLeaveDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // openDialogAttach: false,
            // openDialogConfirm: false,
            // isOpenCancelLeave: false,
            // deleteDocumentSelected: undefined
        };
        // this.renderAttachments = this.renderAttachments.bind(this);
        // this.renderCcEmails = this.renderCcEmails.bind(this);
        // this.handleAttachDocuments = this.handleAttachDocuments.bind(this);
        // this.openDialogAttachFile = this.openDialogAttachFile.bind(this);
        // this.handleDeleteDocument = this.handleDeleteDocument.bind(this);
        // this.handleSubmitConfirmPopup = this.handleSubmitConfirmPopup.bind(this);
        // this.handleSubmitCancelLeave = this.handleSubmitCancelLeave.bind(this);
        // this.handleOpenCancelLeave = this.handleOpenCancelLeave.bind(this);
    }

    // componentWillReceiveProps(nextProps) {
    //     if (!_.isEqual(nextProps.leave, this.props.leave)) {
    //         this.setState({ isOpenCancelLeave: false });
    //     }
    // }

    // handleOpenCancelLeave() {
    //     this.setState({ isOpenCancelLeave: true });
    // }

    // handleSubmitCancelLeave(reason) {
    //     let leave = _.cloneDeep(this.props.leave);
    //     leave.commentDeclinedOrCanceled = reason;
    //     leave.leaveStatus = STATUS.CANCELED;
    //     this.props.leaveActions.updateLeave(leave.id, leave);
    // }

    // handleDeleteDocument(element) {
    //     this.setState({
    //         openDialogConfirm: true,
    //         deleteDocumentSelected: element
    //     });
    // }

    // handleAttachDocuments(files) {
    //     let fileAttachs = [];
    //     files.forEach(function (file) {
    //         if (file.status == STATUS.COMPLETED) {
    //             fileAttachs.push({ fileUrl: file.url });
    //         }
    //     }.bind(this));

    //     !_.isEmpty(fileAttachs) && this.props.leaveActions.updateLeave(
    //         this.props.leave.id,
    //         _.assign({}, this.props.leave, {
    //             attachedFiles: [...this.props.leave.attachedFiles, ...fileAttachs]
    //         })
    //     );
    // }

    // handleSubmitConfirmPopup() {
    //     let attachedFiles = this.props.leave.attachedFiles.filter(
    //         x => x.fileUrl != this.state.deleteDocumentSelected.fileUrl
    //     );
    //     this.props.leaveActions.updateLeave(this.props.leave.id, _.assign({}, this.props.leave, {
    //         attachedFiles
    //     }));
    //     this.setState({
    //         openDialogConfirm: false
    //     });
    // }

    // openDialogAttachFile() {
    //     this.setState({
    //         openDialogAttach: true
    //     });
    // }

    // renderAttachments(attachedFiles) {
    //     let result = [];
    //     const canEdit = this.props.leave.leaveStatus === STATUS.PENDING &&
    //         (new Date(this.props.leave.leaveFrom)).getTime() >= (new Date()).getTime();

    //     result = _.map(attachedFiles, (element, index) => {
    //         return (
    //             <FileAttachment
    //                 className="col-xs-6"
    //                 key={index}
    //                 file={element}
    //                 canDelete={canEdit}
    //                 deleteDocument={this.handleDeleteDocument}
    //             />
    //         );
    //     });

    //     canEdit && result.push(
    //         <div className="col-xs-6 attach-files" key="9999">
    //             <img onClick={this.openDialogAttachFile} src={require('../../../../images/add-icon.png')} />
    //             <span onClick={this.openDialogAttachFile}>{RS.getString('ATTACH_FILES')}</span>
    //         </div>
    //     );

    //     return result;
    // }

    // renderCcEmails(ccEmails) {
    //     if (ccEmails) {
    //         const emails = ccEmails.split(';');
    //         return _.map(emails, function (email, index) {
    //             return (
    //                 <EmailView
    //                     key={index}
    //                     email={email}
    //                 />
    //             );
    //         });
    //     }
    //     return null;
    // }

    render() {
        if (_.isEmpty(this.props.leave)) return null;
        const { leave } = this.props;
        const actions = [
            <RaisedButton
                key="close"
                className="raised-button-fourth"
                label={RS.getString('CLOSE')}
                onClick={this.props.handleClose}
            />
        ];

        return (
            <div>
                <Dialog
                    style={'496px'}
                    isOpen={this.props.isOpen}
                    title={RS.getString('MY_LEAVE', null, 'UPPER')}
                    handleClose={this.props.handleClose}
                    actions={actions}
                    className="view-leave-detail"
                    modal
                >
                    <div className="view-leave-detail">
                        <div className="row">
                            <div className="col-md-6 col-xs-12 ">
                                <TextView
                                    title={RS.getString('LEAVE_TYPE')}
                                    value={leave.leaveType.name}
                                />
                            </div>
                            <div className="col-md-6 col-xs-12">
                                <div className="text-view">
                                    <div className="title" />
                                    <div className={"status " + leave.leaveStatus}>
                                        <span>{leave.leaveStatus}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-xs-12 ">
                                <TextView
                                    title={RS.getString('START')}
                                    value={leave.leaveFromString}
                                />
                            </div>
                            <div className="col-md-6 col-xs-12">
                                <TextView
                                    title={RS.getString('END')}
                                    value={leave.leaveToString}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-xs-12 ">
                                <TextView
                                    disabled
                                    title={RS.getString('APPROVER')}
                                    image={_.get(leave, 'approver.photoUrl', '') ? API_FILE + _.get(leave, 'approver.photoUrl', '') : require("../../../../images/avatarDefault.png")}
                                    value={_.get(leave, 'approver.fullName', '')}
                                />
                            </div>
                            <div className="col-md-6 col-xs-12">
                                <TextView
                                    title={RS.getString('LEAVE_HOURS')}
                                    value={leave.leaveHours || '0.0'}
                                />
                            </div>
                        </div>
                        {
                            leave.leaveType.name === DATA_CONSTANT.LEAVE.SPECIAL_LEAVE &&
                            <div className="row">
                                <div className="col-md-12">
                                    <TextView
                                        title={RS.getString('REASON')}
                                        value={leave.reason}
                                    />
                                </div>
                            </div>
                        }
                        {
                            leave.leaveType.name === DATA_CONSTANT.LEAVE.SICK_LEAVE &&
                            <div className="row">
                                <div className="col-xs-12 col-md-12">
                                    <MyCheckBox
                                        disabled
                                        bodyClassName="with-medical-certificate"
                                        label={RS.getString('WITH_MEDICAL_CERTIFICATE')}
                                        defaultValue={leave.isCertificate}
                                        onChange={this.handleMedicalCertificateChange}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                </Dialog>


            </div>
        );
    }
}

DialogViewLeaveDetail.propTypes = propTypes;
export default DialogViewLeaveDetail;