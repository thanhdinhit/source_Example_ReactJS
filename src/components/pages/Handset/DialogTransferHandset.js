import React, { PropTypes } from 'react';
import _ from 'lodash';

import SelectHandsetComponent from './SelectHandsetComponent';
import TransferHandsetComponent from './TransferHandsetComponent';
import Dialog from '../../elements/Dialog';
import RaisedButton from '../../elements/RaisedButton';
import Stepper from '../../elements/Stepper/Stepper';
import * as toastr from '../../../utils/toastr';

import RS, { Option } from '../../../resources/resourceManager';
import { transferHandsets } from '../../../actionsv2/handsetActions';
import { showAppLoadingIndicator, hideAppLoadingIndicator } from '../../../utils/loadingIndicatorActions';

const propTypes = {
    isOpen: PropTypes.bool,
    employeeInfo: PropTypes.object,
    handleClose: PropTypes.func,
    storeLocs: PropTypes.array,
    loadHandsetSummary: PropTypes.func
};

class DialogTransferHandset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            curStep: 0,
            transferData: {
                handsets: [],
                storeLoc: null,
                notes: ''
            },
            filter: {}
        };

        this.handleSelectHandset = this.handleSelectHandset.bind(this);
        this.handleSelectStoreLoc = this.handleSelectStoreLoc.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.renderStep = this.renderStep.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.renderSelectHandset = this.renderSelectHandset.bind(this);
        this.renderTransferHandset = this.renderTransferHandset.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isOpen && nextProps.isOpen) {
            this.resetInitialState();
        }
    }

    resetInitialState() {
        this.setState({
            curStep: 0,
            handset: null,
            searchTxt: '',
            date: null,
            notes: '',
            query: null
        });
    }

    handleSelectHandset(selectedHandets) {
        this.setState({
            transferData: {
                ...this.state.transferData,
                handsets: selectedHandets
            }
        });
    }

    handleSelectStoreLoc(storeLoc) {
        this.setState({
            transferData: {
                ...this.state.transferData,
                storeLoc
            }
        });
    }

    handleNext() {
        let filter = this.SelectHandset.getFilter();
        let data = this.SelectHandset.getValues();

        this.setState({
            curStep: 1,
            filter,
            transferData: {
                ...this.state.transferData,
                handsets: data.handsets
            }
        });
    }

    handleBack() {
        let data = this.TransferHandset.getValues();

        this.setState({
            curStep: 0,
            transferData: {
                ...this.state.transferData,
                storeLoc: data.storeLoc,
                notes: data.notes
            }
        });
    }

    handleSave() {
        if (this.TransferHandset.validateForm()) {
            let data = _.cloneDeep(this.state.transferData);
            let transferInfo = this.TransferHandset.getValues();
            data.handsetIds = _.map(data.handsets, 'id');
            data.storeLocId = transferInfo.storeLoc ? transferInfo.storeLoc.id : null;
            data.notes = transferInfo.notes;
            data.updatedBy = transferInfo.updatedBy;
            delete data['handsets'];
            showAppLoadingIndicator();
            transferHandsets(data, this.handleCallbackAction);
        }
    }

    handleCallbackAction = (err, result) => {
        hideAppLoadingIndicator();
        if (err) {
            toastr.error(err.message, RS.getString("ERROR"));
        } else {
            this.props.callback();
            this.props.handleClose();
            toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
        }
    }

    renderStep() {
        switch (this.state.curStep) {
            case 0: {
                return this.renderSelectHandset();
            }
            case 1: {
                return this.renderTransferHandset();
            }
        }
    }

    renderSelectHandset() {
        return (
            <SelectHandsetComponent
                ref={(input) => this.SelectHandset = input}
                selectedHandsets={this.state.transferData.handsets}
                filter={this.state.filter}
                handleSelectHandset={this.handleSelectHandset}
                {...this.props}
            />
        );
    }

    renderTransferHandset() {
        return (
            <TransferHandsetComponent
                ref={(input) => this.TransferHandset = input}
                transferData={this.state.transferData}
                employeeInfo={this.props.employeeInfo}
                storeLocs={this.props.storeLocs}
                handleSelectStoreLoc={this.handleSelectStoreLoc}
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
                        disabled={this.state.transferData.handsets.length <= 0}
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
                        disabled={this.state.transferData.storeLoc == null}
                    />
                ];
            }
        }
    }

    render() {
        return (
            <Dialog
                isOpen={this.props.isOpen}
                title={RS.getString("TRANSFER_HANDSET", null, Option.UPPER)}
                actions={this.renderActions()}
                handleClose={this.props.handleClose}
                className="dialog-transfer-handset"
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
                                        title: RS.getString('TRANSFER'),
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

DialogTransferHandset.propTypes = propTypes;
export default DialogTransferHandset;