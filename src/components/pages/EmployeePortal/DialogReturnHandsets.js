import React, { PropTypes } from 'react';
import Dialog from '../../elements/Dialog';
import RaisedButton from '../../elements/RaisedButton';
import RS from '../../../resources/resourceManager';
import CommonDatePicker from '../../elements/DatePicker/CommonDatePicker';
import AvatarSelect from '../../elements/AvatarSelect.component';
import TextArea from '../../elements/TextArea';
import { getHandsetsConstraints } from '../../../validation/handsetsConstraints';
import { HANDSET_STATUS } from '../../../core/common/constants';
import _ from 'lodash';

const propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    handleSave: PropTypes.func,
    handleCancel: PropTypes.func.isRequired
};

class DialogReturnHandsets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleSave() {
        if (this.validateForm()) {
            let handset = _.cloneDeep(this.props.handset);
            handset.assignee = null;
            handset.status = HANDSET_STATUS.IN_STOCK;
            handset.notes = this.notes.getValue();
            handset.reportedDate = this.date.getValue();
            this.props.handleSave(handset);
            this.props.handleCancel();
        }
    }

    validateForm() {
        let rs = true;
        const fields = ['date'];
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

    render() {
        const handsetsConstraints = getHandsetsConstraints();
        let propertyItemReportedBy = {
            label: 'fullName',
            value: 'id',
            photoUrl: 'photoUrl'
        }
        const actions = [
            <RaisedButton
                key="cancel"
                className="raised-button-fourth"
                label={RS.getString('CANCEL')}
                onClick={this.props.handleCancel}
            />,
            <RaisedButton
                key="save"
                label={RS.getString('SAVE')}
                primary={true}
                onClick={this.handleSave}
            />
        ];
        return (
            <Dialog
                isOpen={this.props.isOpen}
                actions={actions}
                title={this.props.title}
                modal={this.props.modal ? this.props.modal : false}
                handleClose={this.props.handleCancel}
                className="dialog-return-handsets"
            >
                <div>
                    <div className="row">
                        <div className="col-xs-12">
                        <AvatarSelect
                            placeholder="---"
                            title={RS.getString('REPORTED_BY')}
                            ref={(input) => this.reportedBy = input}
                            disabled
                            name="reportTo"
                            value={_.get(this.props.employeeInfo, 'contactDetail')}
                            propertyItem={propertyItemReportedBy}
                        />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 ">
                            <CommonDatePicker
                                startDate={this.props.startDate}
                                defaultValue={new Date()}
                                title={RS.getString('DATE')}
                                required
                                orientation="bottom"
                                constraint={handsetsConstraints.handsetsReturnDate}
                                ref={(input) => this.date = input}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <TextArea
                                title={RS.getString('NOTES')}
                                line={5}
                                ref={(input) => this.notes = input}
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

DialogReturnHandsets.propTypes = propTypes;

export default DialogReturnHandsets;