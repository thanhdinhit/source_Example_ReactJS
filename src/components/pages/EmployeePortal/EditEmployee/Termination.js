import React, { PropTypes } from 'react';
import * as toastr from '../../../../utils/toastr';
import _ from 'lodash';

import RaisedButton from '../../../elements/RaisedButton';
import RS, { Option } from '../../../../resources/resourceManager';
import { EMPLOYEE_STATUS} from '../../../../core/common/constants';
import TerminationDialog from './TerminationDialog';
import RejoinDialog from './RejoinDialog';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import { browserHistory } from 'react-router';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { URL } from '../../../../core/common/app.routes';

const propTypes = {
    terminations: PropTypes.array,
    terminationsActions: PropTypes.object,
    params: PropTypes.object,
    employee: PropTypes.object,
    terminationReason: PropTypes.array,
    terminationSuccess: PropTypes.bool,
    rejoinSuccess: PropTypes.bool,
    terminationError: PropTypes.object,
    rejoinError: PropTypes.object,
    resetSuccess: PropTypes.func,
    resetError: PropTypes.func
};

class Termination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openTerminationDialog: false,
            openRejoinDialog: false
        };

        this.handleClickTermination = this.handleClickTermination.bind(this);
        this.renderTerminations = this.renderTerminations.bind(this);
        this.handleCancelTermination = this.handleCancelTermination.bind(this);
        this.handleSaveTermination = this.handleSaveTermination.bind(this);
        this.handleSaveRejoin = this.handleSaveRejoin.bind(this);
        this.handleCancelRejoin = this.handleCancelRejoin.bind(this);
        this.handleClickRejoin = this.handleClickRejoin.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.terminationSuccess && prevProps.terminationSuccess !== this.props.terminationSuccess) {
            this.props.terminationsActions.getTerminations(this.props.employee.id);
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESS'));
            this.props.resetSuccess();
        }
        if (this.props.terminationError.message != '' || this.props.terminationError.exception) {
            toastr.error(RS.getString('TERMINATION_FAILED'), RS.getString('ERROR'));
            this.props.resetError();
        }
        if (this.props.rejoinSuccess && prevProps.rejoinSuccess !== this.props.rejoinSuccess) {
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESS'));
            this.props.resetSuccess();
            browserHistory.push(getUrlPath(URL.REJOIN_EMPLOYEE));
        }
        if (this.props.rejoinError.message != '' || this.props.rejoinError.exception) {
            toastr.error(RS.getString('REJOIN_FAILED'), RS.getString('ERROR'));
            this.props.resetError();
        }
    }

    handleClickTermination() {
        this.setState({ openTerminationDialog: true });
    }

    handleClickRejoin() {
        this.setState({ openRejoinDialog: true });
    }

    handleSaveTermination(termination) {
        this.setState({ openTerminationDialog: false });
        termination.startDate = this.props.employee.contactDetail.startDate;
        this.props.terminationsActions.termination(this.props.employee.id, termination);
    }
    handleCancelTermination() {
        this.setState({ openTerminationDialog: false });
    }

    handleSaveRejoin(rejoinedDate) {
        this.setState({ openRejoinDialog: false });
        this.props.terminationsActions.rejoin(this.props.employee.id, rejoinedDate);
    }

    handleCancelRejoin() {
        this.setState({ openRejoinDialog: false });
    }

    renderTerminations() {
        if (_.isEmpty(this.props.terminations))
            return (
                <div className = "termination-first-time">
                        <div dangerouslySetInnerHTML={{
                            __html: `${RS.getString("P143", [_.get(this.props.employee, 'contactDetail.fullName')])}`
                        }} />
                        <RaisedButton
                            label={RS.getString('TERMINATE')}
                            onClick={this.handleClickTermination}
                            className="raised-button-first-secondary"
                        />
                </div>
            )
        return (
            <div>
                <div className="termination-action">
                    {this.props.employee.status === EMPLOYEE_STATUS.ACTIVE ?
                        <RaisedButton
                            label={RS.getString('TERMINATE')}
                            onClick={this.handleClickTermination}
                            className="raised-button-first-secondary"
                        /> :
                        <RaisedButton
                            label={RS.getString('REJOIN')}
                            onClick={this.handleClickRejoin}
                            className="raised-button-first-secondary"
                        />
                    }
                </div>
                <table className="metro-table">
                    <MyHeader>
                        <MyRowHeader>
                            <MyTableHeader
                                name={'employee_start_date'}
                                style={{ width: '20%' }}
                            >
                                {RS.getString('START_DATE', null, Option.CAPEACHWORD)}
                            </MyTableHeader>
                            <MyTableHeader
                                name={'terminated_date'}
                                style={{ width: '20%' }}
                            >
                                {RS.getString('TERMINATED_DATE', null, Option.CAPEACHWORD)}
                            </MyTableHeader>
                            <MyTableHeader
                                style={{ width: '22%' }}
                                name={'reason'}
                            >
                                {RS.getString('REASON')}
                            </MyTableHeader>
                            <MyTableHeader
                                name={'type'}
                                style={{ width: '13%' }}
                            >
                                {RS.getString('TYPE')}
                            </MyTableHeader>
                            <MyTableHeader
                                name={'comment'}
                            >
                                {RS.getString('COMMENT')}
                            </MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {this.props.terminations.map(function (termination, index) {
                            let { data } = termination;
                            return (
                                <tr key={index}>
                                    <td>{data.startDate}</td>
                                    <td>{data.terminatedDate}</td>
                                    <td>{data.reason.name}</td>
                                    <td>{data.type}</td>
                                    <td>{data.comment}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        return (
            <div className="termination-tab">


                {this.renderTerminations()}
                {
                    this.state.openTerminationDialog &&
                    <TerminationDialog
                        startDate={this.props.employee.contactDetail.startDate || undefined}
                        isOpen={this.state.openTerminationDialog}
                        title={RS.getString('TERMINATE', null, 'UPPER')}
                        handleSave={this.handleSaveTermination}
                        handleCancel={this.handleCancelTermination}
                        terminationReason={this.props.terminationReason}
                        handleClose={this.handleCancelTermination}
                        confirmPassword={this.props.confirmPassword}
                        confirmPW={this.props.confirmPW}
                        payload={this.props.confirmPasswordPayload}
                        curEmp = {this.props.curEmp}
                    />
                }
                <RejoinDialog
                    isOpen={this.state.openRejoinDialog}
                    title={RS.getString('REJOIN', null, 'UPPER')}
                    handleSave={this.handleSaveRejoin}
                    handleCancel={this.handleCancelRejoin}
                    handleClose={this.handleCancelRejoin}
                />
            </div >
        );
    }
}

Termination.propTypes = propTypes;

export default Termination;

