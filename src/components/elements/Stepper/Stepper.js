import React, { PropTypes } from 'react';

class Stepper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.renderDoneSteps = this.renderDoneSteps.bind(this);
        this.renderCurrentStep = this.renderCurrentStep.bind(this);
        this.renderIncompleteSteps = this.renderIncompleteSteps.bind(this);
    }

    renderDoneSteps() {
        let steps = [];

        const stepDone = this.props.curStep;
        for (let i = 0; i < stepDone; i++) {
            steps.push(
                <div className="step-item step-done" key={"step-done" + i}>
                    <span><i className={this.props.steps[i].icon} /> {this.props.steps[i].title}</span>
                </div>
            );
        }

        return steps;
    }

    renderCurrentStep() {
        const curStep = this.props.curStep;
        return (
            <div className="step-item step-currently">
                <span><i className={this.props.steps[curStep].icon}></i> {this.props.steps[curStep].title}</span>
            </div>
        );
    }

    renderIncompleteSteps() {
        let steps = [];

        const beginStep = this.props.curStep + 1;
        const stepsLength = this.props.steps.length;
        for (let i = beginStep; i < stepsLength; i++) {
            steps.push(
                <div className="step-incomplete" key={"step-incomplete" + i}>
                    <span><i className={this.props.steps[i].icon}></i> {this.props.steps[i].title}</span>
                </div>
            );
        }

        return steps;
    }

    render() {
        return (
            <div className="stepper">
                {this.renderDoneSteps()}
                {this.renderCurrentStep()}
                {this.renderIncompleteSteps()}
            </div>
        );
    }
}

Stepper.propTypes = {
    steps: PropTypes.array,
    curStep: PropTypes.number
};

export default Stepper;