import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as uploadActions from '../../actions/uploadActions';
import * as employeeActions from '../../actions/employeeActions';
import * as globalAction from '../../actions/globalAction';
import ImportFile from '../../components/elements/Import/ImportFile';
import { EMPLOYEE_IMPORT } from '../../core/common/config';
import RS, { Option } from '../../resources/resourceManager';

export const ImportContainer = React.createClass({
    render: function () {
        return (
            <ImportFile
                {...this.props}
                allowTypes={EMPLOYEE_IMPORT.allowTypes}
                maxSize={EMPLOYEE_IMPORT.maxSize}
                allowNumFile={EMPLOYEE_IMPORT.allowNumFile}
                handleImport={this.props.importEmployee}
                ref={(input) => this.areaImportFile = input}
            />
        );
    }
});

function mapStateToProps(state) {
    return {
        importResult: state.uploadReducer.importResult,
        payload: state.uploadReducer.payload
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadAllEmployee: bindActionCreators(employeeActions.loadAllEmployee, dispatch),
        importEmployee: bindActionCreators(employeeActions.importEmployee, dispatch),
        resetState: bindActionCreators(uploadActions.resetState, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { withRef: true }
)(ImportContainer);

