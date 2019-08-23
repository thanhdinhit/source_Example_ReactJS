import React, { PropTypes } from 'react';
import RaisedButton from '../../../components/elements/RaisedButton';
import RS from '../../../../src/resources/resourceManager';
import typeConfig from '../../../constants/typeConfig';
import DiaLog from '../../elements/Dialog';
import AreaAttachFileContainer from '../../../containers/Upload/AreaAttachFileContainer';

const DialogAttachFile = React.createClass({
    propTypes: {
        isOpen: PropTypes.bool.isRequired,
        allowTypes: PropTypes.array.isRequired,
        maxSize: PropTypes.number.isRequired,
        handleClose: PropTypes.func.isRequired,
        handleAttach: PropTypes.func.isRequired, //return array of file which uploaded
        title: PropTypes.string,
        attachLabel: PropTypes.string
    },

    getInitialState: function () {
        return {
            canAttach: false
        };
    },

    handleClose: function () {
        this.areaAttachFileContainer.getWrappedInstance().areaAttachFile.handleCancel();
        this.props.handleClose();
    },

    handleAttach: function () {
        let files = this.areaAttachFileContainer.getWrappedInstance().areaAttachFile.getFiles();
        this.areaAttachFileContainer.getWrappedInstance().areaAttachFile.resetState();
        this.props.handleAttach(files);
        this.props.handleClose();
    },

    handleFilesChange: function (files) {
        this.setState({ canAttach: !_.isEmpty(_.filter(files, (item) => item.status == typeConfig.Status.COMPLETED)) });
    },

    render: function () {
        const actions = [
            <RaisedButton
                key={1}
                label={RS.getString('CLOSE')}
                onClick={this.handleClose}
                className="raised-button-fourth"
            />,
            <RaisedButton
                key={0}
                disabled={!this.state.canAttach}
                label={this.props.attachLabel || RS.getString('ATTACH')}
                onClick={this.handleAttach}
            />
        ];
        return (
            <DiaLog
                modal={true}
                className="dialog-attach-file"
                style={{ widthBody: '740px' }}
                title={this.props.title || RS.getString('ATTACH_FILE_TITLE')}
                isOpen={this.props.isOpen}
                handleClose={this.handleClose}
                actions={actions}>
                <AreaAttachFileContainer
                    ref={(input) => this.areaAttachFileContainer = input}
                    enable={this.props.isOpen}
                    allowTypes={this.props.allowTypes}
                    maxSize={this.props.maxSize}
                    handleFilesChange={this.handleFilesChange}
                />
            </DiaLog>
        );
    },
});

export default DialogAttachFile;