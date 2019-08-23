import React, { PropTypes } from 'react'
import Dialog from '../../elements/Dialog';
import { TIMEFORMAT, DATETIME } from '../../../core/common/constants';
import dateHelper, { days } from '../../../utils/dateHelper';
import DateRangeSelection from './DateRangeSelection';
import RaisedButton from '../../elements/RaisedButton';
import RS, { Option } from '../../../resources/resourceManager';

const propTypes = {
    unCopyableDays: PropTypes.array,
    isShowSpecificDate: PropTypes.bool,
    daySelected: PropTypes.object
}

class DialogCopyDayToDays extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateRangesSelected: []
        }
        this.handleSubmitCopy = this.handleSubmitCopy.bind(this)
        this.renderContent = this.renderContent.bind(this)
        this.handleOnChangeDateRangeSelection = this.handleOnChangeDateRangeSelection.bind(this)
    }
    handleSubmitCopy() {
        this.props.handleSubmitCopy(this.state.dateRangesSelected)
    }
    handleOnChangeDateRangeSelection(dateRangesSelected) {
        this.setState({ dateRangesSelected });
    }
    renderContent() {
        let startDateStr = dateHelper.formatTimeWithPattern(this.props.from, DATETIME.DATE_SHIFT_VIEW);
        let endDateStr = dateHelper.formatTimeWithPattern(this.props.to, TIMEFORMAT.END_START_TIME);
        let days = dateHelper.generateDays(this.props.from, this.props.to);
        let optionDays = []
        _.forEach(days, item => {
            let canCopy = true;
            let isSelectedDay = dateHelper.isEqualDate(this.props.daySelected, item);
            if (!!this.props.unCopyableDays.length) {
                let object = _.find(this.props.unCopyableDays, (date) => {
                    return dateHelper.isEqualDate(date, item)
                });
                canCopy = !object;
            }
            if (canCopy && !isSelectedDay) {

                let day = {
                    label: this.props.isShowSpecificDate ? (
                        <span>
                            <strong>
                                {`${RS.getString((dateHelper.formatTimeWithPattern(item, TIMEFORMAT.DAY_OF_WEEK_LONG)).toUpperCase())} `}
                            </strong>
                            {
                                dateHelper.formatTimeWithPattern(item, TIMEFORMAT.SCHEDULE_COPY)
                            }
                        </span>
                    ) : (
                            <span>
                                <strong>
                                    {RS.getString((dateHelper.formatTimeWithPattern(item, TIMEFORMAT.DAY_OF_WEEK_LONG)).toUpperCase())}
                                </strong>
                            </span>
                        ),
                    value: item
                };
                optionDays.push(day);
            }
        });
        return (
            <div>
                <div className={`copy-schedule-info ${this.props.isShowSpecificDate ? 'text-left' : ''}`}>
                    <div>
                        <span>{RS.getString('FROM') + '  '}
                            <strong>
                                {RS.getString((dateHelper.formatTimeWithPattern(this.props.daySelected, TIMEFORMAT.DAY_OF_WEEK_LONG) || '').toUpperCase())}
                                {
                                    this.props.isShowSpecificDate ?
                                        ` (` + (dateHelper.formatTimeWithPattern(this.props.daySelected, DATETIME.DATE_CONTRACT))
                                        + `)`
                                        : null
                                }
                            </strong>
                        </span>
                    </div>
                    <div className="underline">
                        <div />
                        <div><i className="icon-copy-arrow-v" /></div>
                        <div />
                    </div>
                    <div>
                        {RS.getString('COPY_TO')} <strong>{RS.getString('OTHER_DAYS', null, 'LOWER')}
                            {
                                this.props.isShowSpecificDate ?
                                    ' ' + RS.getString('OTHER_DAYS', null, 'LOWER') + ' ' + startDateStr + ' - ' + endDateStr
                                    : null
                            }

                        </strong>
                    </div>
                </div>
                <div className="days-selection">
                    <DateRangeSelection
                        onChange={this.handleOnChangeDateRangeSelection}
                        ranges={optionDays}
                        ref={(input) => this.daysSelection = input}
                    />
                </div>
            </div >
        );
    }

    render() {
        return (
            <Dialog
                style={{ widthBody: '450px' }}
                isOpen={this.props.isOpen}
                title={this.props.title}
                actions={[
                    <RaisedButton
                        key={1}
                        className="raised-button-fourth"
                        label={RS.getString('CANCEL')}
                        onClick={this.props.handleClose}
                    />,
                    <RaisedButton
                        key={0}
                        label={RS.getString('SAVE')}
                        onClick={this.handleSubmitCopy}
                        disabled={!this.state.dateRangesSelected.length}
                    />
                ]}
                handleClose={this.props.handleClose}
                className="dialog-copy"
                modal
            >
                <div>
                    {this.renderContent()}
                </div>
            </Dialog>
        )
    }
}
DialogCopyDayToDays.propTypes = propTypes;
DialogCopyDayToDays.defaultProps = {
    unCopyableDays: []
}
export default DialogCopyDayToDays;
