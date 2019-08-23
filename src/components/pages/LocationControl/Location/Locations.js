import React, { PropTypes } from 'react';
import { URL } from '../../../../core/common/app.routes';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import * as apiHelper from '../../../../utils/apiHelper';
import { QUERY_STRING, LOCATION_MODE, WAITING_TIME, MODE_PAGE } from "./../../../../core/common/constants";
import RS, { Option } from '../../../../resources/resourceManager';
import LocationWithMap from './LocationWithMap'
import LocationWithoutMap from './LocationWithoutMap'
import FilterSearch from '../../../elements/Filter/FilterSearch';
import RaisedButton from '../../../elements/RaisedButton';
import RIGHTS from '../../../../constants/rights';
import debounceHelper from '../../../../utils/debounceHelper';
import DialogAddEditLocationWithMap from './DialogAddEditLocationWithMap'
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';
import * as toastr from '../../../../utils/toastr';

const redirect = getUrlPath(URL.LOCATION);
const propTypes = {

};

class Location extends React.Component {

  constructor(props) {
    super(props);
    let { query } = this.props.location;
    this.state = {
      mode: LOCATION_MODE.WITH_MAP,
      modeDialog: MODE_PAGE.NEW,
      selectedLocation: undefined,
    }
    this.queryString = {
      order_by: query.order_by ? query.order_by : 'name',
      is_desc: query.is_desc == 'true' ? true : false,
      page_size: parseInt(query.page_size) ? parseInt(query.page_size) : QUERY_STRING.PAGE_SIZE,
      page: parseInt(query.page) ? parseInt(query.page) : 0,
    };
    this.handleSearch = this.handleSearch.bind(this)
    this.handleChangeDisplayPerPage = this.handleChangeDisplayPerPage.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.onSubmitDialogAddEditLocation = this.onSubmitDialogAddEditLocation.bind(this)
    this.editLocation = this.editLocation.bind(this)
    this.onBoundsChanged = this.onBoundsChanged.bind(this)
  }

  componentWillMount() {
    this.props.locationActions.loadLocations(this.queryString, redirect);

  }

  componentDidMount() {
    this.handleSearchCallback = debounceHelper.debounce(function () {
      this.queryString.page = 0;
      this.props.locationActions.loadLocations(this.queryString, redirect);
      apiHelper.handleFilterParamsChange(URL.LOCATION, this.queryString);
    }, WAITING_TIME);
  }

  componentWillReceiveProps(nextProps) {
    LoadingIndicatorActions.hideAppLoadingIndicator();
    if (nextProps.payload.success) {
      this.setState({ openDialogAddEdit: false, selectedLocation: undefined })
      this.props.globalActions.resetState();
      this.props.locationActions.loadLocations(this.queryString, redirect);
      toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'))
    }
    if (nextProps.payload.error.message != '' || nextProps.payload.error.exception) {
      // toastr.error(nextProps.payload.error.message, RS.getString('ERROR'));
      // this.props.globalActions.resetError();
      let Err = nextProps.payload.error.message;
      let locationUsed = RS.getString('LOCATION_USED')
      if (Err.substring(Err.length - 10) == 'Is_In_Used') {
        toastr.error(locationUsed, RS.getString('ERROR'));
      } else {
        toastr.error(nextProps.payload.error.message, RS.getString('ERROR'));
      }
      this.props.globalActions.resetError();
    }
  }

  handlePageClick(page) {
    this.queryString.page = page - 1;
    apiHelper.handleFilterParamsChange(URL.LOCATION, this.queryString);
    this.props.locationActions.loadLocations(this.queryString, redirect);
  }

  handleChangeDisplayPerPage(pageSize) {
    this.queryString.page_size = pageSize;
    this.queryString.page = 0;
    apiHelper.handleFilterParamsChange(URL.LOCATION, this.queryString);
    this.props.locationActions.loadLocations(this.queryString, redirect);
  }
  handleSearch(value) {
    this.queryString.name = value;
    this.handleSearchCallback(value);
  }
  onSubmitDialogAddEditLocation(location) {
    switch (this.state.modeDialog) {
      case MODE_PAGE.NEW:
        this.props.locationActions.addLocation(location)
        LoadingIndicatorActions.showAppLoadingIndicator();
        break;
      case MODE_PAGE.EDIT:
        this.props.locationActions.editLocation(location.id, location)
        LoadingIndicatorActions.showAppLoadingIndicator();
        break;
    }
  }
  editLocation(location) {
    this.setState({ openDialogAddEdit: true, selectedLocation: location, modeDialog: MODE_PAGE.EDIT })
  }
  onBoundsChanged(bounds, center, zoom) {
    this.zoom = zoom,
      this.center = center
  }
  renderFilter() {
    return (
      <div className="row row-header">
        <div className="employees-actions-group">
          <FilterSearch
            ref={(filterSearch) => this.filterSearch = filterSearch}
            placeholder={RS.getString('SEARCH_LOCATION')}
            handleSearchChange={this.handleSearch}
            defaultValue={this.queryString.name}
            inputType='text'
            inputId='searchGroupName'
          />
          {this.renderOptionView()}
          {
            this.props.curEmp.rights.find(x => x === RIGHTS.CREATE_LOCATION) ?
              <RaisedButton
                label={RS.getString('NEW_LOCATION', null, Option.CAPEACHWORD)}
                onClick={() => this.setState({ openDialogAddEdit: true, modeDialog: MODE_PAGE.NEW })}
              /> : null
          }
        </div>
      </div>
    )
  }
  renderOptionView() {
    return (
      <div className="btn-group btn-group-switch-view">
        <button type="button" className={this.state.mode == LOCATION_MODE.WITHOUT_MAP ? 'btn dropdown-toggle is--active' : 'btn dropdown-toggle'} data-toggle="dropdown" onClick={() => this.setState({ mode: LOCATION_MODE.WITHOUT_MAP })}>
          <i className="fa fa-list-ul" aria-hidden="true"></i>
        </button>
        <button type="button" className={this.state.mode == LOCATION_MODE.WITH_MAP ? 'btn dropdown-toggle is--active' : 'btn dropdown-toggle'} data-toggle="dropdown" onClick={() => this.setState({ mode: LOCATION_MODE.WITH_MAP })}>
          <i className="fa fa-sitemap" aria-hidden="true"></i>
        </button>
      </div>
    );
  }
  renderContent() {
    switch (this.state.mode) {

      case LOCATION_MODE.WITHOUT_MAP:
        return (
          <LocationWithoutMap
            {...this.props}
            handleChangeDisplayPerPage={this.handleChangeDisplayPerPage}
            handlePageClick={this.handlePageClick}
            locationActions={this.props.locationActions}
            queryString={this.queryString}

          />
        )
      case LOCATION_MODE.WITH_MAP:
        return (
          <LocationWithMap
            {...this.props}
            editLocation={this.editLocation}
            onBoundsChanged={this.onBoundsChanged}
          />
        )
      default:
        return null;
    }
  }
  render() {
    return (
      <div className="page-container locations">
        <div className="header">
          {RS.getString('LOCATIONS')}
        </div>
        {this.renderFilter()}
        {this.renderContent()}
        {
          this.state.openDialogAddEdit &&
          <DialogAddEditLocationWithMap
            isOpen={this.state.openDialogAddEdit}
            handleClose={() => this.setState({ openDialogAddEdit: false, selectedLocation: undefined })}
            mode={this.state.modeDialog}
            onSubmit={this.onSubmitDialogAddEditLocation}
            location={this.state.selectedLocation}
            zoom={this.zoom}
            center={this.state.selectedLocation ? this.state.selectedLocation.center : this.center}
          />
        }
      </div>
    )
  }
}

Location.propTypes = propTypes;
export default Location;
