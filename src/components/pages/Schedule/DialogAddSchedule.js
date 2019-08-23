import React, { PropTypes } from 'react';
import Dialog from '../../elements/Dialog';
import RaisedButton from '../../elements/RaisedButton';
import RS, { Option } from '../../../resources/resourceManager';
import CommonSelect from '../../elements/CommonSelect.component';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import { searchSchedules } from '../../../actionsv2/scheduleActions';
import { getNewScheduleConstraints } from '../../../validation/newScheduleConstraints';
import { locationOption } from '../../../core/common/constants';
import * as toastr from '../../../utils/toastr';
import _ from 'lodash';
import { MAX_LENGTH_INPUT } from '../../../core/common/config';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleSaveContinue: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  modal: PropTypes.bool
};

class DialogAddSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDuplicated: '',
      locations: []
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSaveContinue = this.handleSaveContinue.bind(this);
    this.isOnlySave = null;
    this.handleAddNewSchedule = this.handleAddNewSchedule.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.locations) {
      let item = locationOption();
      this.setState({
        locations: nextProps.locations.concat(item)
      });
    }
  }

  handleSave() {
    this.validateForm();
    this.isOnlySave = true;
  }

  handleSaveContinue() {
    this.validateForm();
    this.isOnlySave = false;
  }

  handleCheckScheduleName(scheduleName, callback) {
    searchSchedules(scheduleName, (error, value) => {
      if (error) {
        toastr.error(error, RS.getString('ERROR'));
      }
      else {
        if (value.length > 0) {
          this.setState({ isDuplicated: RS.getString('E145') });
        }
        if (value.length == 0) {
          callback && callback();
        }
      }
    });
  }

  handleAddNewSchedule() {
    if (this.isOnlySave) {
      this.props.handleSave(this.getValue());
    }
    else {
      this.props.handleSaveContinue(this.getValue());
    }
    this.handleCancel();
  }

  validateForm() {
    let rs = true;
    const fields = ['name', 'location'];
    let self = this;
    fields.forEach(function (field) {
      if (!self[field].validate()) {
        rs = false;
      }
    });
    if (rs) {
      this.handleCheckScheduleName(this.name.getValue(), this.handleAddNewSchedule);
    }
  }

  handleCancel() {
    this.props.handleClose();
  }

  getValue() {
    let schedule = {};
    _.forEach(['name', 'group', 'location'], field => {
      schedule[field] = this[field].getValue();
    });
    if (schedule.location.id != 'flexible') {
      schedule.location = { id: schedule.location.id };
    }
    else {
      delete schedule.location
    }
    schedule.group = { id: schedule.group.id };
    return schedule;
  }

  render() {
    const newScheduleConstraints = getNewScheduleConstraints();
    let defaultGroup = _.find(this.props.manageGroups, (item) => item.supervisor.id == this.props.curEmp.employeeId);
    const actions = [
      <RaisedButton
        key="cancel"
        className="raised-button-fourth"
        label={RS.getString('CANCEL')}
        onClick={this.handleCancel}
      />,
      <RaisedButton
        key="yes"
        label={RS.getString('SAVE')}
        primary={true}
        onClick={this.handleSave}
      />,
      <RaisedButton
        key="continue"
        label={RS.getString('SAVE_CONTINUE')}
        primary={true}
        onClick={this.handleSaveContinue}
      />
    ];
    return (
      <Dialog
        isOpen={this.props.isOpen}
        actions={actions}
        title={this.props.title}
        modal
        handleClose={this.handleCancel}
        className="new-schedule"
      >
        <div>
          <div className="row">
            <div className="col-xs-12 ">
              <CommonTextField
                title={RS.getString('SCHEDULE_NAME')}
                ref={input => this.name = input}
                required
                constraint={newScheduleConstraints.scheduleName}
                onBlur={this.handleCheckScheduleName.bind(this)}
                errorText={this.state.isDuplicated}
                maxLength={MAX_LENGTH_INPUT.CONTRACT_ID}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <CommonSelect
                title={RS.getString('GROUP')}
                propertyItem={{ label: 'name', value: 'id' }}
                searchable
                onChange={() => { }}
                options={this.props.manageGroups}
                clearable={false}
                ref={(input) => this.group = input}
                value={defaultGroup}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <CommonSelect
                title={RS.getString('LOCATION')}
                propertyItem={{ label: 'name', value: 'id' }}
                required
                placeholder={RS.getString('SELECT')}
                searchable
                onChange={() => { }}
                options={this.state.locations}
                ref={(input) => this.location = input}
                constraint={newScheduleConstraints.location}
              />
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

DialogAddSchedule.propTypes = propTypes;

export default DialogAddSchedule;