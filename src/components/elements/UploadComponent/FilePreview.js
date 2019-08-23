
import React, { PropTypes } from 'react';
import RS from '../../../../src/resources/resourceManager';
import typeConfig from '../../../constants/typeConfig';
import { getExtension } from '../../../utils/iconUtils';
import MathHelper from '../../../utils/mathHelper';

export default React.createClass({
    propTypes: {
        fileUpload: PropTypes.object.isRequired,
        handleRemove: PropTypes.func.isRequired,
        maxSize: PropTypes.number.isRequired,
        className: PropTypes.string
    },
    getDefaultProps: function () {
        return {
            fileUpload: {
                name: '',
                size: 0,
                status: '',
                percent: 100
            },
            className: 'col-md-12'
        };
    },
    handleRemove: function () {
        this.props.handleRemove(this.props.fileUpload);
    },
    render: function () {
        let cssProgressBar = "progress-bar";
        let cssStatus = "status ";
        let stringStatus = '';
        switch (this.props.fileUpload.status) {
            case typeConfig.Status.UPLOAD:
                cssProgressBar += " progress-bar-success";
                cssStatus += "status-upload";
                stringStatus = RS.getString('STATUS_DONE', [this.props.fileUpload.percent, 'DONE']);
                break;
            case typeConfig.Status.FAILED:
                stringStatus = RS.getString('FAILED');
                cssProgressBar += " progress-bar-danger";
                cssStatus += "status-failed";
                break;
            case typeConfig.Status.FAILED_TYPE_NOT_SUPPORT:
                stringStatus = RS.getString('FAILED_TYPE_NOT_SUPPORT');
                cssProgressBar += " progress-bar-danger";
                cssStatus += "status-failed";
                break;
            case typeConfig.Status.FAILED_OVERSIZE:
                stringStatus = RS.getString('FAILED_OVERSIZE', this.props.maxSize)
                cssProgressBar += " progress-bar-danger";
                cssStatus += "status-failed";
                break;
            case typeConfig.Status.PENDING:
                cssProgressBar += " progress-bar-striped active custom-progress--pending";
                cssStatus += "status-pending";
                stringStatus = RS.getString('PENDING');
                break;
            case typeConfig.Status.UPLOADING:
                cssProgressBar += " progress-bar-striped active custom-progress--uploading";
                cssStatus += "status-upload";
                stringStatus = RS.getString('UPLOADING');
                break;
            case typeConfig.Status.COMPLETED:
                cssProgressBar = "";
                cssStatus += "status-completed";
                stringStatus = RS.getString('COMPLETED');
                break;
        }
        return (

            <div className={this.props.className + " file-preview"}>
                <img src={require("../../../../src/images/svg/" + getExtension(this.props.fileUpload.name))} />
                <div className="file-preview-content-right">
                    <div className="headerfile">
                        <b className="filename">{this.props.fileUpload.name}</b>
                        <div className="filesize">{MathHelper.convertSizeFile(this.props.fileUpload.size)}</div>
                        <span onClick={this.handleRemove} className="fa fa-trash-o deleteicon"></span>
                    </div>
                    {
                        cssProgressBar != "" ? <div className="progress">
                            <div className={cssProgressBar} role="progressbar" aria-valuenow={this.props.fileUpload.percent}
                                aria-valuemin="0" aria-valuemax="100" style={{ width: this.props.fileUpload.percent + "%" }}>
                            </div>
                        </div> : null
                    }
                    <div className={cssStatus}>{stringStatus}</div>
                </div>
            </div>
        );
    }
});
