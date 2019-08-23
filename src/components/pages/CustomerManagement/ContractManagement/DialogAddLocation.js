import React, { PropTypes } from 'react';
import _ from 'lodash';
import Dialog from '../../../elements/Dialog';
import RaisedButton from '../../../elements/RaisedButton';
import { MyHeader, MyTableHeader, MyRowHeader } from '../../../elements/table/MyTable';
import MyCheckBox from '../../../elements/MyCheckBox';
import MyCheckBoxSpecial from '../../../elements/MyCheckBoxSpecial';
import DialogAddEditLocationWithMap from '../../LocationControl/Location/DialogAddEditLocationWithMap'
import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import RS, { Option } from '../../../../resources/resourceManager';
import { MODE_PAGE } from "./../../../../core/common/constants";
import toastr from 'toastr';
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';

const propTypes = {
    handleAddLocation: PropTypes.func
}

class DialogAddLocation extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedLocations: {},
            locations: [],
            searchTxt: '',
            isNewLocation: false
        }

        this.renderContentAddLocation = this.renderContentAddLocation.bind(this)
        this.handleCheckAll = this.handleCheckAll.bind(this);
        this.handleItemChecked = this.handleItemChecked.bind(this);
        this.handleOnChangeSearchText = this.handleOnChangeSearchText.bind(this)
        this.handleSubmitUserInput = this.handleSubmitUserInput.bind(this)
        this.handleNewLocation = this.handleNewLocation.bind(this)
    }
    componentDidMount() {
        this.setState({ locations: _.cloneDeep(this.props.locations) })
        this.props.locationActions.loadLocations({});
    }
    componentWillReceiveProps(nextProps) {
        LoadingIndicatorActions.hideAppLoadingIndicator();        
        this.setState({
            locations: nextProps.locations
        })
        if (nextProps.payload.success) {
            this.props.locationActions.loadLocations({});
            this.props.globalActions.resetLocationState();
        }
        if (nextProps.payload.error.message != '') {
            toastr.error(RS.getString(nextProps.payload.error.message), RS.getString('ERROR'))
            this.props.globalActions.resetError();
        }
    }

    handleItemChecked(idLocation, checked) {
        if (checked)
            this.state.selectedLocations[idLocation] = checked;
        else
            delete this.state.selectedLocations[idLocation]
        this.setState({ selectedLocations: this.state.selectedLocations })
    }

    handleCheckAll(hasItem) {
        if (Object.keys(this.state.selectedLocations).length) {
            this.setState({ selectedLocations: {} })
        }
        else {
            _.forEach(this.props.locations, item => {
                this.state.selectedLocations[item.id] = true;
            });
            this.setState({ selectedLocations: this.state.selectedLocations })
        }

    }

    handleOnChangeSearchText(e, value) {
        value = value || '';
        this.setState({ searchTxt: value });
        const foundlocations = _.filter(this.props.locations, item => {
            return _.includes(item.name.toUpperCase(), value.toUpperCase());
        });
        this.setState({ locations: foundlocations })
    }

    handleSubmitUserInput() {
        let locations = _.intersectionWith(this.props.locations, Object.keys(this.state.selectedLocations), (a, b) => {
            return a.id == b;
        })

        this.props.handleAddLocation(locations)
        this.setState({ selectedLocations: {}, searchTxt: '' })
    }
    handleNewLocation(location) {
        this.props.locationActions.addLocation(location)
        LoadingIndicatorActions.showAppLoadingIndicator();     
        this.setState({ isNewLocation: false })
    }
    renderContentAddLocation() {
        const numberSelectedLocations = Object.keys(this.state.selectedLocations).length
        const cssCheckAll = numberSelectedLocations === this.props.locations.length ? "checkbox-special" : "checkbox-special-type2";

        return (
            <div>
                <div className="row">
                    <div className="col-xs-12" >
                        <div className="search" >
                            <CommonTextField
                                clear
                                onChange={this.handleOnChangeSearchText}
                                hintText={RS.getString('SEARCH') + '...'}
                                fullWidth
                                ref={(input) => this.searchText = input}
                                defaultValue={this.state.searchTxt}
                            />
                            <img className={'img-search img-gray-brightness'} src={require("../../../../images/search.png")} />
                        </div>
                        <div className="new-location">
                            <RaisedButton
                                label={RS.getString('NEW_LOCATION')}
                                className="raised-button-first-secondary"
                                onClick={() => { this.setState({ isNewLocation: true }) }}
                            />
                        </div>
                    </div>
                </div>
                <table className="metro-table ">
                    <MyHeader>
                        <MyRowHeader>
                            <MyTableHeader>
                                <div className={cssCheckAll}>
                                    <MyCheckBoxSpecial
                                        onChange={this.handleCheckAll.bind(this, numberSelectedLocations > 0)}
                                        checked={numberSelectedLocations > 0}
                                        className="filled-in"
                                        id="all-employee"
                                    />
                                </div>
                            </MyTableHeader>
                            <MyTableHeader>{RS.getString('LOCATION')}</MyTableHeader>
                            <MyTableHeader>{RS.getString('ADDRESS')}</MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {this.state.locations ?
                            this.state.locations.map(function (location, index) {
                                return (
                                    <tr
                                        key={location.id}
                                        className={"pointer" + (this.state.selectedLocations[location.id] ? ' active' : '')}
                                        onClick={this.handleItemChecked.bind(this, location.id, !this.state.selectedLocations[location.id])}
                                    >
                                        <td>
                                            <MyCheckBox
                                                id={'export_column_name' + location.id}
                                                defaultValue={this.state.selectedLocations[location.id] || false}
                                            />
                                        </td>
                                        <td >
                                            {location.name}
                                        </td>
                                        <td>
                                            {location.address}
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

    render() {
        if (this.state.isNewLocation) {
            return (
                <DialogAddEditLocationWithMap
                    isOpen={true}
                    handleClose={() => this.setState({ isNewLocation: false })}
                    mode={MODE_PAGE.NEW}
                    onSubmit={this.handleNewLocation}
                />
            )
        }
        return (
            <Dialog
                style={this.props.style}
                isOpen={this.props.isOpen}
                title={this.props.title}
                actions={[
                    <RaisedButton
                        key={1}
                        className="raised-button-fourth"
                        label={RS.getString('CANCEL')}
                        onClick={() => { this.setState({ selectedLocations: {} }); this.props.handleClose() }}
                    />,
                    <RaisedButton
                        key={0}
                        label={RS.getString('OK')}
                        onClick={this.handleSubmitUserInput}
                    />
                ]}
                handleClose={this.props.handleClose}
                className={this.props.className}
                modal
            >
                <div>
                    {this.renderContentAddLocation()}
                </div>
            </Dialog>
        )

    }

}

DialogAddLocation.propTypes = propTypes;

export default DialogAddLocation;
