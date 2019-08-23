import React, { PropTypes } from 'react';
import _ from 'lodash';

import ChooseHandsetComponent from './ChooseHandsetComponent';
import AssignHandsetInfoComponent from './AssignHandsetInfoComponent';
import Dialog from '../../elements/Dialog';
import RaisedButton from '../../elements/RaisedButton';
import Stepper from '../../elements/Stepper/Stepper';

import RS from '../../../resources/resourceManager';

const propTypes = {
    isOpen: PropTypes.bool,
    employee: PropTypes.object,
    employeeInfo: PropTypes.object,
    handsetsActions: PropTypes.object,
    handleClose: PropTypes.func,
    handsets: PropTypes.array
};

class DialogAssignHandset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curStep: 0,
            handset: null,
            searchTxt: '',
            date: null,
            notes: '',
            query: null
        };

        this.handsetPre = null;
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.renderStep = this.renderStep.bind(this);
        this.renderChooseHandset = this.renderChooseHandset.bind(this);
        this.renderAssignHandsetInfo = this.renderAssignHandsetInfo.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.handleSelectHandset = this.handleSelectHandset.bind(this);
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

    handleNext() {
        const query = this.ChooseHandset.getValues();
        this.setState({
            curStep: 1,
            searchTxt: query.identifier,
            query
        });
    }

    handleBack() {
        const handsetInfo = this.AssignHandsetInfo.getValues();
        this.handsetPre = this.state.handset;

        this.setState({
            curStep: 0,
            date: handsetInfo.reportedDate,
            notes: handsetInfo.notes
        });
    }

    handleSelectHandset(handset) {
        this.setState({ handset });
    }

    handleSave() {
        if (this.AssignHandsetInfo.validateForm()) {
            this.props.handsetsActions.assignHandset(
                this.AssignHandsetInfo.getValues(),
                this.props.employeeInfo.id
            );
        }
    }

    renderStep() {
        switch (this.state.curStep) {
            case 0: {
                return this.renderChooseHandset();
            }
            case 1: {
                return this.renderAssignHandsetInfo();
            }
        }
    }

    renderChooseHandset() {
        return (
            <ChooseHandsetComponent
                ref={(input) => this.ChooseHandset = input}
                {...this.props}
                searchTxt={this.state.searchTxt}
                handleSelectHandset={this.handleSelectHandset}
                handsetSelected={this.state.handset}
                query={this.state.query}
            />
        );
    }

    renderAssignHandsetInfo() {
        let date = _.cloneDeep(this.state.date);
        if (this.handsetPre && this.handsetPre.id !== this.state.handset.id) {
            date = null;
        }
        return (
            <AssignHandsetInfoComponent
                ref={(input) => this.AssignHandsetInfo = input}
                handset={this.state.handset}
                employeeInfo={this.props.employeeInfo}
                date={date}
                notes={this.state.notes}
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
                        disabled={!this.state.handset || _.isEmpty(this.props.handsets)}
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
                        label={<span className="label-icon">{RS.getString('SAVE')}<i className="icon-next-arrow" aria-hidden="true"></i></span>}
                        primary={true}
                        onClick={this.handleSave}
                    />
                ];
            }
        }
    }

    render() {
        const widthBody = this.state.curStep ? '496px' : '750px';
        return (
            <Dialog
                style={{ widthBody }}
                isOpen={this.props.isOpen}
                title="ASSIGN HANDSET"
                actions={this.renderActions()}
                handleClose={this.props.handleClose}
                className="dialog-assign-handset"
                modal
            >
                <div>
                    <div className="stepper-container">
                        <Stepper
                            steps={
                                [
                                    {
                                        title: RS.getString('CHOOSE_A_HANDSET'),
                                    },
                                    {
                                        title: RS.getString('FINISH'),
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