import React from 'react';
import * as toastr from '../../../utils/toastr';
import { browserHistory } from 'react-router';
import Breadcrumb from '../../elements/Breadcrumb';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import { URL } from '../../../core/common/app.routes';
import RS, { Option } from "../../../resources/resourceManager";
import HandsetInformation from './HandsetInformation';
import HandsetStatus from './HandsetStatus';
import PurchaseAndWarrantyHandset from './PurchaseAndWarrantyHandset';
import RaisedButton from '../../elements/RaisedButton';
import DialogConfirm from '../../elements/DialogConfirm';
import * as LoadingIndicatorActions from '../../../utils/loadingIndicatorActions';
import { HANDSET_STATUS } from '../../../core/common/constants';

import * as handsetActions from '../../../actionsv2/handsetActions';
import { LOAD_HANDSET, EDIT_HANDSET, DELETE_HANDSET } from '../../../constants/actionTypes';

class EditHandset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasChange: false,
            isOpenDeleteDialog: false,
            handset: {}
        };
        this.handleDeleteHandset = this.handleDeleteHandset.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        handsetActions.loadHandset(this.props.params.handsetId, this.handleCallbackActions.bind(this, LOAD_HANDSET));
    }

    handleCallbackActions = (actionType, err, result) => {
        LoadingIndicatorActions.hideAppLoadingIndicator();
        if (err) {
            toastr.error(err.message, RS.getString("ERROR"));
        }
        else {
            switch (actionType) {
                case LOAD_HANDSET: {
                    this.setState({ handset: result });
                    break;
                }
                case EDIT_HANDSET: {
                    this.showSuccess();
                    this.setState({ handset: result });
                    break;
                }
                case DELETE_HANDSET: {
                    this.showSuccess();
                    browserHistory.push(getUrlPath(URL.HANDSETS));
                }
                default: break;
            }
        }
    }

    showSuccess = () => {
        toastr.success(RS.getString('ACTION_SUCCESSFUL'), RS.getString('SUCCESSFUL'));
    }

    handleDeleteHandset() {
        LoadingIndicatorActions.showAppLoadingIndicator();
        handsetActions.deleteHandset(this.props.params.handsetId, this.handleCallbackActions.bind(this, DELETE_HANDSET));
    }

    handleSave() {
        if (!this.validate()) {
            return;
        }
        let handsetDto = _.assign({},
            this.state.handset, this.handsetInfo.getValue(),
            this.purchaseAndWarranty.getValue(), this.handsetStatus.getValue()
        );
        LoadingIndicatorActions.showAppLoadingIndicator()
        handsetActions.editHandset(handsetDto, this.handleCallbackActions.bind(this, EDIT_HANDSET));
    }

    validate() {
        if (this.handsetInfo.validate() && this.handsetStatus.validate()) {
            return true;
        }
        return false;
    }

    handleChange(hasChange) {
        this.setState({ hasChange });
    }

    render() {
        let { handset } = this.state;
        let linkBreadcrumb = [{
            key: RS.getString("HANDSET_LIST"),
            value: getUrlPath(URL.HANDSETS)
        }];
        return (
            <div className="page-container edit-handset-page">
                <div className="header">{RS.getString('EDIT_HANDSET')}</div>
                <Breadcrumb link={linkBreadcrumb} />
                <div className="row edit-handset">
                    <div className="col-xs-12 col-sm-4">
                        <div className="info-purchase-warning">
                            <HandsetInformation
                                ref={input => this.handsetInfo = input}
                                handset={handset}
                                handleChange={this.handleChange}
                            />
                            <PurchaseAndWarrantyHandset
                                ref={input => this.purchaseAndWarranty = input}
                                handset={handset}
                                handleChange={this.handleChange}
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-8">
                        <HandsetStatus
                            ref={input => this.handsetStatus = input}
                            handset={handset}
                            hasChange={this.state.hasChange}
                            handleChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="footer-container text-right">
                    <RaisedButton
                        label={RS.getString('CANCEL')}
                        onClick={() => browserHistory.push(getUrlPath(URL.HANDSETS))}
                        className="raised-button-fourth"
                    />
                    <RaisedButton
                        label={RS.getString('DELETE')}
                        onClick={() => this.setState({ isOpenDeleteDialog: true })}
                        className="raised-button-third"
                    />
                    <RaisedButton
                        label={RS.getString('SAVE')}
                        onClick={this.handleSave}
                        disabled={
                            _.includes([HANDSET_STATUS.LOST, HANDSET_STATUS.DISPOSED], _.get(this.state.handset, 'status'))
                            || !this.state.hasChange
                        }
                    />
                </div>
                <DialogConfirm
                    style={{ 'widthBody': '400px' }}
                    title={RS.getString('DELETE')}
                    isOpen={this.state.isOpenDeleteDialog}
                    handleSubmit={this.handleDeleteHandset}
                    handleClose={() => this.setState({ isOpenDeleteDialog: false })}
                >
                    <span>{RS.getString('CONFIRM_DELETE', ['HANDSET'], Option.FIRSTCAP)}</span>
                </DialogConfirm>
            </div>
        )
    }
}

export default EditHandset;