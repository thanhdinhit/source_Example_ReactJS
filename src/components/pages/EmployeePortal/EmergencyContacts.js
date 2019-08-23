import React, { PropTypes } from 'react';
import RS, { Option } from '../../../resources/resourceManager';
import RaisedButton from '../../elements/RaisedButton';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import DialogAddEmergencyContacts from './DialogAddEmergencyContacts';
import DialogConfirm from '../../elements/DialogConfirm';

let EmergencyContacts = React.createClass({
    propTypes: {
        emergencyContacts: PropTypes.array,
        handleDelete: PropTypes.func,
        handleAddContact: PropTypes.func,
        contactDetail: PropTypes.object
    },

    getInitialState: function () {
        return {
            isOpenDialogDelete: false,
            isOpenDialogAdd: false,
            selectedEmergencyContact: [],
            addEmergencyContact: {},
            isEdit: this.props.isEdit
        };
    },

    handleAddContact: function (contact) {
        this.setState({
            isOpenDialogAdd: true,
            addEmergencyContact: contact
        });
    },

    handleAddEmergencyContact: function (contact) {
        this.props.handleAddContact([...this.props.emergencyContacts, ...[contact]]);
        this.handleCloseDialog();
    },

    handleDelete: function (item) {
        this.setState({
            isOpenDialogDelete: true,
            selectedEmergencyContact: this.props.emergencyContacts.filter(x => x != item)
        });
    },

    handleDeleteEmergencyContact: function () {
        this.props.handleDelete(this.state.selectedEmergencyContact);
        this.handleCloseDialog();
    },

    handleCloseDialog: function () {
        this.setState({
            isOpenDialogDelete: false,
            isOpenDialogAdd: false
        });
    },

    renderEmergencyContactsView: function () {
        const { emergencyContacts } = this.props;
        return (
            <div className="row">
                {
                    emergencyContacts ?
                        emergencyContacts.map(function (item, index) {
                            return (
                                <div className="col-sm-3 emergency-box" key={index}>
                                    <div className="emergency-box-container">
                                        <div>
                                            {item.contactName}
                                        </div>
                                        <span >
                                            {item.phoneNumber}
                                        </span>
                                    </div>
                                </div>
                            );
                        }.bind(this)) : []
                }
            </div>
        );
    },

    renderEmergencyContactsEdit: function () {
        const { emergencyContacts } = this.props;
        return (
            <div className="row">
                {
                    emergencyContacts ?
                        emergencyContacts.map(function (item, index) {
                            return (
                                <div className="col-sm-3 emergency-box" key={index}>
                                    <div className="emergency-box-container">
                                        <div className="emergency-one-action">
                                            <i className="fa fa-trash-o danger"
                                                onClick={this.handleDelete.bind(this, item)}
                                            />
                                        </div>
                                        <div>
                                            {item.contactName}
                                        </div>
                                        <span >
                                            {item.phoneNumber}
                                        </span>
                                    </div>
                                </div>
                            );
                        }.bind(this)) : []
                }
                <div className="col-sm-3 add-emergency" onClick={this.handleAddContact}>
                    <div>
                        <img src={require("../../../images/add-icon.png")} />
                        <span>{RS.getString('CONTACT', null, Option.CAPEACHWORD)}</span>
                    </div>
                </div>
            </div>
        );
    },

    render: function () {
        return (
            <div className="emergency-contact">
                {
                    this.state.isEdit ?
                        this.renderEmergencyContactsEdit() : this.renderEmergencyContactsView()
                }
                <DialogAddEmergencyContacts
                    isOpen={this.state.isOpenDialogAdd}
                    handleCancel={() => this.setState({ isOpenDialogAdd: false })}
                    label={[RS.getString('SAVE'), RS.getString('CANCEL')]}
                    handleAddEmergencyContact={this.handleAddEmergencyContact}
                />
                <DialogConfirm title={RS.getString('DELETE_TITLE')}
                    className="delete-confirm"
                    isOpen={this.state.isOpenDialogDelete}
                    handleSubmit={this.handleDeleteEmergencyContact}
                    handleClose={this.handleCloseDialog}>
                    <span>{RS.format('CONFIRM_DELETE_EMPLOYEE')} {'?'} </span>
                </DialogConfirm>
            </div>
        );
    }
});

export default EmergencyContacts;