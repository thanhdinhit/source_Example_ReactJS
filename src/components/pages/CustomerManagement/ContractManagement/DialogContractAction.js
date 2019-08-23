import React from 'react';
import _ from 'lodash';

import RaisedButton from '../../../elements/RaisedButton';
import RS from '../../../../resources/resourceManager';
import Dialog from '../../../elements/Dialog';
import RadioButton from '../../../elements/RadioButton';
import Constraints from '../../../../validation/common.constraints';
import CommonDatepicker from '../../../elements/DatePicker/CommonDatePicker';
import TextArea from '../../../elements/TextArea';

const OPTIONS = {
    OPTION_1: 0,
    OPTION_2: 1
};
class DialogContractAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            optionChecked: null
        };
        this.actionDateValue = new Date();
        this.handleOk = this.handleOk.bind(this);
        this.handleOnchange = this.handleOnchange.bind(this);
        this.handleOnBlurActionDate = this.handleOnBlurActionDate.bind(this);
    }

    componentDidMount() {
        let optionChecked = null;
        switch (true) {
            case this.props.option1.checked: {
                optionChecked = OPTIONS.OPTION_1;
                break;
            }
            case this.props.option2.checked: {
                optionChecked = OPTIONS.OPTION_2;
                break;
            }
        }

        this.setState({ optionChecked });
    }

    handleOnchange(option) {
        this.setState({ optionChecked: option }, this.actionDateRef.validate);
    }

    handleOnBlurActionDate(date) {
        this.actionDateValue = new Date(date);
    }

    validate() {
        let rs = true;
        let fieldsToValid = ['reason'];
        if (this.state.optionChecked === OPTIONS.OPTION_2) {
            fieldsToValid.push('actionDateRef');
        }
        _.forEach(fieldsToValid, field => {
            if (!this[field].validate()) {
                rs = false;
            }
        });
        return rs;
    }

    handleOk() {
        if (this.validate()) {
            const date = this.state.optionChecked === OPTIONS.OPTION_1 ? undefined : this.actionDateValue;
            this.props.handleSubmit(date, this.reason.getValue());
        }
    }

    render() {
        let { contract } = this.props;
        let actionDateConstraint = this.state.optionChecked === OPTIONS.OPTION_1 ? {} : Constraints.isValidDate(contract.startDate, contract.endDate);
        return (
            <div>
                <Dialog
                    style={{ widthBody: '500px' }}
                    isOpen={this.props.isOpen}
                    title={this.props.title}
                    actions={[
                        <RaisedButton
                            key={0}
                            onClick={this.props.handleCancel}
                            label={RS.getString('CANCEL')}
                            className="raised-button-fourth"
                        />,
                        <RaisedButton
                            key={1}
                            onClick={this.handleOk}
                            label={RS.getString('OK')}
                            primary
                        />
                    ]}
                    handleClose={this.props.handleCancel}
                    className="contract-action-dialog"
                    modal
                >
                    <div>
                        <div className="contract-action-dialog">
                            <RadioButton
                                ref={(input) => this.option1 = input}
                                checked={this.state.optionChecked === OPTIONS.OPTION_1}
                                title={this.props.option1.title}
                                onChange={this.handleOnchange.bind(this, OPTIONS.OPTION_1)}
                            />
                            <div className="row">
                                <div className="col-md-7">
                                    <RadioButton
                                        ref={(input) => this.option2 = input}
                                        checked={this.state.optionChecked === OPTIONS.OPTION_2}
                                        title={this.props.option2.title}
                                        onChange={this.handleOnchange.bind(this, OPTIONS.OPTION_2)}
                                    />
                                </div>
                                <div className="col-md-5">
                                    <CommonDatepicker
                                        ref={(input) => this.actionDateRef = input}
                                        hintText="dd/mm/yyyy"
                                        id="startDate"
                                        constraint={actionDateConstraint}
                                        defaultValue={this.actionDateValue}
                                        orientation="bottom auto"
                                        language={RS.getString("LANG_KEY")}
                                        onBlur={this.handleOnBlurActionDate}
                                    // onBlur={this.handleOnBlurActionDate}
                                    />
                                </div>
                            </div>
                            <TextArea
                                title={RS.getString('REASON')}
                                required
                                line={5}
                                ref={(input) => this.reason = input}
                                constraint={Constraints.requiredWithMessage(RS.getString('E110', 'REASON'))}
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default DialogContractAction;