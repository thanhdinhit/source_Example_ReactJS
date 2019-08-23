import React, { PropTypes } from 'react';
import RS, { Option } from '../../../resources/resourceManager';
import SliderTimeAllWeek from '../../elements/Availability/SliderTimeAllWeek';
import SliderTimeAllWeekView from '../../elements/Availability/SliderTimeAllWeekView';
import { COMPONENT_NAME, AVAILABILITY_FORMAT, WORKING_TIME_TYPE, getWorkingTimeTypeOptions, LOCATION_TYPE } from '../../../core/common/constants';
import MyCheckBox from '../../elements/MyCheckBox';
import RaisedButton from '../../elements/RaisedButton';
import CommonSelect from '../../elements/CommonSelect.component';

const AvailabilityAndWorkingTimeEdit = React.createClass({
    propTypes: {
        employee: PropTypes.object.isRequired,
        availabilitySetting: PropTypes.object,
        workingTimeSetting: PropTypes.object
    },
    getInitialState: function () {
        return {
            availabilityTime: _.clone(AVAILABILITY_FORMAT),
            workingTime: _.clone(AVAILABILITY_FORMAT),
            workingTimeType: WORKING_TIME_TYPE.CUSTOMIZE
        }
    },
    componentDidMount: function () {
        this.setValue(this.props.employee);
    },

    handleUpdateAvailabilityAndWorkingTime: function () {
        this.props.updateAvailabilityAndWorkingTime
            && this.props.updateAvailabilityAndWorkingTime(this.getValue());
    },

    handleChangeAvailabilities: function (availabilityTime) {
        this.setState({ availabilityTime }, this.handleUpdateAvailabilityAndWorkingTime)
    },
    handleChangeWorkingTimes: function (workingTime) {
        this.setState({ workingTime }, this.handleUpdateAvailabilityAndWorkingTime)
    },
    handleChangeWorkingTimeType: function (data) {
        this.setState({ workingTimeType: data.value }, this.handleUpdateAvailabilityAndWorkingTime);
    },
    setValue: function (employee) {
        let workingTimeType = employee.time.workingTimeType;
        let availabilityTime = _.cloneDeep(employee.time.availabilityTime);
        let workingTime = _.cloneDeep(employee.time.workingTime);
        if (workingTimeType == WORKING_TIME_TYPE.CUSTOMIZE && _.isEqual(workingTime, AVAILABILITY_FORMAT)) {
            workingTime = _.cloneDeep(this.props.workingTimeSetting);
        }
        if(_.get(employee, "contactDetail.location.value") == LOCATION_TYPE.DEPEND_ON_SHIFTS ){
            workingTimeType = WORKING_TIME_TYPE.DEPEND_ON_SHIFTS
        }
        this.setState({
            availabilityTime,
            workingTime,
            workingTimeType
        })
    },
    getValue: function () {
        let { availabilityTime, workingTime, workingTimeType } = this.state;
        return _.cloneDeep({
            availabilityTime,
            workingTime,
            workingTimeType
        });
    },
    handleUseDefault: function (fieldName) {
        switch (fieldName) {
            case COMPONENT_NAME.AVAILABILITY:
                this.setState({
                    availabilityTime: this.props.availabilitySetting
                }, this.handleUpdateAvailabilityAndWorkingTime)
                break;
            case COMPONENT_NAME.WORKINGTIME:
                this.setState({ workingTime: this.props.workingTimeSetting },
                    this.handleUpdateAvailabilityAndWorkingTime)
                break;
        }
    },
    clearAllSliderTime: function (fieldName) {
        this.setState({ [fieldName]: AVAILABILITY_FORMAT }, this.handleUpdateAvailabilityAndWorkingTime);
    },
    validate: function () {
        if (this.slider) {
            return this.slider.validate();
        }
        return true;
    },
    render: function () {
        let workingTimeTypeOptions = getWorkingTimeTypeOptions();
        return (
            <div className="employee-availability">
                <div className="section-info">
                    <div className="section-title">{RS.getString('AVAILABILITY', null, Option.UPPER)}</div>
                    <div className="section-content">
                        <SliderTimeAllWeek
                            dragableColorClass="slider-green"
                            availability={this.state.availabilityTime || []}
                            onChange={this.handleChangeAvailabilities}
                        />
                        <div className="row">
                            <div className="text-right availability-fixed-width">
                                <div>
                                    <RaisedButton
                                        className="raised-button-fourth-secondary"
                                        label={RS.getString('CLEAR_ALL')}
                                        onClick={this.clearAllSliderTime.bind(this, COMPONENT_NAME.AVAILABILITY)}
                                    />
                                    <RaisedButton
                                        className="raised-button-first-secondary"
                                        label={RS.getString('DEFAULT')}
                                        onClick={this.handleUseDefault.bind(this, COMPONENT_NAME.AVAILABILITY)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="line" />
                <div className="section-info">
                    <div className="section-title">{RS.getString('WORKING_TIME', null, Option.UPPER)}</div>
                    <div className="section-content">
                        <CommonSelect
                            className="workingtype-select"
                            options={workingTimeTypeOptions}
                            clearable={false}
                            searchable={false}
                            value={this.state.workingTimeType}
                            onChange={this.handleChangeWorkingTimeType}
                        />
                        {
                            this.state.workingTimeType == WORKING_TIME_TYPE.STANDARD_WORKING_TIME &&
                            <SliderTimeAllWeekView
                                ref={(slider) => this.slider = slider}
                                hideAllDay={true}
                                dragableColorClass="slider-blue"
                                dragableErrorColorClass="slider-error has-error "
                                errorText={RS.getString('ERROR_WORKING_TIME')}
                                validRange={this.state.availabilityTime || []}
                                availability={this.props.workingTimeSetting}
                                showRegularHours
                            />
                        }
                        {
                            (!this.state.workingTimeType || this.state.workingTimeType == WORKING_TIME_TYPE.CUSTOMIZE) &&
                            <SliderTimeAllWeek
                                ref={(slider) => this.slider = slider}
                                hideAllDay={true}
                                dragableColorClass="slider-blue"
                                dragableErrorColorClass="slider-error has-error "
                                errorText={RS.getString('ERROR_WORKING_TIME')}
                                validRange={this.state.availabilityTime || []}
                                availability={this.state.workingTime}
                                onChange={this.handleChangeWorkingTimes}
                                showRegularHours
                            />
                        }
                        {
                            this.state.workingTimeType == WORKING_TIME_TYPE.CUSTOMIZE &&
                            <div className="row">
                                <div className="text-right button-footer availability-fixed-width">
                                    <div>
                                        <RaisedButton
                                            className="raised-button-fourth-secondary"
                                            label={RS.getString('CLEAR_ALL')}
                                            onClick={this.clearAllSliderTime.bind(this, COMPONENT_NAME.WORKINGTIME)}
                                        />
                                        <RaisedButton
                                            className="raised-button-first-secondary"
                                            label={RS.getString('STANDARD_WORKING_TIME')}
                                            onClick={this.handleUseDefault.bind(this, COMPONENT_NAME.WORKINGTIME)}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
})

export default AvailabilityAndWorkingTimeEdit;