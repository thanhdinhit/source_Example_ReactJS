import React, { PropTypes } from 'react';
import SliderDurationTime from './SliderDurationTime';
import { AVAILABILITY } from '../../../core/common/constants';
import StringUtils from '../../../utils/stringUtil';
import RS from '../../../resources/resourceManager';
import update from 'react-addons-update';
import MathHelper from '../../../utils/mathHelper';
import { clone } from '../../../services/common';
import DateHelper from '../../../utils/dateHelper';

export default React.createClass({
    propTypes: {
        validRange: PropTypes.object,
        availability: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        dragableColorClass: PropTypes.string,
        hideAllDay: PropTypes.bool,
        showRegularHours: PropTypes.bool
    },
    sliders: {},
    validate: function () {
        let valid = true;
        for (let key in this.sliders) {
            if (!this.sliders[key].isValid()) {
                valid = false;
                return false;
            }
        }
        return valid;
    },
    renderRuler: function () {
        let pieces = [];
        for (let i = 0; i < AVAILABILITY.TIME_PER_DAY + 1; i++) {
            pieces.push(<div key={i} className="slider-ruler-cell"> <div className="slider-ruler-piece"> </div></div>);
        }
        let numbers = [];
        for (let i = 0; i < AVAILABILITY.HOURS_PER_DAY + 1; i++) {
            numbers.push(<td key={i} className="slider-ruler-hour" >{StringUtils.convertNumberToString(i, 2)}  </td>);
        }
        if (this.props.showRegularHours) {
            numbers.push(<td key={numbers.length} className="slider-ruler-number regular-hours">
                {RS.getString('REGULAR_HOURS')}
            </td>)
        }
        return (
            <div className="slider-ruler">
                <div className="slider-ruler-number">
                    <table>
                        <tr>
                            {numbers}
                        </tr>
                    </table>
                </div>
                <div className="slider-ruler-line">
                    {pieces}
                </div>
            </div>
        );
    },
    onChangeTimeDuration: function (fieldName, durationTime) {
        let formattedDurationTimes = [];
        const weekday = AVAILABILITY[fieldName.toUpperCase()];

        durationTime.forEach(function (element) {
            let formattedDurationTime = { weekday, startTime: '00:00:00', endTime: '00:00:00' };
            formattedDurationTime.startTime = MathHelper.convertAxisToTimeString(element.x, AVAILABILITY.MAX_WIDTH_PIXEL / AVAILABILITY.TIME_PER_DAY, true);
            formattedDurationTime.endTime = MathHelper.convertAxisToTimeString(element.x + element.width, AVAILABILITY.MAX_WIDTH_PIXEL / AVAILABILITY.TIME_PER_DAY, true);
            formattedDurationTimes.push(formattedDurationTime);
        });

        let availability = clone(this.props.availability);
        availability[fieldName] = formattedDurationTimes;
        this.props.onChange(availability);
    },
    render: function () {
        let availability = [];
        let regularHours = [];
        for (let day in this.props.availability) {
            let durationTimes = [];
            let hours = 0;
            this.props.availability[day].forEach(function (element) {
                hours += DateHelper.subtractTime(element.startTime.substring(0, 5), element.endTime.substring(0, 5));
                durationTimes.push(MathHelper.convertTimeDurationToAxis(element, AVAILABILITY.MAX_WIDTH_PIXEL));
            }, this);
            availability[day] = durationTimes;
            regularHours[day] = hours;
        }

        let validRange = [];
        for (let day in this.props.validRange) {
            let durationTimes = [];
            this.props.validRange[day].forEach(function (element) {
                durationTimes.push(MathHelper.convertTimeDurationToAxis(element, AVAILABILITY.MAX_WIDTH_PIXEL));
            }, this);
            validRange[day] = durationTimes;
        }
        return (
            <div className="availability-container">
                {this.props.showRegularHours && <div className="regular-hour-background" />}
                {this.renderRuler()}
                {
                    ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((key, index) => {
                        return <SliderDurationTime
                            key={index}
                            ref={slider => this.sliders[key] = slider}
                            hideAllDay={this.props.hideAllDay}
                            dragableColorClass={this.props.dragableColorClass}
                            dragableErrorColorClass={this.props.dragableErrorColorClass}
                            errorText={this.props.errorText}
                            title={RS.getString(key.toUpperCase())}
                            validDurationTimes={validRange[key]}
                            durationTimes={availability[key]}
                            onChange={this.onChangeTimeDuration.bind(this, key)}
                            showRegularHours={this.props.showRegularHours}
                            hours={regularHours[key]}
                        />
                    })
                }
            </div>
        );
    }
});