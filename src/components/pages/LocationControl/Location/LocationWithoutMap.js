import React, { PropTypes } from 'react';
import { MyHeader, MyRowHeader, MyTableHeader } from '../../../elements/table/MyTable';
import Pagination from '../../../elements/Paginate/Pagination';
import RS, { Option } from '../../../../resources/resourceManager';
import RIGHTS from '../../../../constants/rights';
import ItemsDisplayPerPage from '../../../elements/ItemsDisplayPerPage';
import DialogEditLocation from './DialogEditLocation'
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';
import * as toastr from '../../../../utils/toastr';
import { URL } from '../../../../core/common/app.routes';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import DialogAlert from '../../../elements/DialogAlert';
import RaisedButton from '../../../elements/RaisedButton';

const redirect = getUrlPath(URL.LOCATION);
const propTypes = {
    locations: PropTypes.array,
};

class LocationWithoutMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLocation: undefined,
            isOpenDialogDelete: false
        }
        this.handleDeleteLocation = this.handleDeleteLocation.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        LoadingIndicatorActions.hideAppLoadingIndicator();
        if (nextProps.payload.success) {
            this.dialogEditLocation.close();
            this.setState({isOpenDialogDelete: false})
            this.props.globalActions.resetState();
            this.props.locationActions.loadLocations(this.props.queryString, redirect);
            // toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'))
        }
        // if (nextProps.payload.error.message != '' || nextProps.payload.error.exception) {
        //     let Err = nextProps.payload.error.message;
        //     let locationUsed= RS.getString('LOCATION_USED')
        //     if(Err.substring(Err.length -10 )=='Is_In_Used'){
        //         toastr.error(locationUsed, RS.getString('ERROR'));
        //     }else{
        //         toastr.error(nextProps.payload.error.message, RS.getString('ERROR'));
        //     }
        // }
    }
    handleDeleteLocation() {
        LoadingIndicatorActions.showAppLoadingIndicator();
        this.props.locationActions.deleteLocation(this.state.selectedLocation.id);
    }
    renderLocation(location) {
        return (
            <tr key={location.id}>
                <td >
                    {location.name}
                </td>
                <td >
                    {location.type}
                </td>
                <td >
                    {location.address}
                </td>
                <td className="col-action">
                    <span>
                        {
                            this.props.curEmp.rights.find(x => x === RIGHTS.MODIFY_LOCATION) ?
                                <i className="fa fa-pencil" data-toggle="tooltip" title={RS.getString("EDIT")}
                                    onClick={() => {
                                        this.setState({ selectedLocation: location })
                                        this.dialogEditLocation.open();
                                    }}></i>
                                : null
                        }

                        {
                            this.props.curEmp.rights.find(x => x === RIGHTS.DELETE_LOCATION) ?
                                <i
                                    className="fa fa-trash-o"
                                    data-toggle="tooltip"
                                    title={RS.getString("DELETE")}
                                    onClick={() => this.setState({ isOpenDialogDelete: true, selectedLocation: location })}
                                ></i>
                                : null
                        }
                    </span>
                </td>
            </tr>
        )
    }
    render() {
        let actionAlert = [
            <RaisedButton
                key={0}
                label={RS.getString("CANCEL")}
                onClick={() => { this.setState({ isOpenDialogDelete: false }) }}
                className="raised-button-fourth"
            />,
            <RaisedButton
                key={1}
                label={RS.getString("CONFIRM")}
                onClick={this.handleDeleteLocation}
            />
        ]
        return (
            <div>
                <table className="metro-table">
                    <MyHeader>
                        <MyRowHeader>
                            <MyTableHeader>
                                {RS.getString('LOCATION')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('GEOFENCE_TYPE')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('ADDRESS')}
                            </MyTableHeader>
                            <MyTableHeader>
                                {RS.getString('ACTION')}
                            </MyTableHeader>
                        </MyRowHeader>
                    </MyHeader>
                    <tbody>
                        {
                            _.map(this.props.locations, location => {
                                return this.renderLocation(location);
                            })
                        }
                    </tbody>
                </table>
                <div className="listing-footer">
                    <div className="pull-left">
                        <ItemsDisplayPerPage
                            name="ItemsDisplayPerPage"
                            value={this.props.queryString.page_size}
                            totalRecord={this.props.meta.count}
                            onChange={this.props.handleChangeDisplayPerPage}
                        />
                    </div>
                    <div className="pull-right">
                        {
                            this.props.meta.count > this.props.queryString.page_size ?
                                <Pagination
                                    firstPageText={<i className="fa fa-angle-double-left" aria-hidden="true"></i>}
                                    lastPageText={<i className="fa fa-angle-double-right" aria-hidden="true"></i>}
                                    prevPageText={<i className="fa fa-angle-left" aria-hidden="true"></i>}
                                    nextPageText={<i className="fa fa-angle-right" aria-hidden="true"></i>}
                                    activePage={this.props.queryString.page + 1}
                                    itemsCountPerPage={this.props.queryString.page_size}
                                    totalItemsCount={this.props.meta.count}
                                    onChange={this.props.handlePageClick}
                                /> : undefined
                        }

                    </div>
                </div>
                <DialogEditLocation
                    ref={(dialogEditLocation) => this.dialogEditLocation = dialogEditLocation}
                    location={this.state.selectedLocation}
                    locationActions={this.props.locationActions}
                />
                <DialogAlert
                    modal={false}
                    icon={require("../../../../images/info-icon.png")}
                    isOpen={this.state.isOpenDialogDelete}
                    title={RS.getString('CONFIRMATION')}
                    handleClose={() => this.setState({ isOpenDialogDelete: false })}
                    actions={actionAlert}
                >
                    {RS.getString("CONFIRM_DELETE", ["LOCATION"], Option.FIRSTCAP)}
                </DialogAlert>
            </div>
        )
    }
}

LocationWithoutMap.propTypes = propTypes;
export default LocationWithoutMap;