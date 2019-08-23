import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import toastr from 'toastr';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import RS from '../../../resources/resourceManager';
import CommonDatePicker from '../../elements/DatePicker/CommonDatePicker';
import CommonDatePickerInline from '../../elements/DatePicker/CommonDatePickerInline';
import { getEmployeeConstraints } from '../../../validation/employeeConstraints';
import PopoverIcon from '../../elements/PopoverIcon/PopoverIcon';
import Constraints from '../../../validation/common.constraints';
import MyCheckBox from '../../elements/MyCheckBox'
import CommonTextField from '../../elements/TextField/CommonTextField.component';
import TextView from '../../elements/TextView';
import Pagination from '../../elements/Paginate/Pagination';
import DropdownButton from '../../elements/DropdownButton';
import FilterModal from '../../elements/Filter/FilterModal';
import FilterSearch from '../../elements/Filter/FilterSearch';
import FilterMore from '../../elements/Filter/FilterMore';
import FilterDateTime from '../../elements/Filter/FilterDateTime';
import FilterDateRangeV2 from '../../elements/FilterDateRangeV2';
import CommonSelect from '../../elements/CommonSelect.component';
import FilterMoreCommonSelect from '../../elements/Filter/FilterMoreCommonSelect';
import FilterMoreCommonTextField from '../../elements/Filter/FilterMoreCommonTextField';
import debounceHelper from '../../../utils/debounceHelper';
import { WAITING_TIME, TIMESPAN } from '../../../core/common/constants';
import RadioButtons from '../../elements/RadioButtons/RadioButtons';
import RadioButton from '../../elements/RadioButton';
import RaisedButton from '../../elements/RaisedButton';
import CommonTimePicker from '../../elements/DatePicker/CommonTimePicker';
import ColorPicker from '../../elements/MyColorPicker';
import CommonYearPicker from '../../elements/DatePicker/CommonYearPicker';
import TimeSliderWidget from '../../elements/TimeSliderWidget';
import MyColorPicker from '../../elements/MyColorPicker';
import TimeSlider from '../../elements/TimeSlider';


import { setTimeout } from 'timers';
import NumberInput from '../../elements/NumberInput';

import { SCHEDULE_TEMPLATES } from '../../../core/common/config';
import DateHelper from '../../../utils/dateHelper';

const timeSlider = {
    startDate: "Mon Feb 12 2018 00:00:00 GMT+0700",
    endDate: "2018-03-31T00:00:00Z",
}

const companyGroups = [
    {
        id: 1,
        name: 'TMA LAB-6',
        groups: [
            {
                id: 2,
                name: 'TTC',
                groups: []
            },
            {
                id: 3,
                name: 'TIC',
                groups: []
            },
            {
                id: 4,
                name: 'Business',
                groups: [
                    {
                        id: 5,
                        name: 'T-Design',
                        groups: []
                    },
                    {
                        id: 6,
                        name: 'BA',
                        groups: []
                    },
                    {
                        id: 7,
                        name: 'BDU',
                        groups: []
                    }
                ]
            },
            {
                id: 8,
                name: 'HR',
                groups: [
                    {
                        id: 9,
                        name: 'T-Design2',
                        groups: []
                    },
                    {
                        id: 10,
                        name: 'BA2',
                        groups: []
                    },
                    {
                        id: 11,
                        name: 'BDU2',
                        groups: []
                    }
                ]
            }
        ]
    },
    {
        id: 12,
        name: 'TMA LAB-4',
        groups: [
            {
                id: 13,
                name: 'T-Design2',
                groups: []
            },
            {
                id: 14,
                name: 'BA2',
                groups: []
            },
            {
                id: 15,
                name: 'BDU2',
                groups: []
            }
        ]
    }];

var Test = React.createClass({
    getInitialState: function () {
        return {
            isOpenFilter: false,
            filterSearch: '',
            prefilter: {},
            filter: {},
            prefilterMore: [],
            filterMore: [],
            radioValue: '1',
            isOpenAddEmployee: false,
            groups: []
        }
    },
    componentWillMount: function () {
        // let groups = [{ name: group.name, parent: '', id: group.id }];
        let groups = [];
        this.getGroups(groups, companyGroups, '');
        _.forEach(groups, (group) => {
            group.checked = true;
        })
        this.setState({ groups });
    },

    componentDidMount: function () {
        this.handleSearchCallback = debounceHelper.debounce(function (events) {
            alert(this.state.queryString + JSON.stringify(this.state.filter));
        }, WAITING_TIME);
    },
    handleOpenFilter: function () {
        this.setState({
            isOpenFilter: true
        })
    },
    handleApplyFilter: function () {
        this.setState({
            isOpenFilter: false,
            prefilter: this.state.filter,
            prefilterMore: this.state.filterMore
        })
        this.filterSearch.handleCloseFilter();
        alert(JSON.stringify(this.state.filter));
    },
    handleCloseFilter: function () {
        this.setState({
            isOpenFilter: false,
            filter: this.state.prefilter,
            filterMore: this.state.prefilterMore
        })
        this.filterSearch.handleCloseFilter();
    },
    handleResetFilter: function () {
        this.setState({
            prefilter: {},
            filter: {}
        });
    },

    handleChangeRadio: function (value) {
        this.setState({ radioValue: value });
    },

    handleSearchChange: function (e) {
        this.setState({ queryString: e.target.value })
        this.handleSearchCallback(e);
    },
    validate: function () {
        const fields = ['dateA', 'dateB']
        fields.forEach(function (element) {
            this[element].validate();
        }, this)
    },
    handleFilterChange: function (field, data) {
        let filter = _.cloneDeep(this.state.filter);
        let value = null;
        if (_.isArray(data)) {
            value = _.map(data, 'value');
        } else if (data.label && data.value) {
            value = data.value;
        } else {
            value = data;
        }
        filter[field] = value;
        this.setState({ filter });
    },
    handleAddFilterMore: function (field) {
        this.setState({
            filterMore: [...this.state.filterMore, field]
        });
    },
    handleRemoveFilterMore: function (field) {
        let filter = _.cloneDeep(this.state.filter);
        _.unset(filter, field);
        this.setState({
            filterMore: _.filter(this.state.filterMore, (filter) => filter != field),
            filter
        });
    },

    getGroups: function (result, groups, parent) {
        if (groups.length) {
            _.forEach(groups, (item) => {
                result.push({
                    id: item.id,
                    name: item.name,
                    parent
                });
                this.getGroups(result, item.groups, item.id);
            })
        }
    },

    handleCheckItemGroups: function (index) {
        const groups = _.cloneDeep(this.state.groups);
        groups[index].checked = !groups[index].checked;
        this.setState({ groups });
    },

    renderTreegrid: function (groups) {
        const idNodeExpands = [1, 4];
        return _.map(groups, (group, index) => {
            const classname = _.includes(idNodeExpands, group.id) ? ' tr-expand' : ' tr-collapse';
            return (
                <tr
                    key={index + group.name}
                    className={'tree-node treegrid-' + group.id + (group.parent ? ' treegrid-parent-' + group.parent : '') + classname}
                >
                    <td style={{ width: '40%' }}>
                        <MyCheckBox
                            bodyClassName="inline-block"
                            label={group.name}
                            defaultValue={group.checked}
                            onChange={this.handleCheckItemGroups.bind(this, index)}
                            unStopPropagation
                        />
                    </td>
                    <td>date from</td>
                    <td>date to</td>
                </tr>
            )
        })
    },

    render: function () {
        let constraint = getEmployeeConstraints();
        let dateConstraint = _.merge(Constraints.isValidDate(new Date(2017, 8, 1), new Date(2017, 8, 30)), {});
        let jobRoles = [{ value: 1, label: 'Guard' }, { value: 2, label: 'Guard' }];
        let groups = [{ value: 0, label: 'All' }, { value: 1, label: 'Group 1' }, { value: 2, label: 'Group 2' }];
        let locations = [{ value: 0, label: 'All' }, { value: 1, label: 'Location 1' }, { value: 2, label: 'Location 2' }];
        let status = [{ value: 0, label: 'All' }, { value: 1, label: 'Status 1' }, { value: 2, label: 'Status 2' }];
        console.log(this.state.groups)
        return (
            <div style={{ width: "100%", paddingLeft: "15px", paddingRight: '15px', paddingTop: '20px' }}>
                <label>GRID</label>
                <div className="row">
                    <div className="col-md-1">.col-md-1</div>
                    <div className="col-md-1">.col-md-1</div>
                    <div className="col-md-1">.col-md-1</div>
                    <div className="col-md-1">.col-md-1</div>
                    <div className="col-md-1">.col-md-1</div>
                    <div className="col-md-1">.col-md-1</div>
                    <div className="col-md-1">.col-md-1</div>
                    <div className="col-md-1">.col-md-1</div>
                    <div className="col-md-1">.col-md-1</div>
                    <div className="col-md-1">.col-md-1</div>
                    <div className="col-md-1">.col-md-1</div>
                    <div className="col-md-1">.col-md-1</div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <FilterDateRangeV2
                            actions={[
                                <RaisedButton
                                    key={1}
                                    label={'Cancel'}
                                    onClick={() => console.log('close')}
                                    className="raised-button-fourth"
                                />,
                                <RaisedButton
                                    key={0}
                                    label={'Ok'}
                                    onClick={(from, to) => console.log(from, to)}
                                    className="raised-button-first"
                                />
                            ]}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <CommonTimePicker
                            title="Start Time"
                            required
                            defaultValue={new Date(2011, 10, 4, 10, 3, 0)}
                            constraint={constraint.firstName}
                            ref={(timePicker) => this.timePicker = timePicker}
                            onChange={(value) => console.log(value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <CommonYearPicker
                            min={2016}
                            max={2018}
                            value={2017}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <TimeSliderWidget.Dropdown
                            // timeDurations={[{ type: TIMESPAN.MONTH }, { type: TIMESPAN.WEEK }, { type: TIMESPAN.ONE_WEEK }, { type: TIMESPAN.MANUAL }]}
                            currentDate={new Date("October 11, 2014 11:13:00")}
                            endDate={new Date('October 27, 2014 11:13:00')}
                            selectedDuration={TIMESPAN.MANUAL}
                            handleChange={(from, to, option) => {
                                console.log(from)
                                console.log(to)
                                console.log(option)
                            }}
                        />
                    </div>
                </div>
                <label> COMPONENT </label>
                <div className="row">
                    <div className="col-md-3">
                        <CommonDatePicker
                            language={RS.getString('LANG_KEY')}
                            title={RS.getString('BIRTH_DAY')}
                            required
                            ref={(input) => this.dateA = input}
                            hintText="dd/mm/yyyy"
                            defaultValue={new Date(2017, 8, 9)}
                            constraint={dateConstraint}
                            onBlur={() => this.dateA.validate()}
                        />
                    </div>
                    <div className="col-md-3">
                        <CommonDatePicker
                            language={RS.getString('LANG_KEY')}
                            ref={(input) => this.dateB = input}
                            hintText="dd/mm/yyyy"
                            constraint={constraint.birthday}
                            onBlur={() => this.dateB.validate()}
                        />
                    </div>
                    <div className="col-md-3">
                        <CommonDatePickerInline
                            language={RS.getString('LANG_KEY')}
                            ref={(input) => this.dateC = input}
                            hintText="dd/mm/yyyy"
                            constraint={constraint.birthday}
                            defaultValue={new Date(2017, 8, 22)}
                        />

                    </div>
                </div>
                <FilterSearch
                    ref={(filterSearch) => this.filterSearch = filterSearch}
                    handleSearchChange={this.handleSearchChange}
                >
                    <FilterModal
                        ref={(filterModal) => this.filterModal = filterModal}
                        isOpen={this.state.isOpenFilter}
                        handleOpenFilter={this.handleOpenFilter}
                        handleApplyFilter={this.handleApplyFilter}
                        handleResetFilter={this.handleResetFilter}
                        handleCloseFilter={this.handleCloseFilter}
                    >
                        <CommonSelect
                            title="Job Role"
                            field="role"
                            multi={true}
                            options={jobRoles}
                            value={this.state.filter.role}
                            onChange={this.handleFilterChange.bind(this, "role")}
                        />
                        <CommonSelect
                            title="Group"
                            field="group"
                            options={groups}
                            value={this.state.filter.group}
                            onChange={this.handleFilterChange.bind(this, "group")}
                        />
                        <CommonSelect
                            title={RS.getString('WORKING_LOCATION')}
                            field="location"
                            options={locations}
                            value={this.state.filter.location}
                            onChange={this.handleFilterChange.bind(this, "location")}
                        />
                        <FilterDateTime
                            title={RS.getString('DATE_OF_BIRTH')}
                            field="date"
                            selectedValue={this.state.filter.date || {}}
                            onChange={this.handleFilterChange.bind(this, "date")}
                        />
                        <FilterMore
                            selectedFilter={this.state.filterMore}
                            handleAddFilterMore={this.handleAddFilterMore}
                            className="row"
                        >
                            <FilterMoreCommonSelect
                                filterTitle={RS.getString('REPORT_TO')}
                                field="reportTo"
                                displayName="Report to"
                                multi={true}
                                options={[{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }]}
                                value={this.state.filter.reportTo}
                                onChange={this.handleFilterChange.bind(this, "reportTo")}
                                handleRemoveFilterMore={this.handleRemoveFilterMore}
                            />
                            <FilterMoreCommonSelect
                                filterTitle={RS.getString('GENDER')}
                                field="gender"
                                displayName="Gender"
                                options={[{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }]}
                                value={this.state.filter.gender}
                                onChange={this.handleFilterChange.bind(this, "gender")}
                                handleRemoveFilterMore={this.handleRemoveFilterMore}
                            />
                            <FilterMoreCommonTextField
                                filterTitle={RS.getString('ADDRESS')}
                                field="address1"
                                displayName="Address1"
                                className="common-select"
                                defaultValue={this.state.filter.address1 || ''}
                                onBlur={(e) => this.handleFilterChange('address1', e.target.value)}
                                handleRemoveFilterMore={this.handleRemoveFilterMore}
                            />
                        </FilterMore>
                    </FilterModal>
                </FilterSearch>

                <TimeSlider
                    value={timeSlider}
                    onChange={(from, to) => console.log(from, to)} />
                <RaisedButton
                    className="raised-button-first"
                    label="Add Employees"
                    onClick={() => this.setState({ isOpenAddEmployee: true })}
                />
                <RaisedButton
                    className="raised-button-second"
                />
                <RaisedButton
                    className="raised-button-third"
                />
                <RaisedButton
                    className="raised-button-fourth"
                />
                <RaisedButton
                    className="raised-button-first raised-button-disable"
                />
                <RaisedButton
                    className="raised-button-third raised-button-disable"
                />
                <RaisedButton
                    className="raised-button-first-secondary"
                />
                <RaisedButton
                    className="raised-button-second-secondary"
                />
                <RaisedButton
                    className="raised-button-third-secondary"
                />
                <RaisedButton
                    className="raised-button-fourth-secondary"
                />
                <button type="button" className="btn btn-lg btn-danger" data-toggle="popover" title="Popover title"
                    data-placement="bottom"
                    data-content="And here's some amazing content. It's very engaging. Right?"
                >
                    Click to toggle popover
                </button>


                <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Email" />
                <div className="input-group">
                    <input type="text" className="form-control" id="exampleInputAmount" placeholder="Amount" />
                    <div className="input-group-addon">.00</div>
                </div>
                <div className="input-group">
                    <span className="input-group-addon" id="basic-addon1">@</span>
                    <input type="text" className="form-control" placeholder="Username" aria-describedby="basic-addon1" />
                </div>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="inputPassword" className="col-xs-2 control-label">Password</label>
                        <div className="col-sm-10">
                            <input type="password" className="form-control" id="inputPassword" placeholder="Password" />
                        </div>
                    </div>
                </form>
                <input className="form-control" id="disabledInput" type="text" placeholder="Disabled input here..." disabled />
                <div className="form-group has-error has-feedback">
                    <label className="control-label" htmlFor="inputError2">Input with error</label>
                    <input type="text" className="form-control" id="inputError2" aria-describedby="inputError2Status" />
                    <span className="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                    <span id="inputError2Status" className="sr-only">(error)</span>
                </div>
                <button type="button" className="btn btn-default">Default</button>
                <button type="button" className="btn btn-primary">Primary</button>
                <button type="button" className="btn btn-success">Success</button>
                <button type="button" className="btn btn-info">Info</button>
                <button type="button" className="btn btn-warning">Warning</button>
                <button type="button" className="btn btn-danger">Danger</button>
                <button type="button" className="btn btn-link">Link</button>
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        <li>
                            <a href="#" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li><a href="#">1</a></li>
                        <li><a href="#">2</a></li>
                        <li><a href="#">3</a></li>
                        <li><a href="#">4</a></li>
                        <li><a href="#">5</a></li>
                        <li>
                            <a href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className="right">
                    <Pagination
                        firstPageText={<i className="fa fa-angle-double-left" aria-hidden="true"></i>}
                        lastPageText={<i className="fa fa-angle-double-right" aria-hidden="true"></i>}
                        prevPageText={<i className="fa fa-angle-left" aria-hidden="true"></i>}
                        nextPageText={<i className="fa fa-angle-right" aria-hidden="true"></i>}
                        activePage={2}
                        itemsCountPerPage={5}
                        totalItemsCount={57}
                        onChange={() => { }}
                    />
                </div>
                <div className="dropdown">
                    <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                        Dropdown
                        <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                        <li><a href="#">Action</a></li>
                        <li><a href="#">Another action</a></li>
                        <li><a href="#">Something else here</a></li>
                        <li role="separator" className="divider"></li>
                        <li><a href="#">Separated link</a></li>
                    </ul>
                </div>
                <div className="dropup">
                    <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Dropup
                        <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                        <li><a href="#">Action</a></li>
                        <li><a href="#">Another action</a></li>
                        <li><a href="#">Something else here</a></li>
                        <li role="separator" className="divider"></li>
                        <li><a href="#">Separated link</a></li>
                    </ul>
                </div>
                <select className="form-control">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
                <RadioButtons
                    title='Group radion23'
                    list={[{ title: 'aaaa', value: '1' },
                    { title: 'bbbbbsdafdasf', value: '2' },
                    { title: 'dfdas', value: '3' },
                    { title: 'dsadfdasfdasfdddd', value: '4' }]}
                    value={this.state.radioValue}
                    inline={true}
                    handleChange={this.handleChangeRadio}
                />
                <RadioButtons
                    title='Group radion'
                    list={[{ title: 'aaaa', value: '1' },
                    { title: 'bbbbb', value: '2' },
                    { title: 'ccccc', value: '3' },
                    { title: 'ddddd', value: '4' }]}
                    value="2"
                    inline={false}
                />
                <RadioButton ref={(input) => this.radio = input} checked={false} title="Abcdef" />
                <NumberInput
                    value={2}
                    min={0}
                    max={10}
                />

                <table style={{ width: '100%' }} className="tree metro-table">
                    <MyHeader sort={this.handleSortClick}>
                        <MyRowHeader>
                            <MyTableHeader>
                                Group
                            </MyTableHeader>
                            <MyTableHeader>
                                From
                            </MyTableHeader>
                            <MyTableHeader>
                                To
                            </MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {this.renderTreegrid(this.state.groups)}
                    </tbody>
                </table>
                <table style={{ width: '100%' }} className="tree preventCollapse metro-table">
                    <MyHeader sort={this.handleSortClick}>
                        <MyRowHeader>
                            <MyTableHeader>
                                Group
                            </MyTableHeader>
                            <MyTableHeader>
                                From
                            </MyTableHeader>
                            <MyTableHeader>
                                To
                            </MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {this.renderTreegrid(this.state.groups)}
                    </tbody>
                </table>
                <MyColorPicker />
            </div >
        );
    }
});

function mapStateToProps(state) {
    return {
        curEmp: state.authReducer.curEmp,
    };
}
function mapDispatchToProps(dispatch) {
    return {

    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Test);