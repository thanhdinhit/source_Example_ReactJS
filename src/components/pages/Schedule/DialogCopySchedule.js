import React, { PropTypes } from 'react';
import _ from 'lodash';
import DiaLog from '../../elements/Dialog';
import RaisedButton from '../../../components/elements/RaisedButton';
import DateRangeSelection from './DateRangeSelection';
import RS, { Option } from '../../../resources/resourceManager';
import { TIMESPAN, DATETIME } from '../../../core/common/constants';
import dateHelper from '../../../utils/dateHelper';
import Moment from 'moment';
import CommonDateRangePickerInline from '../../elements/DatePicker/CommonDateRangePickerInline';
import * as LoadingIndicatorActions from '../../../utils/loadingIndicatorActions';

const propTypes = {
    enableCopyScheduleButton: PropTypes.bool,
    rangeScheduleValue: PropTypes.string,
    handleSubmitCopySchedule: PropTypes.func
}
class DialogCopySchedule extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpenCopySchedule: false,
            dateRangesSelected: []
        }
        this.handleOnchangeDateRangesSelection = this.handleOnchangeDateRangesSelection.bind(this);
        this.handleCopySchedule = this.handleCopySchedule.bind(this)
    }
    open() {
        this.setState({ isOpenCopySchedule: true })
    }
    close() {
        this.setState({ isOpenCopySchedule: false })
    }
    getFormatDateRange() {
        let startDate = Moment(this.props.dateRangeCopy.start);
        let endDate = Moment(this.props.dateRangeCopy.end);
        if (new Date(startDate).getFullYear() === new Date(endDate).getFullYear()) {
            return ` ${startDate.format('MMM D')} - ${endDate.format('MMM D, YYYY')}`;
        }
        return ` ${startDate.format('MMM D, YYYY')} - ${endDate.format('MMM D, YYYY')}`;
    }
    handleOnchangeDateRangesSelection(selected) {
        this.setState({ dateRangesSelected: selected })
    }
    handleCopySchedule() {
        const destination = _.map(this.state.dateRangesSelected, item => {
            let { start, end } = item;
            start = new Date(start), end = new Date(end);
            return {
                from: new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0),
                to: new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999)
            };
        });
        let data = {
            source: [{
                from: this.props.dateRangeCopy.start,
                to: this.props.dateRangeCopy.end
            }],
            destination
        };
        this.props.handleSubmitCopySchedule(data);
        // this.close();
        // LoadingIndicatorActions.showAppLoadingIndicator();
    }
    renderCopySchedule() {
        if (!this.state.isOpenCopySchedule) return null;
        let duration;
        switch (this.props.rangeScheduleValue) {
            case TIMESPAN.WEEK: {
                duration = 7;
                break;
            }
            case TIMESPAN.TWO_WEEKS: {
                duration = 14;
                break;
            }
            case TIMESPAN.THREE_WEEKS: {
                duration = 21;
                break;
            }
        }

        let options = [
            {
                label: RS.getString('WEEK'),
                value: TIMESPAN.WEEK
            },
            {
                label: RS.getString('TWO_WEEKS'),
                value: TIMESPAN.TWO_WEEKS
            },
            {
                label: RS.getString('THREE_WEEKS'),
                value: TIMESPAN.THREE_WEEKS
            }
        ];
        let dateRanges = dateHelper.generateDateRangesExceptRange(new Date(), this.props.schedule.endDate, {
            start: this.props.dateRangeCopy.start,
            end: this.props.dateRangeCopy.end
        }, duration);

        dateRanges = dateHelper.filterRanges(dateRanges, new Date(), this.props.schedule.endDate);
        let ranges = [];
        _.forEach(dateRanges, item => {
            let range = {
                label: (
                    <span>{dateHelper.formatTimeWithPattern(new Date(item.start), DATETIME.DATE_SHIFT_VIEW)} - {
                        dateHelper.formatTimeWithPattern(new Date(item.end), DATETIME.DATE_CONTRACT)
                    }</span>
                ),
                value: item
            };
            ranges.push(range);
        });
        return (
            <div>
                <div className="copy-schedule-info">
                    <div className="row">
                        <div className="col-md-6 title-inline">
                            <div>{RS.getString('FROM')}</div>
                            <div>
                                <span>{this.getFormatDateRange()}</span>
                            </div>
                            <div className="daterangepicker-overwrite">
                                <div />
                                <div />
                                <CommonDateRangePickerInline
                                    language={RS.getString('LANG_KEY')}
                                    ref={(input) => this.dateC = input}
                                    hintText="dd/mm/yyyy"
                                    range={this.props.rangeScheduleValue}
                                    startDate={this.props.schedule.startDate}
                                    endDate={this.props.schedule.endDate}
                                    defaultValue={[this.props.dateRangeCopy.start, this.props.dateRangeCopy.end]}
                                />
                                <div className="days-selected-info">
                                    <span>
                                        <strong>{dateHelper.formatTimeWithPattern(new Date(this.props.dateRangeCopy.start), DATETIME.DATE_SHIFT_VIEW)} - {
                                            dateHelper.formatTimeWithPattern(new Date(this.props.dateRangeCopy.end), DATETIME.DATE_CONTRACT)
                                        }</strong> {RS.getString('SELECTED', null, 'LOWER')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="copy-arrow col-md-1"><i className="copy-arrow-horizontal fa icon-copy-arrow-h" aria-hidden="true" /></div>
                        <div className="col-md-5">
                            <div className="copy-other-week">
                                {RS.getString('COPY_TO')} <strong>{RS.getString('OTHER')} {RS.getString(this.props.rangeScheduleValue)}</strong>
                            </div>
                            <div className="days-selection">
                                <DateRangeSelection
                                    ranges={ranges}
                                    ref={(input) => this.daysSelection = input}
                                    onChange={this.handleOnchangeDateRangesSelection}
                                />
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        );
    }
    render() {
        const enableCopyScheduleButton = !!this.state.dateRangesSelected.length &&
            dateHelper.getTimeOfOnlyDate(this.props.dateRangeCopy.start) >= dateHelper.getTimeOfOnlyDate(this.props.schedule.startDate) &&
            dateHelper.getTimeOfOnlyDate(this.props.dateRangeCopy.end) <= dateHelper.getTimeOfOnlyDate(this.props.schedule.endDate);

        return (
            <DiaLog
                className="dialog-copy-schedule"
                style={{ widthBody: '700px' }}
                isOpen={this.state.isOpenCopySchedule}
                title={RS.getString('COPY_SCHEDULE', null, 'UPPER')}
                actions={[
                    <RaisedButton
                        key={1}
                        className="raised-button-fourth"
                        label={RS.getString('CANCEL')}
                        onClick={() => { this.setState({ isOpenCopySchedule: false }); }}
                    />,
                    <RaisedButton
                        key={0}
                        label={RS.getString('SAVE')}
                        onClick={this.handleCopySchedule}
                        disabled={!enableCopyScheduleButton}
                    />
                ]}
                handleClose={() => { this.setState({ isOpenCopySchedule: false }); }}
                modal
            >
                <div>
                    {this.renderCopySchedule()}
                </div>
            </DiaLog>
        )
    }
}
DialogCopySchedule.propTypes = propTypes;
export default DialogCopySchedule;

