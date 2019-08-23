import React, { PropTypes } from 'react';
import _ from 'lodash';

import Dialog from '../../elements/Dialog';
import RaisedButton from '../../../components/elements/RaisedButton';
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import CommonSelect from '../../elements/CommonSelect.component';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import MyCheckBox from '../../elements/MyCheckBox';
import MyCheckBoxSpecial from '../../elements/MyCheckBoxSpecial';

import RS from '../../../resources/resourceManager';
import debounceHelper from '../../../utils/debounceHelper';
import { WAITING_TIME, TIMEFORMAT } from '../../../core/common/constants';
import * as apiHelper from '../../../utils/apiHelper';
import dateHelper from '../../../utils/dateHelper';


const propTypes = {
    ranges: PropTypes.array,
};
class DateRangeSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ranges: []
            // selectedDays: []
        };
        this.handleCheckAll = this.handleCheckAll.bind(this);
        this.handleItemChecked = this.handleItemChecked.bind(this);
    }

    componentDidMount() {
        if (!_.isEmpty(this.props.ranges)) {
            let ranges = _.map(this.props.ranges, range => {
                return _.assign({}, { value: range.value, label: range.label, selected: false });
            });
            this.setState({ ranges });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.ranges, nextProps.ranges)) {
            let ranges = _.map(nextProps.ranges, range => {
                return _.assign({}, { value: range.value, label: range.label, selected: false });
            });
            this.setState({ ranges }, this.handleOnChange);
        }
    }

    getValue() {
        const ranges = [];
        _.forEach(this.state.ranges, item => {
            if (item.selected) {
                ranges.push(_.cloneDeep(item.value));
            }
        });
        return ranges;
    }

    handleOnChange() {
        this.props.onChange && this.props.onChange(this.getValue());
    }

    handleCheckAll(hasItem) {
        const ranges = _.cloneDeep(this.state.ranges);
        if (!hasItem) {
            _.forEach(ranges, item => {
                item.selected = true;
            });
        } else {
            _.forEach(ranges, item => {
                item.selected = false;
            });
        }
        this.setState({ ranges }, this.handleOnChange);
    }

    handleItemChecked(index, checked) {
        let ranges = [...this.state.ranges];
        ranges[index].selected = checked;
        this.setState({ ranges }, this.handleOnChange);
    }

    render() {
        const itemChecked = _.filter(this.state.ranges, 'selected').length || 0;
        const cssCheckAll = itemChecked === this.state.ranges.length ? "checkbox-special" : "checkbox-special-type2";

        return (
            <div>
                <table className="metro-table">
                    <MyHeader>
                        <MyRowHeader>
                            <MyTableHeader>
                                <div className={cssCheckAll}>
                                    <MyCheckBoxSpecial
                                        label={(<span>{RS.getString('SELECT_ALL')}</span>)}
                                        onChange={this.handleCheckAll.bind(this, itemChecked > 0)}
                                        checked={itemChecked > 0}
                                        className="filled-in"
                                        id="all-day"
                                    />
                                </div>
                            </MyTableHeader>
                            <MyTableHeader>
                                <span className="item-selected">
                                    {itemChecked} {RS.getString('SELECTED')}
                                </span>
                            </MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {this.state.ranges ?
                            this.state.ranges.map(function (range, index) {
                                return (
                                    <tr
                                        key={index}
                                        className={"pointer" + (range.selected ? ' active' : '')}
                                        onClick={this.handleItemChecked.bind(this, index, !range.selected)}
                                    >
                                        <td>
                                            <MyCheckBox
                                                id={'export_column_name' + index}
                                                defaultValue={range.selected || false}
                                                label={range.label}
                                            />
                                        </td>
                                        <td />
                                    </tr>
                                );
                            }.bind(this)) : []}
                    </tbody>
                </table>
            </div>
        );
    }
}

DateRangeSelection.propTypes = propTypes;
export default DateRangeSelection;