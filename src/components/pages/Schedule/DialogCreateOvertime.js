import React, { PropTypes } from 'react';
import _ from 'lodash';
import Dialog from '../../elements/Dialog';
import RaisedButton from '../../elements/RaisedButton';
import RS, { Option } from '../../../resources/resourceManager';
import TextArea from '../../elements/TextArea';
import TextView from '../../elements/TextView';
import CommonSelect from '../../elements/CommonSelect.component';

const DialogCreateOvertime = React.createClass({
    propTypes: {
        employees: PropTypes.array,
        schedule: PropTypes.object,
        timeOt: PropTypes.object
    },
    handleClose: function () {
        this.props.handleClose();
    },

    handleBack: function () {
        this.props.handleBack();
    },

    handleSend: function () {
        this.props.handleSend(this.overtimeRate.getValue(), this.comment.getValue());
    },

    render: function () {
        let actions = [
            <RaisedButton
                key={0}
                className="raised-button-fourth"
                label={RS.getString('CANCEL')}
                primary={true}
                onClick={this.handleClose}
            />,
            <RaisedButton
                key={2}
                label={RS.getString('SEND')}
                onClick={this.handleSend}
            />,

        ];
        return (
            <Dialog
                handleClose={this.handleClose}
                title={RS.getString('OVERTIME_REQUEST')}
                actions={actions}
                modal={true}
                isOpen={this.props.isOpen}
                className="dialog-overtime-request"
                style={{ widthBody: '700px' }}
            >
                <div>
                    <div className="row">
                        <div className="col-md-6 col-xs-12 ">
                            <TextView
                                title={RS.getString('CUSTOMER')}
                                value={_.get(this.props.schedule, 'group.name', '')}
                            />
                        </div>
                        <div className="col-md-6 col-xs-12">
                            <TextView
                                title={RS.getString('CONTRACT_ID')}
                                value={_.get(this.props.schedule, 'contract.identifier', '')}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-xs-12 ">
                            <TextView
                                title={RS.getString('LOCATION')}
                                value={_.get(this.props.schedule, 'location.name', '')}
                            />
                        </div>
                        <div className="col-md-6 col-xs-12 ">
                            <div className="row">
                                <div className="col-md-6 col-xs-12 ">
                                    <TextView
                                        title={RS.getString('FROM')}
                                        value={this.props.timeOt.from}
                                    />
                                </div>
                                <div className="col-md-6 col-xs-12 ">
                                    <TextView
                                        title={RS.getString('TO')}
                                        value={this.props.timeOt.to}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-xs-12 ">
                            <CommonSelect
                                clearable={false}
                                title={RS.getString("OVERTIME_RATE")}
                                ref={(input) => this.overtimeRate = input}
                                placeholder={RS.getString('SELECT')}
                                options={this.props.overtimeRate}
                                value={_.get(this.props, 'overtimeRate[0]')}
                                propertyItem={{ label: 'name', value: 'id' }}
                            />
                        </div>
                        <div className="col-md-6 col-xs-12">
                            <TextArea
                                title={RS.getString('COMMENT')}
                                line={2}
                                ref={(input) => this.comment = input}
                                placeholder={RS.getString('WRITE_YOUR_COMMENT')}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-xs-12">
                            <div className="text-view">
                                <div className="title">{RS.getString('EMPLOYEE')}</div>
                                <div className="primary-avatar-cell">
                                    {
                                        _.map(this.props.employees, (employee) => {
                                            return (
                                                <div key={employee.id} className="avatar-content">
                                                    <img src={employee.photoUrl ? (API_FILE + employee.photoUrl) : require("../../../images/avatarDefault.png")} />
                                                    <div className="cell-content">
                                                        <div className="main-label">
                                                            {employee.fullName}
                                                        </div>
                                                        <div className="sub-label">
                                                            {employee.jobRole.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </Dialog >
        );
    }
});

export default DialogCreateOvertime;
