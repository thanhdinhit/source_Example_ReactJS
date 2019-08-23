import React, { PropTypes } from 'react';
import _ from 'lodash';

import SelectHandsetComponent from './SelectHandsetComponent';
import AssignMultipleHandsetComponent from './AssignMultipleHandsetComponent';
import Dialog from '../../elements/Dialog';
import RaisedButton from '../../elements/RaisedButton';
import Stepper from '../../elements/Stepper/Stepper';
import * as toastr from '../../../utils/toastr';
import * as handsetActions from '../../../actionsv2/handsetActions';

import RS, { Option } from '../../../resources/resourceManager';
import { HANDSET_STATUS } from '../../../core/common/constants';
import { showAppLoadingIndicator, hideAppLoadingIndicator } from '../../../utils/loadingIndicatorActions';

const propTypes = {
    isOpen: PropTypes.bool,
    employeeInfo: PropTypes.object,
    handsetsActions: PropTypes.object,
    handleClose: PropTypes.func,
    handsets: PropTypes.array,
    callback: PropTypes.func
};

class DialogAssignHandset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            curStep: 0,
            assignData: {
                handsets: [],
                assignDate: new Date(),
                group: null,
                assigneeId: null,
                notes: ''
            },
            filter: {}
        };

        this.handleSelectHandset = this.handleSelectHandset.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.renderStep = this.renderStep.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.renderSelectHandset = this.renderSelectHandset.bind(this);
        this.renderAssignHandset = this.renderAssignHandset.bind(this);
    }

    handleSelectHandset(selectedHandets) {
        this.setState({
            assignData: {
                ...this.state.assignData,
                handsets: selectedHandets
            }
        });
    }

    handleNext() {
        let data = this.SelectHandset.getValues();

        this.setState({
            curStep: 1,
            assignData: {
                ...this.state.assignData,
                handsets: data.handsets
            }
        });
    }

    handleBack() {
        let data = this.AssignHandset.getValues();

        this.setState({
            curStep: 0,
            assignData: {
                ...this.state.assignData,
                assignDate: data.assignDate,
                group: data.group,
                assigneeId: data.assignee.id,
                notes: data.notes
            }
        });
    }

    handleSave() {
        if (this.AssignHandset.validateForm()) {
            let data = _.cloneDeep(this.state.assignData);
            let assignInfo = this.AssignHandset.getValues();
            data.assignDate = assignInfo.assignDate;
            data.assigneeId = assignInfo.assignee.id;
            data.notes = assignInfo.notes;

            let handsetIds = [];
            data.handsets.map(element => {
                handsetIds.push(element.id);
            });
            data.handsetIds = handsetIds;
            delete data['group'];

            showAppLoadingIndicator();
            handsetActions.assignHandsets(data, this.handleCallbackAction);
        }
    }

    handleCallbackAction = (err, result) => {
        hideAppLoadingIndicator();
        if (err) {
            toastr.error(err.message, RS.getString("ERROR"));
        } else {
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
            this.props.handleClose();
            this.props.callback();
        }
    }

    renderStep() {
        switch (this.state.curStep) {
            case 0: {
                return this.renderSelectHandset();
            }
            case 1: {
                return this.renderAssignHandset();
            }
        }
    }

    renderSelectHandset() {
        return (
            <SelectHandsetComponent
                ref={(input) => this.SelectHandset = input}
                selectedHandsets={this.state.assignData.handsets}
                filter={{ type: this.props.handsetType, status: HANDSET_STATUS.IN_STOCK, }}
                handleSelectHandset={this.handleSelectHandset}
                {...this.props}
            />
        );
    }

    renderAssignHandset() {
        return (
            <AssignMultipleHandsetComponent
                ref={(input) => this.AssignHandset = input}
                assignData={this.state.assignData}
                employeeInfo={this.props.employeeInfo}
                {...this.props}
            />
        );
    }

    renderActions() {
        switch (this.state.curStep) {
            case 0: {
                return [
                    <RaisedButton
                        key={1}
                        className="raised-button-fourth"
                        label={RS.getString('CANCEL')}
                        onClick={this.props.handleClose}
                    />,
                    <RaisedButton
                        key={0}
                        label={<span className="label-icon">{RS.getString('NEXT')}<i className="icon-next-arrow" aria-hidden="true"></i></span>}
                        onClick={this.handleNext}
                        disabled={this.state.assignData.handsets.length <= 0}
                    />
                ];
            }
            case 1: {
                return [
                    <RaisedButton
                        key="cancel"
                        className="raised-button-fourth"
                        label={RS.getString('CANCEL')}
                        onClick={this.props.handleClose}
                    />,
                    <RaisedButton
                        key="back"
                        label={RS.getString('BACK')}
                        primary={true}
                        onClick={this.handleBack}
                        icon={<i className="icon-back-arrow" aria-hidden="true"></i>}
                    />,
                    <RaisedButton
                        key="save"
                        label={<span className="label-icon">{RS.getString('SAVE')}</span>}
                        primary={true}
                        onClick={this.handleSave}
                    />
                ];
            }
        }
    }

    render() {
        return (
            <Dialog
                isOpen={this.props.isOpen}
                title={RS.getString("ASSIGN_HANDSET", null, Option.UPPER)}
                actions={this.renderActions()}
                handleClose={this.props.handleClose}
                className="dialog-assign-multiple-handset"
                style={this.state.curStep == 0 ? { widthBody: '960px' } : null}
                modal
            >
                <div>
                    <div className="stepper-container">
                        <Stepper
                            steps={
                                [
                                    {
                                        title: RS.getString('SELECT_HANDSET'),
                                    },
                                    {
                                        title: RS.getString('SELECT_EMPLOYEE'),
                                    }
                                ]
                            }
                            curStep={this.state.curStep}
                        />
                    </div>
                    {this.renderStep()}
                </div>
            </Dialog>
        );
    }
}

DialogAssignHandset.propTypes = propTypes;
export default DialogAssignHandset;