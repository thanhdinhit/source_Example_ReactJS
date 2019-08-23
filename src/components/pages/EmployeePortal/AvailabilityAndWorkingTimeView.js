import React, { PropTypes } from 'react';
import RS, { Option } from '../../../resources/resourceManager';
import SliderTimeAllWeekView from '../../elements/Availability/SliderTimeAllWeekView';
import { COMPONENT_NAME, WORKING_TIME_TYPE, getWorkingTimeTypeOptions } from '../../../core/common/constants';
import MyCheckBox from '../../elements/MyCheckBox';
import RaisedButton from '../../elements/RaisedButton';
import CommonSelect from '../../elements/CommonSelect.component';

const AvailabilityAndWorkingTimeView = React.createClass({
    propTypes: {
        employee: PropTypes.object.isRequired,
    },
    render: function () {
        let { employee } = this.props;
        let workingTimeTypeOptions = getWorkingTimeTypeOptions();
        let workingTimes = employee.time.workingTime || [];
        if (employee.time.workingTimeType == WORKING_TIME_TYPE.STANDARD_WORKING_TIME) {
            workingTimes = this.props.workingTimeSetting;
        }
        let type = _.find(workingTimeTypeOptions, x=> x.value == employee.time.workingTimeType).label;
        return (
            <div className="employee-availability">
                <div className="section-info">
                    <div className="section-title">{RS.getString('AVAILABILITY', null, Option.UPPER)}</div>
                    <div className="section-content">
                        <SliderTimeAllWeekView
                            dragableColorClass="slider-green"
                            availability={employee.time.availabilityTime || []}
                        />
                    </div>
                </div>
                <div className="line" />
                <div className="section-info">
                    <div className="section-title">{RS.getString('WORKING_TIME', null, Option.UPPER)}</div>
                    <div className ="working-time-type"> {type}</div>
                    <div className="section-content">
                        {
                            employee.time.workingTimeType != WORKING_TIME_TYPE.DEPEND_ON_SHIFTS ?
                                <SliderTimeAllWeekView
                                    hideAllDay={true}
                                    dragableColorClass="slider-blue"
                                    dragableErrorColorClass="slider-error has-error "
                                    errorText={RS.getString('ERROR_WORKING_TIME')}
                                    validRange={employee.time.availabilityTime || []}
                                    availability={workingTimes || []}
                                    showRegularHours
                                /> : null
                        }

                    </div>
                </div>
            </div>
        )
    }
})

export default AvailabilityAndWorkingTimeView;