import React, { PropTypes } from 'react';
import _ from 'lodash';

import RaisedButton from '../../../elements/RaisedButton';
import DialogAddLocation from '../../../../containers/CustomerManagement/ContractManagement/DialogAddLocationContainer';
import RS, { Option } from '../../../../resources/resourceManager';
import { WEEKDAYS } from '../../../../core/common/constants';

import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import MyCheckBox from '../../../elements/MyCheckBox';
import MyCheckBoxSpecial from '../../../elements/MyCheckBoxSpecial';
import WorkingLocationDetail from './WorkingLocationDetail';
import FlexibleWorkingTimeDetail from './FlexibleWorkingTimeDetail'
import DialogConfirm from '../../../elements/DialogConfirm';

const propTypes = {
    flexibleWorkingTimes: PropTypes.array,
    locations: PropTypes.array,
    scheduleTemplate: PropTypes.object,
    shiftTemplate: PropTypes.object,
    jobRoles: PropTypes.array,
    contractTime: PropTypes.object,
    viewMode: PropTypes.bool,
    workingLocations: PropTypes.array,
    groupSubs: PropTypes.array,
    groups: PropTypes.array,
    group: PropTypes.object,
};

class WorkingLocation extends React.Component {
    constructor(props, context, value) {
        super(props, context);
        this.state = {
            workingLocations: props.workingLocations && props.workingLocations.length ? _.cloneDeep(props.workingLocations) : [],
            locations: [],
            selectedLocations: [],
            searchTxt: '',
            locationGroupSubs: [],
            flexibleWorkingTimes: props.flexibleWorkingTimes ? _.cloneDeep(props.flexibleWorkingTimes) : [],
            isConfirmDeleteWorkingLocation: false,
            isConformDeleteFlexibleWorkingTime: false
        };
        this.workingLocationDetails = [];
        this.flexibleWorkingTimeDetails = [];
        this.handleAddLocation = this.handleAddLocation.bind(this);
        this.handleConfirmDeleteWorkingLocation = this.handleConfirmDeleteWorkingLocation.bind(this);
        this.handleConfirmDeleteFlexibleWorkingTime = this.handleConfirmDeleteFlexibleWorkingTime.bind(this);
        this.handleSubmitDeleteFlexibleWorkingTime = this.handleSubmitDeleteFlexibleWorkingTime.bind(this);
        this.validate = this.validate.bind(this);
        this.handleAddFlexibleWorkingTime = this.handleAddFlexibleWorkingTime.bind(this);
        this.handleUpdateFlexibleWorkingTime = this.handleUpdateFlexibleWorkingTime.bind(this);
        this.handleSubmitDeleteWorkingLocation = this.handleSubmitDeleteWorkingLocation.bind(this);
        this.handleCopyWorkingLocation = this.handleCopyWorkingLocation.bind(this)
        this.handleOpenCopyWorkingLocation = this.handleOpenCopyWorkingLocation.bind(this)
        this.handleCopyFlexibleWorkingTime = this.handleCopyFlexibleWorkingTime.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.workingLocations, nextProps.workingLocations) && !_.isEmpty(nextProps.workingLocations)) {
            this.setState({ workingLocations: _.cloneDeep(nextProps.workingLocations) });
        }
        if (!_.isEqual(this.props.flexibleWorkingTimes, nextProps.flexibleWorkingTimes) && !_.isEmpty(nextProps.flexibleWorkingTimes)) {
            this.setState({ flexibleWorkingTimes: _.cloneDeep(nextProps.flexibleWorkingTimes) });
        }
        if (!_.isEmpty(nextProps.groupSubs) || !_.isEmpty(nextProps.group)) {
            this.setState({
                locationGroupSubs: nextProps.group ? [nextProps.group, ...nextProps.groupSubs] : nextProps.groupSubs
            });
        }
    }

    mapToFlexibleWorkingTimes(flexibleWorkingTimes) {
        let flexibleWorkingTimesClone = _.cloneDeep(flexibleWorkingTimes);
        flexibleWorkingTimesClone = _.map(flexibleWorkingTimesClone, item => {
            let schedulesShiftGroup = _.groupBy(item.shifts, schedule => {
                return [schedule.shiftTime.id];
            });
            let schedulesShift = [];
            for (let shift in schedulesShiftGroup) {
                schedulesShift.push({
                    schedulesShift: schedulesShiftGroup[shift],
                    shiftTime: schedulesShiftGroup[shift][0]['shiftTime']
                });
            }
            item.shifts = schedulesShift;
            return item;
        });
        this.setState({
            flexibleWorkingTimes: flexibleWorkingTimesClone
        });
    }

    mapToWorkingLocations(workingLocations) {
        let workingLocationsClone = _.cloneDeep(workingLocations);
        workingLocationsClone = _.map(workingLocationsClone, item => {
            let schedulesShiftGroup = _.groupBy(item.shifts, schedule => {
                return [schedule.shiftTime.id];
            });
            let schedulesShift = [];
            for (let shift in schedulesShiftGroup) {
                schedulesShift.push({
                    schedulesShift: schedulesShiftGroup[shift],
                    shiftTime: schedulesShiftGroup[shift][0]['shiftTime']
                });
            }
            item.shifts = schedulesShift;
            return item;
        });
        this.setState({
            workingLocations: workingLocationsClone
        });
    }

    getValue() {
        let workingLocations = [];
        _.forEach(this.workingLocationDetails, workingLocation => {
            if (workingLocation) {
                const data = workingLocation.getValue();
                workingLocations.push(data);
            }
        });
        let flexibleWorkingTimes = [];
        _.forEach(this.flexibleWorkingTimeDetails, flexible => {
            if (flexible) {
                flexibleWorkingTimes.push(flexible.getValue());
            }
        })

        return { workingLocations, flexibleWorkingTimes };
    }

    validate() {
        let isValid = true;
        if (!this.state.workingLocations.length) {
            return false;
        }
        _.forEach(this.workingLocationDetails, workingLocation => {
            if (workingLocation && !workingLocation.validate()) {
                isValid = false;
            }
        });
        _.forEach(this.flexibleWorkingTimeDetails, flexible => {
            if (flexible && !flexible.validate()) {
                isValid = false;
            }
        });

        return isValid;
    }

    workingLocationHasShifts = () => {
        let valid = true;
        if (this.state.flexibleWorkingTimes.length || this.state.workingLocations.length) {
            _.some(['flexibleWorkingTimes', 'workingLocations'], workings => {
                _.some(this.state[workings], location => {
                    if (!location.shifts.length) {
                        valid = false;
                        return true;
                    }
                })
            })
        } else {
            valid = false;
        }
        return valid;
    }

    handleAddFlexibleWorkingTime() {
        this.setState({
            flexibleWorkingTimes: [...this.state.flexibleWorkingTimes, ...[{ shifts: [], timestamp: new Date().getTime() }]]
        }, () => {
            this.props.onChange && this.props.onChange(this.workingLocationHasShifts());
        });
    }

    handleAddLocation(locations) {
        const workingLocations = _.map(locations, (location, index) => {
            return {
                location: location,
                shifts: [],
                timestamp: `${new Date().getTime()}-${index}`
            };
        });

        this.setState({
            selectedLocations: [],
            isOpenAddLocation: false,
            workingLocations: [...this.state.workingLocations, ...workingLocations]
        }, () => {
            this.props.onChange && this.props.onChange(this.workingLocationHasShifts());
        });
    }

    handleOpenCopyWorkingLocation(indexCopyWorkingLocation) {
        this.indexCopyWorkingLocation = indexCopyWorkingLocation;
        this.setState({ isOpenAddLocation: true })
    }

    handleCopyWorkingLocation(locations) {
        let sourceWorkingLocation = _.cloneDeep(this.state.workingLocations[this.indexCopyWorkingLocation]);
        this.indexCopyWorkingLocation = undefined;
        locations.forEach((location, index) => {
            let cloneWorkingLocation = _.cloneDeep(sourceWorkingLocation);
            cloneWorkingLocation.location = location;
            cloneWorkingLocation.timestamp = `${new Date().getTime()}-${index}`;
            this.state.workingLocations.push(cloneWorkingLocation)
        });
        this.setState({
            workinglocations: this.state.workingLocations,
            isOpenAddLocation: false
        })
    }

    handleCopyFlexibleWorkingTime(indexCopyFlexibleWorkingTime) {
        let copyFlexiableWorkingTime = _.cloneDeep(this.state.flexibleWorkingTimes[indexCopyFlexibleWorkingTime]);
        copyFlexiableWorkingTime.name = '';
        copyFlexiableWorkingTime.timestamp = `${new Date().getTime()}`;
        this.setState({
            flexibleWorkingTimes: [...this.state.flexibleWorkingTimes, copyFlexiableWorkingTime]
        })
    }

    handleConfirmDeleteWorkingLocation(index, locationId) {
        this.indexDeletingWorkingLocation = index;
        this.setState({ isConfirmDeleteWorkingLocation: true })
    }

    handleSubmitDeleteWorkingLocation() {
        this.state.workingLocations.splice(this.indexDeletingWorkingLocation, 1)
        this.indexDeletingWorkingLocation = undefined;
        this.setState({
            workingLocations: this.state.workingLocations,
            isConfirmDeleteWorkingLocation: false
        }, () => {
            this.props.onChange && this.props.onChange(this.workingLocationHasShifts());
        })
    }
    handleConfirmDeleteFlexibleWorkingTime(index) {
        this.indexDeletingFlexibleWorkingTime = index;
        this.setState({ isConformDeleteFlexibleWorkingTime: true })

    }
    handleSubmitDeleteFlexibleWorkingTime() {
        this.state.flexibleWorkingTimes.splice(this.indexDeletingFlexibleWorkingTime, 1)
        this.indexDeletingFlexibleWorkingTime = undefined;
        this.setState({
            flexibleWorkingTimes: this.state.flexibleWorkingTimes,
            isConformDeleteFlexibleWorkingTime: false
        }, () => {
            this.props.onChange && this.props.onChange(this.workingLocationHasShifts());
        });
    }

    handleUpdateWorkingLocation(index, workingLocation) {
        let workingLocationsClone = _.cloneDeep(this.state.workingLocations);
        workingLocationsClone[index] = workingLocation;
        this.setState({
            workingLocations: workingLocationsClone
        }, () => {
            this.props.onChange && this.props.onChange(this.workingLocationHasShifts());
        });
    }

    handleUpdateFlexibleWorkingTime(index, flexibleWorkingTime) {
        let flexibleWorkingTimesClone = _.cloneDeep(this.state.flexibleWorkingTimes);
        flexibleWorkingTimesClone[index] = flexibleWorkingTime;
        this.setState({
            flexibleWorkingTimes: flexibleWorkingTimesClone
        }, () => {
            this.props.onChange && this.props.onChange(this.workingLocationHasShifts());
        });
    }

    render() {
        return (
            <div className="new-contract-working-location-container" >
                <div className="new-contract-title uppercase" >{RS.getString('LOCATION_INFORMATION')}</div>
                {
                    (!!this.state.workingLocations.length || !!this.state.flexibleWorkingTimes.length) && !this.props.viewMode &&
                    < div className="pull-right">
                        <RaisedButton
                            className="raised-button-first-secondary"
                            label={RS.getString('ADD_FLEXIBLE_WORKING_TIME')}
                            onClick={() => this.handleAddFlexibleWorkingTime()}
                        />
                        <RaisedButton
                            className="raised-button-first-secondary"
                            label={RS.getString('ADD_LOCATION')}
                            onClick={() => this.setState({ isOpenAddLocation: true })}
                        />
                    </div>
                }
                <div>
                    {
                        !(this.state.workingLocations.length || this.state.flexibleWorkingTimes.length || this.props.viewMode) ?
                            (
                                <div className="col-md-12 col-sm-12 no-location-added">
                                    <div className="col-md-12 col-sm-12 no-location-added__icon">
                                        <i className="icon-building-type1"></i>
                                    </div>
                                    <div className="col-md-12 col-sm-12 no-location-added__title">{RS.getString('NO_LOCATION_ADDED')}</div>
                                    <RaisedButton
                                        className="raised-button-first-secondary"
                                        label={RS.getString('ADD_LOCATION')}
                                        onClick={() => this.setState({ isOpenAddLocation: true })}
                                    />
                                </div>
                            ) :
                            (
                                <div className="locations-container">
                                    {
                                        _.map(this.state.workingLocations, (workingLocation, index) => {
                                            const contractTime = {
                                                startDate: this.props.contractTime.startDate,
                                                endDate: this.props.contractTime.endDate,
                                                group: workingLocation.group
                                            }
                                            return (
                                                <WorkingLocationDetail
                                                    isEdit={!!workingLocation.id}
                                                    viewMode={this.props.viewMode}
                                                    key={workingLocation.timestamp}
                                                    index={index}
                                                    locationGroupSubs={this.state.locationGroupSubs}
                                                    workingLocation={workingLocation}
                                                    jobRoles={this.props.jobRoles}
                                                    shiftTemplates={this.props.shiftTemplates}
                                                    handleDeleteWorkingLocation={this.handleConfirmDeleteWorkingLocation.bind(this, index)}
                                                    handleUpdateWorkingLocation={this.handleUpdateWorkingLocation.bind(this)}
                                                    contractTime={contractTime}
                                                    ref={input => this.workingLocationDetails[index] = input}
                                                    groups={this.props.groups}
                                                    group={this.props.group}
                                                    handleCopyWorkingLocation={this.handleOpenCopyWorkingLocation.bind(this, index)}
                                                />
                                            );
                                        })
                                    }
                                </div>
                            )
                    }

                    <div className="locations-container">
                        {
                            _.map(this.state.flexibleWorkingTimes, (flexibleWorkingTime, index) => {
                                const contractTime = {
                                    startDate: this.props.contractTime.startDate,
                                    endDate: this.props.contractTime.endDate,
                                    group: flexibleWorkingTime.group
                                }
                                let flexibleNames = [];
                                _.forEach(this.state.flexibleWorkingTimes, (item, i) => {
                                    if (index != i && item.name) {
                                        flexibleNames.push(item.name);
                                    }
                                })

                                return (
                                    <FlexibleWorkingTimeDetail
                                        isEdit={!!flexibleWorkingTime.id}
                                        viewMode={this.props.viewMode}
                                        key={flexibleWorkingTime.timestamp}
                                        flexibleNames={flexibleNames}
                                        locationGroupSubs={this.state.locationGroupSubs}
                                        flexibleWorkingTime={flexibleWorkingTime}
                                        jobRoles={this.props.jobRoles}
                                        shiftTemplate={this.props.shiftTemplate}
                                        scheduleTemplate={this.props.scheduleTemplate}
                                        handleDeleteFlexibleWorkingTime={this.handleConfirmDeleteFlexibleWorkingTime.bind(this, index)}
                                        handleUpdateFlexibleWorkingTime={this.handleUpdateFlexibleWorkingTime.bind(this, index)}
                                        contractTime={contractTime}
                                        ref={input => this.flexibleWorkingTimeDetails[index] = input}
                                        groups={this.props.groups}
                                        group={this.props.group}
                                        handleCopyFlexibleWorkingTime={this.handleCopyFlexibleWorkingTime.bind(this, index)}
                                    />
                                );
                            })
                        }
                    </div>
                </div>
                <DialogAddLocation
                    style={{ widthBody: '600px' }}
                    isOpen={this.state.isOpenAddLocation}
                    title={this.indexCopyWorkingLocation != undefined ? RS.getString('COPY_TO_OTHER_LOCATIONS', null, 'UPPER') : RS.getString('ADD_LOCATION', null, 'UPPER')}
                    handleAddLocation={this.indexCopyWorkingLocation != undefined ? this.handleCopyWorkingLocation : this.handleAddLocation}
                    handleClose={() => { this.setState({ isOpenAddLocation: false }); }}
                    className="dialog-add-locations "
                />
                <DialogConfirm
                    title={RS.getString('DELETE_TITLE')}
                    isOpen={this.state.isConfirmDeleteWorkingLocation}
                    handleSubmit={this.handleSubmitDeleteWorkingLocation}
                    handleClose={() => this.setState({ isConfirmDeleteWorkingLocation: false })}
                >
                    <span>{RS.getString('CONFIRM_DELETE', 'WORKING_LOCATION', Option.FIRSTCAP)}</span>
                </DialogConfirm>
                <DialogConfirm
                    title={RS.getString('DELETE_TITLE')}
                    isOpen={this.state.isConformDeleteFlexibleWorkingTime}
                    handleSubmit={this.handleSubmitDeleteFlexibleWorkingTime}
                    handleClose={() => this.setState({ isConformDeleteFlexibleWorkingTime: false })}
                >
                    <span>{RS.getString('CONFIRM_DELETE', 'FLEXIBLE_WORKING_TIME', Option.FIRSTCAP)}</span>
                </DialogConfirm>
            </div >
        );
    }
}

WorkingLocation.propTypes = propTypes;

export default WorkingLocation;