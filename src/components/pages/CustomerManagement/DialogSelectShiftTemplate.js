import React, { PropTypes } from 'react';
import Dialog from '../../elements/Dialog';
import RaisedButton from '../../../components/elements/RaisedButton';
import MyCheckBox from '../../elements/MyCheckBox';
import RS from '../../../resources/resourceManager';
import debounceHelper from '../../../utils/debounceHelper';
import { WAITING_TIME } from '../../../core/common/constants';
import CommonTextField from '../../elements/TextField/CommonTextField.component'
import { MyHeader, MyTableHeader, MyRowHeader } from '../../elements/table/MyTable';
import RadioButton from '../../elements/RadioButton';
import _ from 'lodash';

const DialogSelectShiftTemplate = React.createClass({
    propTypes: {
    },

    getInitialState: function () {
        return {
            shiftTemplates: this.props.shiftTemplates,
            selectedShiftTemplate: this.props.selectedShiftTemplate
        };
    },

    componentDidMount: function() {
        this.handleSearchCallback = debounceHelper.debounce((name) => {
            let shiftTemplates = _.filter(this.props.shiftTemplates, (item) => {
                return _.includes(_.toLower(item.name), _.toLower(name));
            });
            this.setState({ shiftTemplates });
        }, WAITING_TIME);
    },

    componentWillReceiveProps: function (nextProps) {
        if (!_.isEqual(this.props.shiftTemplates, nextProps.shiftTemplates) && nextProps.shiftTemplates && nextProps.shiftTemplates.length) {
            this.setState({ shiftTemplates: nextProps.shiftTemplates });
        }
        if (!_.isEqual(this.props.selectedShiftTemplate, nextProps.selectedShiftTemplate)) {
            this.setState({ selectedShiftTemplate: nextProps.selectedShiftTemplate });
        }
    },

    handleSearch: function(value) {
        this.handleSearchCallback(value);
    },

    handleSave: function() {
        this.props.handleSave && this.props.handleSave(this.state.selectedShiftTemplate);
        this.handleClose();
    },

    handleClose: function() {
        this.props.handleClose && this.props.handleClose();
    },

    render: function () {
        const actions = [
            <RaisedButton
                key={0}
                label={RS.getString('SAVE')}
                onClick={this.handleSave}
            />,
            <RaisedButton
                key={1}
                className="raised-button-fourth"
                label={RS.getString('CANCEL')}
                onClick={this.handleClose}
            />
        ];
        return (
            <Dialog
                style={{ widthBody: '750px' }}
                isOpen={this.props.isOpen}
                title={this.props.title}
                actions={actions}
                modal={this.props.modal ? this.props.modal : false}
                handleClose={this.handleClose}
            >
                <div className="dialog-select-shift-template">
                    <div className={"header "}>
                        <div className="search">
                            <CommonTextField
                                onChange={this.handleSearch}
                                hintText={RS.getString('SEARCH_SHIFT_TEMPLATE', 'SKILL')}
                                fullWidth={true}
                            />
                            <img className={'img-search img-gray-brightness'} src={require("../../../images/search.png")} />
                        </div>
                        <div className="pull-right" >
                            <RaisedButton
                                className="raised-button-first-secondary"
                                label={RS.getString('NEW_SHIFT_TEMPLATE')}
                                onClick={() => { }}
                            />
                        </div>
                    </div>
                    <div className="body-shift-templates">
                        <table className="metro-table">
                            <MyHeader>
                                <MyRowHeader>
                                    <MyTableHeader />
                                    <MyTableHeader>
                                        {RS.getString('SHIFT')}
                                    </MyTableHeader>
                                    <MyTableHeader>
                                        {RS.getString("WORKING_TIME")}
                                    </MyTableHeader>
                                    <MyTableHeader>
                                        {RS.getString("BREAK_TIME")}
                                    </MyTableHeader>
                                    <MyTableHeader>
                                        {RS.getString("REGULAR_HOURS")}
                                    </MyTableHeader>
                                </MyRowHeader>
                            </MyHeader>
                            <tbody>
                            {
                                _.flatten(_.map(this.state.shiftTemplates, (item) => {
                                    let nameRow = (
                                        <tr key={item.id}>
                                            <td colSpan="5">
                                                <RadioButton
                                                    name={item.id}
                                                    title={item.name}
                                                    checked={item.id == _.get(this.state, 'selectedShiftTemplate.id')}
                                                    subLabel={<label className="sub-label">{item.isDefault ? `(${RS.getString("DEFAULT")})` : ''}</label>}
                                                    onChange={() => this.setState({ selectedShiftTemplate: item })}
                                                />
                                            </td>
                                        </tr>
                                    );
                                    let itemRows = _.map(item.shiftTimes, (time, index) => {
                                        let length = item.shiftTimes.length;
                                        return (
                                            <tr key={item.id + '-' + time.id} className={index == length - 1 ? 'last-item' : ''}>
                                                <td />
                                                <td>
                                                    <div className="template-name">
                                                        <div className="template-color" style={{ backgroundColor: time.color }}/>
                                                        <div>{time.name}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {time.startTime} - {time.endTime}
                                                </td>
                                                <td>
                                                    {time.breakTimeFrom ? time.breakTimeFrom + ' - ' + time.breakTimeTo : RS.getString("NONE")}
                                                </td>
                                                <td>
                                                    <strong>{time.regularHours + ' ' + RS.getString('HRS')}</strong>
                                                </td>
                                            </tr>
                                        );
                                    });
                                    return [nameRow, ...itemRows];
                                }))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </Dialog>
        );
    }
});

export default DialogSelectShiftTemplate;