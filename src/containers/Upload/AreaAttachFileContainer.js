import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as uploadActions from '../../actions/uploadActions';
import AreaAttachFile from '../../components/elements/UploadComponent/AreaAttachFile';
import * as globalAction from '../../actions/globalAction';
import { authorization } from '../../services/common';
import RIGHTS from '../../constants/rights';

export const AreaAttachFileContainer = React.createClass({
    render: function () {
        return (
            <AreaAttachFile
                {...this.props}
                ref={(input) => this.areaAttachFile = input}
            />
        );
    }
});

function mapStateToProps(state) {
    return {
        files: state.uploadReducer.files,
        curEmp: state.authReducer.curEmp,
        payload: state.uploadReducer.payload,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uploadFile: bindActionCreators(uploadActions.uploadFile, dispatch),
        deleteFile: bindActionCreators(uploadActions.deleteFile, dispatch),
        updateFilesDTO: bindActionCreators(uploadActions.updateFilesDTO, dispatch),
        resetError: bindActionCreators(globalAction.resetError, dispatch),
        resetState: bindActionCreators(uploadActions.resetState, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { withRef: true }
)(AreaAttachFileContainer);

