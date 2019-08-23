import React, { PropTypes } from 'react'
import RS, { Option } from "../../../../resources/resourceManager";
import Dialog from '../../../elements/Dialog';
import {
    MyHeader,
    MyTableHeader,
    MyRowHeader
} from "../../../elements/table/MyTable";
import RaisedButton from "../../../elements/RaisedButton";
import fieldValidations from '../../../../validation/common.field.validation';
import MyCheckBox from '../../../elements/MyCheckBox';
import CommonDatePicker from '../../../elements/DatePicker/CommonDatePicker';

const propTypes = {

}
class DialogSubmitTimesheets extends React.Component {
    constructor(props) {
        super(props)

        this.endDate = [];
        this.state = {
            groups: _.cloneDeep(this.props.groups)
        }
        this.handleOnBlurEndDate = this.handleOnBlurEndDate.bind(this)
        this.handleSubmitTimesheet = this.handleSubmitTimesheet.bind(this)
        this.handleCheckItemGroups = this.handleCheckItemGroups.bind(this)


    }
    componentWillReceiveProps(nextProps) {
        this.setState({ groups: _.cloneDeep(nextProps.groups) })
    }

    handleCheckItemGroups(index) {
        this.state.groups[index].checked = !this.state.groups[index].checked;
        this.setState({ ...this.state });
    }

    handleOnBlurEndDate(index, value) {
        this.state.groups[index].submitTo = value;
        this.setState({ ...this.state });
    }
    
    handleSubmitTimesheet() {
        let isValid = true;
        let teamTimesheets = [];
        _.forEach(this.state.groups, (group, i) => {
            if (this.endDate[i] && !this.endDate[i].validate() && isValid) {
                isValid = false;
            }
            if (group.checked && !group.timesheetDisabled && !group.notAllowSubmit) {
                teamTimesheets.push({ groupId: group.id, startDate: group.lastSubmission, endDate: group.submitTo });
            }
        });
        if (!isValid) {
            return;
        }
        this.props.handleSubmitTimesheet(teamTimesheets);
    }
    
    renderTreegrid() {
        let isOneGroup = this.state.groups.length == 1;
        return _.map(this.state.groups, (group, index) => {

            const currentDate = new Date();
            const endDateConstraint = _.assign({},
                fieldValidations.date, fieldValidations.dateRange(
                    group.lastSubmission,
                    new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59)
                ));

            if (!group.checked && !group.notAllowSubmit) {
                return (
                    <tr
                        key={index + group.name}
                        className={'tree-node treegrid-' + group.id + (group.parent ? ' treegrid-parent-' + group.parent.id : '') + ' tr-expand'}
                    >
                        <td style={{ width: '40%' }}>
                            {isOneGroup ? group.name :
                                < MyCheckBox
                                    bodyClassName="inline-block"
                                    label={group.name}
                                    defaultValue={false}
                                    disabled
                                    unStopPropagation
                                />}
                        </td>
                        <td colSpan="2" className="warning-row">
                            {group.notAllowSubmit ? RS.getString('P132') : RS.getString('P131')}
                            <img src={require("../../../../images/warning-icon.png")} />
                        </td>
                    </tr>
                );
            }
            return (
                <tr
                    key={index + group.name}
                    className={'tree-node treegrid-' + group.id + (group.parent ? ' treegrid-parent-' + group.parent.id : '') + ' tr-expand'}
                >
                    <td style={{ width: '40%' }}>
                        {
                            isOneGroup ? group.name :
                                <MyCheckBox
                                    bodyClassName="inline-block"
                                    label={group.name}
                                    defaultValue={group.checked}
                                    onChange={this.handleCheckItemGroups.bind(this, index)}
                                    unStopPropagation
                                />
                        }

                    </td>
                    <td>
                        <CommonDatePicker
                            disabled
                            hintText="dd/mm/yyyy"
                            id="startdate"
                            defaultValue={group.lastSubmission}
                            endDate="0d"
                            orientation="bottom auto"
                            language={RS.getString("LANG_KEY")}
                        />
                    </td>
                    <td>
                        <CommonDatePicker
                            disabled={!!group.submitTo}
                            ref={(input) => this.endDate[index] = input}
                            hintText="dd/mm/yyyy"
                            id="enddate"
                            defaultValue={group.submitTo}
                            onBlur={this.handleOnBlurEndDate.bind(this, index)}
                            constraint={group.submitTo ? {} : endDateConstraint}
                            orientation="bottom auto"
                            language={RS.getString("LANG_KEY")}
                        />
                    </td>
                </tr>
            );
        });
    }
    renderSubmitTimesheet() {
        return (

            <table style={{ width: '100%' }} className="tree preventCollapse metro-table" >
                <MyHeader>
                    <MyRowHeader>
                        <MyTableHeader>
                            {RS.getString('GROUP')}
                        </MyTableHeader>
                        <MyTableHeader>
                            {RS.getString('FROM')}
                        </MyTableHeader>
                        <MyTableHeader>
                            {RS.getString('TO')}
                        </MyTableHeader>
                    </MyRowHeader>
                </MyHeader>
                <tbody>
                    {this.renderTreegrid()}
                </tbody>
            </table >
        );
    }
    render() {
        const canSubmit = _.find(this.state.groups, group => {
            return (!group.disabled && group.checked && !group.notAllowSubmit);
        });
        const actionSubmitTimesheet = [
            <RaisedButton
                key={0}
                className="raised-button-fourth"
                label={RS.getString('CANCEL')}
                onClick={this.props.handleClose}
            />,
            <RaisedButton
                key={1}
                disabled={!canSubmit}
                label={RS.getString('SUBMIT')}
                onClick={this.handleSubmitTimesheet}
            />
        ];
        return (
            <Dialog
                style={{ widthBody: '700px' }}
                isOpen={this.props.isOpen}
                title={this.props.title}
                actions={actionSubmitTimesheet}
                handleClose={this.props.handleClose}
                className="dialog-submit-timesheet"
                modal
            >
                {this.renderSubmitTimesheet()}
            </Dialog>
        )
    }
}
DialogSubmitTimesheets.propTypes = propTypes
export default DialogSubmitTimesheets;