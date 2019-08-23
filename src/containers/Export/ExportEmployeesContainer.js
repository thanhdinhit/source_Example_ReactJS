import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as employeeActions from '../../actions/employeeActions';
import { EMPLOYEE_COLUMNS } from '../../core/common/constants';
import * as globalAction from '../../actions/globalAction';
import ExportDialog from '../../components/elements/Export/ExportDialog';

const propTypes = {
    exportEmployees: PropTypes.func,
    handleClose: PropTypes.func,
    isOpen: PropTypes.bool
};
class ExportEmployeesContainer extends React.Component {
    constructor(props) {
        super(props);
        this.items = [];
    }

    componentDidMount() {
        const items = [];
        // generate columns array
        for (let key in EMPLOYEE_COLUMNS) {
            items.push({
                label: key,
                value: EMPLOYEE_COLUMNS[key],
                checked: true
            });
        }
        this.items = items;
    }

    render() {
        return (
            <ExportDialog
                {...this.props}
                handleExport={this.props.exportEmployees}
                items={this.items}
            />
        );
    }
}

function mapStateToProps(state) {
    const { relativeFilePath, payload } = state.exportReducer;
    return {
        relativeFilePath,
        payload
    };
}

function mapDispatchToProps(dispatch) {
    return {
        exportEmployees: bindActionCreators(employeeActions.exportEmployees, dispatch),
        resetError: bindActionCreators(globalAction.resetError, dispatch),
        resetState: bindActionCreators(globalAction.resetState, dispatch),
        resetSuccess: bindActionCreators(globalAction.resetSuccess, dispatch)
    };
}

ExportEmployeesContainer.propTypes = propTypes;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExportEmployeesContainer);