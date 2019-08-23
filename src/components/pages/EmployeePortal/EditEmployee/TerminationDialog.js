import React, { PropTypes } from 'react';
import Dialog from '../../../elements/Dialog';
import RaisedButton from '../../../elements/RaisedButton';
import RS, { Option } from '../../../../resources/resourceManager';
import CommonDatePicker from '../../../elements/DatePicker/CommonDatePicker';
import CommonSelect from '../../../elements/CommonSelect.component';
import TextArea from '../../../elements/TextArea';
import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import DialogConfirm from '../../../elements/DialogConfirm';
import { TERMINATION_TYPE, getTerminationType } from '../../../../core/common/constants';
import { getEmployeeConstraints } from '../../../../validation/employeeConstraints';
import _ from 'lodash';

const propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    handleSave: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    modal: PropTypes.bool,
    terminationReason: PropTypes.array
};

class TerminationDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.renderDialogFirst = this.renderDialogFirst.bind(this);
        this.renderDialogSecond = this.renderDialogSecond.bind(this);
        this.handleSubmitPassword = this.handleSubmitPassword.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.payload.error.message != '') {
            this.setState({
                errorCurPass: RS.getString(nextProps.payload.error.message),
                errorNewPass: RS.getString(nextProps.payload.error.message)
            });
        }
        if (nextProps.confirmPW == true) {
            this.setState({
                dialogSecond: true,
                curPass: ''
            });
            this.curPass.setValue("");

        }
        if (!this.props.isOpen && nextProps.isOpen) {
            setTimeout(() => {
                this.curPass.focus();
            }, );
        }
    }

    handleSubmitPassword() {
        if (this.curPass.validate()) {
            this.props.confirmPassword({
                password: this.curPass.getValue(),
                userName: this.props.curEmp.userName
            });

        }
    }

    handleSave() {
        if (this.validateForm()) {
            const fields = ['terminatedDate', 'type', 'reason', 'comment'];
            let termination = {};
            let self = this;

            fields.forEach(function (field) {
                termination[field] = self[field].getValue();
            });

            termination.reason = { id: termination.reason.id };
            termination.type = termination.type.value;

            this.props.handleSave(termination);
        }
    }

    validateForm() {
        let rs = true;
        const fields = ['terminatedDate', 'type', 'reason', 'comment'];
        let self = this;

        fields.forEach(function (field) {
            if (!self[field].validate()) {
                rs = false;
            }
        });
        return rs;
    }

    handleCancel() {
        this.props.handleCancel();
    }

    renderDialogFirst() {
        return (
            <DialogConfirm
                modal
                style={{ widthBody: '415px' }}
                title={this.props.title}
                isOpen={this.props.isOpen}
                handleSubmit={this.handleSubmitPassword}
                handleClose={this.handleCancel}
                label={[RS.getString('NEXT'), RS.getString('CANCEL')]}>
                <div>
                    <p> {RS.getString('P118')}</p>
                    <div className="dialog-input-container">
                        <CommonTextField
                            type="password"
                            errorText={this.state.errorCurPass}
                            defaultValue={this.state.curPass}
                            ref={(curPass) => curPass && (this.curPass = curPass)}
                            onKeyPress={this.handleKeyPress}
                            id='first'
                        />
                    </div>
                </div>
            </DialogConfirm>
        )
    }

    renderDialogSecond() {
        const editEmployeeConstraints = getEmployeeConstraints();

        let terminationReason = [];
        if (!_.isEmpty(this.props.terminationReason)) {
            terminationReason = _.map(this.props.terminationReason, function (item) {
                let result = _.cloneDeep(item);
                result.label = RS.getString(_.toUpper(_.snakeCase(item.description)));
                return result;
            });
        }

        const actions = [
            <RaisedButton
                key="cancel"
                className="raised-button-fourth"
                label={RS.getString('CANCEL')}
                onClick={this.props.handleCancel}
            />,
            <RaisedButton
                key="yes"
                label={RS.getString('SAVE')}
                primary={true}
                onClick={this.handleSave}
            />
        ];
        return (
            <Dialog
                modalBody="none-scroll"
                isOpen={this.props.isOpen}
                actions={actions}
                title={this.props.title}
                modal={this.props.modal ? this.props.modal : false}
                handleClose={this.props.handleCancel}
            >
                <div>
                    <div className="row">
                        <div className="col-md-6 col-xs-12 ">
                            <CommonDatePicker
                                startDate={this.props.startDate}
                                title={RS.getString('END_DATE', null, Option.CAPEACHWORD)}
                                required
                                constraint={editEmployeeConstraints.terminatedDate}
                                ref={(input) => this.terminatedDate = input}
                            />
                        </div>
                        <div className="col-md-6 col-xs-12">
                            <CommonSelect
                                title={RS.getString('TYPE')}
                                required
                                className="dialog-select-month"
                                placeholder={RS.getString('SELECT')}
                                clearable={false}
                                searchable={false}
                                name="notify"
                                onChange={() => { }}
                                options={getTerminationType()}
                                ref={(input) => this.type = input}
                                constraint={editEmployeeConstraints.terminationType}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <CommonSelect
                                title={RS.getString('REASON')}
                                propertyItem={{ label: 'name', value: 'id' }}
                                required
                                className="dialog-select-month"
                                placeholder={RS.getString('SELECT')}
                                searchable={false}
                                name="notify"
                                onChange={() => { }}
                                options={terminationReason}
                                ref={(input) => this.reason = input}
                                constraint={editEmployeeConstraints.terminationReason}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <TextArea
                                title={RS.getString('COMMENT')}
                                required
                                line={5}
                                ref={(input) => this.comment = input}
                                constraint={editEmployeeConstraints.terminationComment}
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }

    render() {
        return (
            <div>
                {
                    !this.state.dialogSecond ?
                        this.renderDialogFirst() : this.renderDialogSecond()
                }
            </div>
        )
    }
}

TerminationDialog.propTypes = propTypes;

export default TerminationDialog;