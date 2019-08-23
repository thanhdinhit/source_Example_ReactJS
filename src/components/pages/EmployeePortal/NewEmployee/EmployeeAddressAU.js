import React, { PropTypes } from 'react';
import RS, { Option } from '../../../../resources/resourceManager';
import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import CommonSelect from '../../../elements/CommonSelect.component';
import { MAX_LENGTH_INPUT } from '../../../../core/common/config';

class EmployeeAddressAU extends React.Component {
    constructor(props, context, value) {
        super(props, context);
    }
    updateContactDto(fieldName, value) {
        this.props.updateContactDto(fieldName, value);
    }
    getValue() {
        let geographic = {}
        const fields = ['street', 'postCode']
        for (let field of fields) {
            geographic[field] = this[field].getValue();
        }
        return geographic;
    }
    render() {
        let propertyItem = {
            value: 'id',
            label: 'name'
        }
        let { originContactDetail } = this.props;
        return (
            <div className="row">
                <div className="col-xs-12 col-sm-3 ">
                    <CommonTextField
                        title={RS.getString('STREET')}
                        placeholder={RS.getString('STREET')}
                        id="address"
                        defaultValue={this.props.contactDetail.street}
                        ref={(input) => this.street = input}
                        maxLength={MAX_LENGTH_INPUT.STREET}
                        onChange={(e, val) => this.updateContactDto('street', val)}
                    />
                </div>

                <div className="col-xs-12 col-sm-3 ">
                    <CommonSelect
                        title={RS.getString('CITY', null, Option.CAPEACHWORD)}
                        placeholder={RS.getString('CITY')}
                        clearable={false}
                        searchable={false}
                        name="select-location"
                        value={this.props.contactDetail.city}
                        options={this.props.cities}
                        onChange={(option) => this.updateContactDto(
                            "city",
                            option.id == _.get(originContactDetail, 'city.id', null) ? originContactDetail.city : option
                        )}
                        propertyItem={propertyItem}
                    />
                </div>
                <div className="col-xs-12 col-sm-3 ">
                    <CommonSelect
                        title={RS.getString('STATE', null, Option.CAPEACHWORD)}
                        placeholder={RS.getString('STATE')}
                        clearable={false}
                        searchable={false}
                        value={this.props.contactDetail.state}
                        options={this.props.states}
                        onChange={(option) => this.updateContactDto(
                            "state",
                            option.id == _.get(originContactDetail, 'state.id', null) ? originContactDetail.state : option
                        )}
                        propertyItem={propertyItem}
                    />
                </div>
                <div className="col-xs-12 col-sm-3 ">
                    <CommonTextField
                        title={RS.getString('POST_CODE')}
                        placeholder={RS.getString('POST_CODE')}
                        id="postCode"
                        defaultValue={this.props.contactDetail.postCode}
                        ref={(input) => this.postCode = input}
                        onChange={(e, val) => this.updateContactDto('postCode', val)}
                    />
                </div>
            </div>
        )
    }
}

EmployeeAddressAU.propTypes = {
    contactDetail: PropTypes.object,
    updateContactDto: PropTypes.func,
    states: PropTypes.array,
    cities: PropTypes.array
}

export default EmployeeAddressAU;