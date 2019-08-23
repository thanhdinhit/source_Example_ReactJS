import React, { PropTypes } from 'react';
import _ from 'lodash';
import RS, { Option } from '../../../../resources/resourceManager';
import { ENUM_SCHEDULE_TEMPLATE, SCHEDULE_TEMPLATES } from '../../../../core/common/constants';
import RadioButton from '../../../elements/RadioButton';

class ScheduleTemplate extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            contract: _.cloneDeep(props.newContract),
            selectedTemplateId: _.get(props.newContract, 'scheduleTemplate')
        };
    }

    validate() {
        return !!this.state.selectedTemplateId;
    }

    getValue() {
        return this.state.selectedTemplateId;
    }

    handleOnChange(templateId, checked) {
        this.setState({ selectedTemplateId: templateId });
        this.props.onChange && this.props.onChange(templateId);
    }

    render() {
        let weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        return (
            <div className="contract-detail">
                <div className="new-contract-info-container" >
                    <div className="new-contract-title uppercase" >{RS.getString('LINKED_CONTRACTS')}</div>
                    <div className="row">
                        {_.map(SCHEDULE_TEMPLATES, (template, templateIndex) => {
                            return (
                                <div className="col-xs-12 col-sm-6" key={templateIndex}>
                                    <div className="schedule-template">
                                        <RadioButton
                                            title={RS.getString(template.name)}
                                            checked={this.state.selectedTemplateId == template.id}
                                            onChange={this.handleOnChange.bind(this, template.id)}
                                        />
                                        <div className="template-container">
                                            <div className="template-row">
                                                <div className="template-header"></div>
                                                {_.map(weekdays, (day) => {
                                                    return (
                                                        <div className="template-header" key={day}>{RS.getString(_.toUpper(day), null, Option.UPPER)}</div>
                                                    );
                                                })}
                                            </div>
                                            {_.map(_.get(this.props, 'newContract.shiftTemplate.shiftTimes'), (time, shiftTimeIndex) => {
                                                return (
                                                    <div className="template-row" key={shiftTimeIndex}>
                                                        <div className="template-item">{time.startTime} - {time.endTime}</div>
                                                        {_.map(weekdays, (day, weekdayIndex) => {
                                                            let style = {
                                                                backgroundColor: time.color
                                                            };
                                                            let prev = weekdayIndex ? weekdays[weekdayIndex - 1] : null;
                                                            let next = weekdayIndex < weekdays.length - 1 ? weekdays[weekdayIndex + 1] : null;
                                                            let deductedWidth = 0;
                                                            if (next && template.weekdays[next].type != template.weekdays[day].type) {
                                                                deductedWidth++;
                                                                style.marginRight = '1px';
                                                            }
                                                            if (prev && template.weekdays[prev].type != template.weekdays[day].type) {
                                                                deductedWidth++;
                                                                style.marginLeft = '1px';
                                                            }
                                                            if (deductedWidth) {
                                                                style.width = `calc((100% - 120px) / 7 - ${deductedWidth}px)`;
                                                            }
                                                            switch (template.weekdays[day].type) {
                                                                case 2:
                                                                    style.backgroundImage = 'url(../../../images/dash-pattern.png)';
                                                                    break;
                                                                case 3:
                                                                    style.backgroundImage = 'url(../../../images/dot-pattern.png)';
                                                                    break;
                                                            }
                                                            return (
                                                                <div className="template-item" key={day} style={style}></div>
                                                            );
                                                        })}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="col-xs-12 col-sm-6">
                            <div className="schedule-template">
                                <RadioButton
                                    title={RS.getString('TEMPLATE_CUSTOMIZE')}
                                    checked={this.state.selectedTemplateId == ENUM_SCHEDULE_TEMPLATE.TEMPLATE_CUSTOMIZE}
                                    onChange={this.handleOnChange.bind(this, ENUM_SCHEDULE_TEMPLATE.TEMPLATE_CUSTOMIZE)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ScheduleTemplate.propTypes = {
}

export default ScheduleTemplate;