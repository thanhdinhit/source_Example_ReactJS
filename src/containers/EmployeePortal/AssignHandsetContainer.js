import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DialogAssignHandset from '../../components/pages/EmployeePortal/DialogAssignHandset';
import * as handsetsActions from '../../actions/handsetsActions';

const propTypes = {
    handleClose: PropTypes.func,
    isOpen: PropTypes.bool
}
class AssignHandsetContainer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <DialogAssignHandset
                isOpen={this.props.isOpen}
                {...this.props}
            />
        );
    }
}

function mapStateToProps(state) {
    const { handsetsSearch, handsetTypes, meta, storeLocs } = state.handsetsReducer;
    return {
        handsets: handsetsSearch,
        handsetTypes,
        meta,
        employee: state.employeeReducer.employee,
        employeeInfo: state.authReducer.employeeInfo,
        storeLocs
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handsetsActions: bindActionCreators(handsetsActions, dispatch)
    };
}

AssignHandsetContainer.propTypes = propTypes;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AssignHandsetContainer);