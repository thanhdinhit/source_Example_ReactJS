import React, { PropTypes } from 'react';
import _ from 'lodash';
import RaisedButton from '../../../components/elements/RaisedButton';
import RS from '../../../../src/resources/resourceManager';
import DiaLog from '../../elements/Dialog';
import DialogAlert from '../../elements/DialogAlert'
import AreaAttachFileContainer from '../../../containers/Upload/AreaAttachFileContainer';
import { IMPORT_EMPLOYEE_TEMPLATE_URL } from '../../../core/common/config';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import { QUERY_STRING} from '../../../core/common/constants';
import { URL } from '../../../core/common/app.routes';

const ImportFile = React.createClass({
    propTypes: {
        isOpen: PropTypes.bool.isRequired,
        allowTypes: PropTypes.array.isRequired,
        maxSize: PropTypes.number.isRequired,
        handleClose: PropTypes.func.isRequired,
        handleImport: PropTypes.func.isRequired //return array of file which uploaded
    },
    queryString: {
        order_by: 'createdDate',
        is_desc: true,
        page_size: QUERY_STRING.PAGE_SIZE,
        page: 0,
      },
    getInitialState: function () {
        return {
            canImport: false,
            isOpenAlertDialog: false
        };
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.importResult) {
            let failed = _.get(nextProps, 'importResult.numberOfErrorRecords', 0);
            if (failed > 0) {
                this.downloadFile(API_FILE + "/" + _.get(nextProps, 'importResult.failedFile', ''));
            }
            if (!this.props.importResult) {

                this.props.handleClose();
            }
        }
        this.setState({ isOpenAlertDialog: !!nextProps.importResult });
    },

    downloadFile: function (url) {
        window.location.assign(url);
    },

    handleCloseAlertDialog: function () {
        let redirectEmp = getUrlPath(URL.EMPLOYEES);
        this.props.resetState();
        this.props.loadAllEmployee(this.queryString, redirectEmp);
        this.setState({ isOpenAlertDialog: false });
        this.areaImportFileContainer.getWrappedInstance().areaAttachFile.resetState();
    },

    handleClose: function () {
        this.areaImportFileContainer.getWrappedInstance().areaAttachFile.handleCancel();
        this.props.handleClose();
        this.setState({ canImport: false });
    },

    handleImport: function () {
        let files = this.areaImportFileContainer.getWrappedInstance().areaAttachFile.getFiles();
        this.props.handleImport(files);
    },

    handleFilesChange: function (files) {
        let completedFiles = _.filter(files, (x) => x.url);
        this.setState({ canImport: completedFiles.length > 0 });
    },

    render: function () {
        const actions = [
            <RaisedButton
                key={0}
                label={RS.getString('IMPORT')}
                onClick={this.handleImport}
                disabled={!this.state.canImport}
            />,
            <RaisedButton
                key={1}
                label={RS.getString('CANCEL')}
                onClick={this.handleClose}
                className="raised-button-fourth"
            />
        ];
        let failed = _.get(this.props, 'importResult.numberOfErrorRecords', 0);
        let success = _.get(this.props, 'importResult.numberOfSuccessfulRecords', 0);
        let total = failed + success;
        let isSuccess = failed == 0;
        let failedFile = API_FILE + _.get(this.props, 'importResult.failedFile', '');
        let content = isSuccess ?
            RS.getString('IMPORT_SUCCESS', [success]) :
            RS.getString('FAIL_IMPORT_EMPLOYEE', [
                `<span class="stat">${failed}/${total}</span>`,
                `<a id="download" class="click-here" onclick="window.location.assign('${failedFile}')">${RS.getString('CLICK_HERE')}</a>`
            ]);
        return (
            <div>
                <DiaLog
                    modal={true}
                    className="dialog-attach-file"
                    style={{ widthBody: '740px' }}
                    title={RS.getString('IMPORT_FILE_TITLE')}
                    isOpen={this.props.isOpen}
                    handleClose={this.handleClose}
                    actions={actions}>
                    <AreaAttachFileContainer
                        ref={(input) => this.areaImportFileContainer = input}
                        enable={this.props.isOpen}
                        allowTypes={this.props.allowTypes}
                        maxSize={this.props.maxSize}
                        allowNumFile={this.props.allowNumFile}
                        additionalContent={<span onClick={() => this.downloadFile(API_FILE  + "/" + IMPORT_EMPLOYEE_TEMPLATE_URL)} className="download-template">{RS.getString('DOWNLOAD_TEMPLATE')}</span>}
                        handleFilesChange={this.handleFilesChange}
                    />
                </DiaLog>
                <DialogAlert
                    modal={false}
                    icon={isSuccess ? require("../../../images/complete.png") : require("../../../images/warning.png")}
                    isOpen={this.state.isOpenAlertDialog}
                    title={isSuccess ? RS.getString('SUCCESSFUL') : RS.getString('FAILED')}
                    handleClose={this.handleCloseAlertDialog}
                >
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </DialogAlert>
            </div>
        );
    },
});

export default ImportFile;