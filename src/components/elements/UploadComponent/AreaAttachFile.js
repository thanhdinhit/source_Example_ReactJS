import React, { PropTypes } from 'react';
import RS from '../../../../src/resources/resourceManager';
import typeConfig from '../../../constants/typeConfig';
import { clone } from '../../../services/common';
import FilePreview from './FilePreview';
import _ from 'lodash';
import * as config from '../../../core/common/config';
import { WAITING_TIME } from '../../../core/common/constants';
import DialogConfirm from '../../elements/DialogConfirm';

export default React.createClass({
    propTypes: {
        enable: PropTypes.bool.isRequired,
        allowTypes: PropTypes.array.isRequired,
        maxSize: PropTypes.number.isRequired,
        filePreviewClassName: PropTypes.string,
        files: PropTypes.array,
        resetError: PropTypes.func,
        resetState: PropTypes.func,
        uploadFile: PropTypes.func,
        deleteFile: PropTypes.func,
        updateFilesDTO: PropTypes.func,
        allowNumFile: PropTypes.number,
        additionalContent: PropTypes.element
    },

    getDefaultProps: function () {
        return {
            isOpen: false,
            allowTypes: config.EMPLOYEE_IMPORT.allowTypes,
            allowNumFile: null,
            maxSize: config.EMPLOYEE_IMPORT.maxSize,
            filePreviewClassName: 'col-md-12',
            showDialogConfirm: false
        };
    },

    getInitialState: function () {
        return {
            files: []
        };
    },

    componentWillMount: function () {
        this.props.resetState();
    },

    componentDidMount: function () {
        if (this.props.enable) {
            this.registerEventListener();
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (!this.props.enable && nextProps.enable) {
            this.registerEventListener();
        }
        if (this.props.enable && !nextProps.enable) {
            this.unRegisterEventListener();
        }
        if (!_.isEqual(this.props.files, nextProps.files)) {
            this.props.handleFilesChange && this.props.handleFilesChange(nextProps.files);
        }
    },

    componentDidUpdate: function () {
        if (this.props.payload.error.message != '' || this.props.payload.error.exception) {
            // toastr.error(this.props.payload.error.message, "Error");
            this.props.resetError();
        }
    },

    componentWillUnmount: function () {
        this.unRegisterEventListener();
    },

    registerEventListener: function () {
        document.getElementById("body-drop").addEventListener("dragover", this.handleDragOver)
        document.getElementById("body-drop").addEventListener("drop", this.handleOnDrop)
    },

    unRegisterEventListener: function () {
        document.getElementById("body-drop").removeEventListener("dragover", this.handleDragOver)
        document.getElementById("body-drop").addEventListener("drop", this.handleOnDrop)
    },

    handleOnDrop: function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.handleUploadFiles(e.dataTransfer.files);
    },

    handleDragOver: function (event) {
        event.preventDefault();
        event.stopPropagation();
    },

    handleUploadFiles: function (files) {
        let newFiles = clone(this.props.files);
        if (this.props.allowNumFile && newFiles.length + files.length > this.props.allowNumFile) {
            return alert(RS.getString('FAILED_MAX_FILE', [this.props.allowNumFile]))
        }
        let length = files.length;
        for (let i = 0; i < length; i++) {
            let file = files[i];
            if (!this.props.files.find(x => x.name == file.name)) {
                let newFile = {};
                newFile.size = file.size;
                newFile.name = file.name;
                newFile.status = typeConfig.Status.PENDING;
                newFile.percent = 100;
                newFiles.push(newFile);
                this.validateFile(newFile, this.props.allowTypes, this.props.maxSize);
                if (newFile.status == typeConfig.Status.PENDING)
                    this.createPreview(file);
            }
        }
        this.props.updateFilesDTO(newFiles);
    },
    handleAttachFileChange: function (e) {
        this.handleUploadFiles(e.target.files)
        setTimeout(function () {
            document.getElementById("input-body").value = "";
        }, WAITING_TIME);
    },
    createPreview: function (file) {
        let reader = new FileReader();
        reader.onloadend = (e) => {
            //update status uploading
            let fileDtos = clone(this.props.files)
            let fileDto = fileDtos.find(x => x.name == file.name);
            if (fileDto) {
                fileDto.status = typeConfig.Status.UPLOADING;
            }
            this.props.handleFilesChange && this.props.handleFilesChange(fileDtos);
            this.props.updateFilesDTO(fileDtos);
            this.props.uploadFile(file);
        };
        reader.readAsDataURL(file);
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
    handleRemove: function (file) {
        this.setState({ showDialogConfirm: true });
        this.fileToDelete = file;
    },
    handleSubmitDelete: function () {
        let newFiles = this.props.files.filter(x => x.name != this.fileToDelete.name);
        if (this.fileToDelete.url) {
            this.props.deleteFile(this.fileToDelete.url);
        }
        console.log(newFiles)
        this.props.updateFilesDTO(newFiles);
        this.setState({ showDialogConfirm: false });
    },
    handleCancelDelete: function () {
        this.setState({ showDialogConfirm: false });
    },
    handleCancel: function () {
        this.props.files.forEach(function (element) {
            if (element.url)
                this.props.deleteFile(element.url);
        }, this);
        this.props.resetState();
    },
    getFiles: function () {
        return _.cloneDeep(this.props.files.filter(x => x.url));
    },
    resetState: function () {
        this.props.resetState();
    },
    renderAttachFile: function () {
        let files = _.cloneDeep(this.props.files);
        files.reverse();
        return (
            <div className="attach-body-file row">
                {files ?
                    files.map((file, index) =>
                        <FilePreview
                            className={this.props.filePreviewClassName}
                            key={index}
                            fileUpload={file}
                            handleRemove={this.handleRemove}
                            maxSize={this.props.maxSize} />
                    ) : undefined}
            </div>
        );
    },
    render: function () {
        let allowTypes = this.props.allowTypes.map(x => x = '.' + x);
        allowTypes = allowTypes.join(', ')
        let title = this.props.title || RS.getString('ATTACH_FILE_BODY_TITLE');
        let content = this.props.content || RS.getString('ATTACH_FILE_BODY_CONTENT', [allowTypes, this.props.maxSize]);
        return (
            <div className="area-attach-file">
                <div className="attach-body-drag" id="body-drop" ref="dropZone">
                    <div className="attach-body-drag-content">
                        <div className="attach-body-icon">
                            <img src={require("../../../../src/images/attachfile.png")} />
                        </div>
                        <div className="attach-body-title">
                            <input className="inputfile" ref="fileInput" id="input-body" type="file" multiple={this.props.allowNumFile == 1 ? false : true} onChange={this.handleAttachFileChange} />
                            <span>
                                {title}&nbsp;
                                <label className="attach-body-browse" htmlFor="input-body">
                                    <span>{RS.getString('BROWSE')} </span>
                                </label>
                            </span>
                        </div>
                        <div className="attach-body-content">
                            <span>{content}</span>
                        </div>
                        {
                            !!this.props.additionalContent &&
                            <div className="additional-content">
                                {this.props.additionalContent}
                            </div>
                        }
                    </div>
                </div>
                {this.renderAttachFile()}
                <DialogConfirm
                    title={RS.getString('DELETE', null, 'UPPER')}
                    isOpen={this.state.showDialogConfirm}
                    handleSubmit={this.handleSubmitDelete}
                    handleClose={this.handleCancelDelete}
                    className="delete-confirm"
                >
                    <span>{RS.getString('CONFIRM_DELETE', 'FILE')} </span>
                </DialogConfirm>
            </div>
        );
    },
});