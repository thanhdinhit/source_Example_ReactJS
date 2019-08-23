import React, { PropTypes } from 'react';
import { getExtension, getName } from '../../../utils/iconUtils';
import RS, { Option } from '../../../resources/resourceManager';
import RaisedButton from '../../elements/RaisedButton';
import DialogAttachFile from '../../elements/UploadComponent/DialogAttachFile';
import DialogConfirm from '../../elements/DialogConfirm';
import { STATUS } from '../../../core/common/constants';
import { EMPLOYEE_ATTACHFILE } from '../../../core/common/config';

const AttachmentEdit = React.createClass({
    propTypes: {
        employee: PropTypes.object,
        handleEditEmployee: PropTypes.func,
    },

    getInitialState: function () {
        return {
            openDialogAttach: false,
            openDialogConfirm: false,
            deleteDocumentSelected: undefined
        };
    },
    deleteDocument: function (element) {
        this.setState({
            openDialogConfirm: true,
            deleteDocumentSelected: element
        })
    },
    handleAttachDocuments: function (files) {
        let fileAttachs = [];
        files.forEach(function (file) {
            if (file.status == STATUS.COMPLETED) {
                fileAttachs.push({ docUrl: file.url });
            }
        }.bind(this));
        this.props.handleEditEmployee(
            { files: [...this.props.employee.attachment.files, ...fileAttachs] }
        );
    },
    handleSubmitConfirmPopup: function () {
        let newDocuments = this.props.employee.attachment.files.filter(x => x.docUrl != this.state.deleteDocumentSelected.docUrl)
        this.props.handleEditEmployee({ files: newDocuments });
        this.setState({ openDialogConfirm: false })
    },
    renderAttachment: function () {
        return (
            <div className="attachment-position">
                {this.props.employee.attachment ?
                    this.props.employee.attachment.files.map(function (element, index) {
                        return (
                            <div className="col-sm-12 col-md-6 col-lg-3 document-view" key={index} >
                                <img className="icon-type-file"
                                    src={require('../../../images/svg/' + getExtension(element.docUrl))} />
                                <a className="document-name"
                                    href={API_FILE + element.docUrl }>
                                    <div>{getName(element.docUrl)}</div>
                                </a>
                                <i className="attach-remove fa fa-trash-o trash-icon"
                                    onClick={this.deleteDocument.bind(this, element)}
                                />
                            </div>
                        )
                    }.bind(this)) : ''
                }
            </div>
        );
    },

    render: function () {
        return (
            <div className="employee-attachment">
                <div className="header-attach">
                    <RaisedButton
                        label={RS.getString('ATTACH_FILES')}
                        onClick={() => { this.setState({ openDialogAttach: true }) }}
                        className="raised-button-first-secondary"
                    />
                </div>
                <div className="row attach-body">
                    {this.renderAttachment()}
                </div>
                <DialogAttachFile
                    isOpen={this.state.openDialogAttach}
                    allowTypes={EMPLOYEE_ATTACHFILE.allowTypes}
                    maxSize={EMPLOYEE_ATTACHFILE.maxSize}
                    handleClose={() => { this.setState({ openDialogAttach: false }) }}
                    handleAttach={this.handleAttachDocuments}
                />
                <DialogConfirm
                    title={RS.getString('CONFIRM')}
                    isOpen={this.state.openDialogConfirm}
                    handleSubmit={this.handleSubmitConfirmPopup}
                    handleClose={() => this.setState({ openDialogConfirm: false })}
                    data={this.state.deleteDocumentSelected}
                >
                    <span>{RS.getString('CONFIRM_DELETE', 'FILE')} </span>
                </DialogConfirm>
            </div >
        );
    }

});

export default AttachmentEdit;