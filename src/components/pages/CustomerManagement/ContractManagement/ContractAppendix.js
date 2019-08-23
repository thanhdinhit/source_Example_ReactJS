import React, { PropTypes } from 'react';
import _ from 'lodash';
import { browserHistory } from 'react-router';
import RS, { Option } from '../../../../resources/resourceManager';
import { CONTRACT_RATE_TYPE, DATE } from '../../../../core/common/constants';
import { getUrlPath } from '../../../../core/utils/RoutesUtils';
import { API, URL } from '../../../../core/common/app.routes';
import RIGHTS from '../../../../constants/rights';
import Breadcrumb from '../../../elements/Breadcrumb';
import ViewContract from './ViewContract';
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';
import LoadingIndicator from '../../../elements/LoadingIndicator/LoadingIndicator';
import { LOADING_INDICATOR } from '../../../../core/common/constants';
import { LOADING_INDICATOR_STYLE } from '../../../../core/common/config';
import * as toastr from '../../../../utils/toastr';
import * as contractActions from '../../../../actionsv2/contractActions';
import CommonSelect from '../../../elements/CommonSelect.component';
import dateHelper from '../../../../utils/dateHelper';

class ContractDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            contract: {
                customer: {},
                identifier: '',
                group: {},
                rateType: CONTRACT_RATE_TYPE.PER_MONTH,
                ratePrice: 0,
                startDate: undefined,
                endDate: undefined,
                status: undefined,
                attachments: [],
                links: [],
                schedules: []
            },
            appendixId: this.props.params.appendixId
        };
        this.handleLoadContractCallBackAction = this.handleLoadContractCallBackAction.bind(this)
        this.handleChangeAppendix = this.handleChangeAppendix.bind(this)
    }

    componentDidMount() {
        if (this.props.curEmp.rights.find(x => x === RIGHTS.VIEW_CONTRACT)) {
            let contractId = Number(this.props.params.contractId)
            if (!contractId) {
                browserHistory.replace(`/page_not_found`)
            }
            let appendixId = Number(this.props.params.appendixId)
            if (!appendixId) {
                browserHistory.replace(`/page_not_found`)
            }
            else {
                this.state.appendixId = appendixId;
            }
            LoadingIndicatorActions.showElementLoadingIndicator();
            setTimeout(() => {
                contractActions.loadContractDetail(contractId, (err, result) => { this.handleLoadContractCallBackAction(err, result) });
                contractActions.loadContractSchedules(contractId, appendixId, (err, result) => { this.handleLoadContractCallBackAction(err, result, ['schedules', 'flexibleSchedules']) });
                contractActions.loadContractAppendix(contractId, (err, result) => {
                    result = this.handleCookAppendixOptions(result)
                    this.handleLoadContractCallBackAction(err, { appendix: result }, ['appendix'])
                })
            }, 0);
        }
    }



    handleLoadContractCallBackAction(err, result, fields) {
        LoadingIndicatorActions.hideElementLoadingIndicator();
        if (err) {
            toastr.error(err.message, RS.getString('ERROR'))
        }
        else {
            if (fields) {
                fields.forEach(field => {
                    if (field == 'schedules' || field == 'flexibleSchedules') {
                        result[field].forEach(item => {
                            contractActions.loadContractSchedulesShift(item.contractId, item.id, this.state.appendixId, (err, shifts) => {
                                if (err) {
                                    toastr.error(err.message, RS.getString('ERROR'));
                                }
                                else if (shifts.length) {
                                    let items = _.cloneDeep(this.state.contract[field])
                                    let indexItem = _.findIndex(items, x => x.id == item.id);
                                    items[indexItem].shifts = shifts;
                                    this.setState({
                                        contract: {
                                            ...this.state.contract,
                                            [field]: items
                                        }
                                    });
                                }
                            });
                        });
                    }
                    this.state.contract[field] = result[field];
                });
                this.setState({
                    contract: this.state.contract
                });
            } else {
                this.setState({
                    contract: {
                        ...this.state.contract,
                        ...result
                    }
                });
            }
        }
    }

    handleCookAppendixOptions(options) {
        options.forEach(element => {
            element.dateString = dateHelper.formatTimeWithPattern(element.effectedDate, DATE.FORMAT)
        });
        return options;
    }

    handleChangeAppendix(value) {
        contractActions.loadContractSchedules(this.state.contract.id, value.id, (err, result) => { this.handleLoadContractCallBackAction(err, result, ['schedules', 'flexibleSchedules']) });
        browserHistory.replace(getUrlPath(URL.CONTRACT_APPENDIX, { contractId: this.state.contract.id, appendixId: value.id }))
    }

    renderValueComponent(value) {
        return (
            <div className="Select-value">
                <span className="Select-value-label" role="option" aria-selected="true" >
                    <span > {RS.getString('EFFECTIVE_DATE')} (</span>
                    {value.value.dateString})
            </span>
            </div>
        )
    }
    render() {
        let linkBreadcrumb = [{
            key: RS.getString("CONTRACTS"),
            value: getUrlPath(URL.CONTRACTS)
        }, {
            key: this.state.contract.identifier,
            value: getUrlPath(URL.CONTRACT, { contractId: this.state.contract.id })
        }];
        return (
            <div className="page-container new-contract contract-detail">
                <div className="header">
                    {RS.getString("APPENDIX")}
                    <div className="select-appendix">
                        Appendix
                        <CommonSelect
                            clearable={false}
                            searchable={false}
                            name="select-appendix"
                            value={this.state.appendixId}
                            propertyItem={{ label: 'dateString', value: 'id' }}
                            options={_.get(this.state, 'contract.appendix')}
                            valueComponent={this.renderValueComponent}
                            onChange={this.handleChangeAppendix}
                        />
                    </div>

                </div>
                <Breadcrumb link={linkBreadcrumb} />
                <ViewContract
                    {...this.props}
                    contract={this.state.contract}
                />
                <LoadingIndicator
                    containerId={LOADING_INDICATOR.ELEMENT_LOADING_INDICATOR}
                    config={LOADING_INDICATOR_STYLE.app}
                />
            </div>
        );
    }
}

ContractDetail.propTypes = {
}

export default ContractDetail;