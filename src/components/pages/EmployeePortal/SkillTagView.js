import React, { PropTypes } from 'react';
import RS from '../../../resources/resourceManager';
import { getExtension, getName } from '../../../utils/iconUtils';
import dateHelper from '../../../utils/dateHelper';
import _ from 'lodash';
import { TIMEFORMAT } from '../../../core/common/constants';

const SkillTagView = React.createClass({
    propTypes: {
        skill: PropTypes.object,
    },

    renderCertificates: function () {
        let rs = [];
        if (this.props.skill.certificates && this.props.skill.certificates.length > 0)
            this.props.skill.certificates.forEach(function (certificate, index) {
                let status = dateHelper.formatExpiredDate(certificate.expiredDate);

                switch (status) {
                    case 'Nearly_Expired':
                        status = 'nearly-expired';
                        break;
                    case 'Expired':
                        status = 'expired';
                        break;
                };

                rs.push(
                    <tr key={index} className="certificate-view">
                        <td className="td-icon">
                            <img src={require('../../../images/svg/' + getExtension(certificate.url))} />
                        </td>
                        <td className="td-name">
                            <div>
                                <a href={API_FILE + certificate.url} target="_blank">
                                    <span>{getName(certificate.url)}</span>
                                </a>
                                <div className="td-expiredDate">
                                    {
                                        certificate.expiredDate ?
                                            <div>
                                                {
                                                    status == '' ?
                                                        <span>
                                                            {RS.getString('REMIND')}&nbsp;
                                                    <span className="status-expiredDate">
                                                                {RS.getString('MONTH_VALUE', (certificate.monthsNotify || this.props.defaultMonthNotify))}
                                                            </span>&nbsp;
                                                    {RS.getString('BEFORE_EXPIRY_DATE')}
                                                            <span className="status-expiredDate">
                                                                {dateHelper.formatTimeWithPattern(certificate.expiredDate, TIMEFORMAT.END_START_TIME)}
                                                            </span>
                                                        </span> :
                                                        <span className={status}>
                                                            {RS.getString((dateHelper.formatExpiredDate(certificate.expiredDate)).toUpperCase())}
                                                        </span>
                                                }
                                            </div> : ''
                                    }
                                </div>
                            </div>
                        </td>
                    </tr>);
            }, this);
        return rs;
    },
    render: function () {
        if (!this.props.skill) return null;
        let hasBorderBottom = ( _.get(this.props.skill,"note") || _.get(this.props.skill,"certificates.length")
          ) ? ' has-border-bottom' : '';
        return (
            <div className="border-box-content">
                <div className={"border-box-header" + hasBorderBottom}>
                    <div className="title title-optional">{this.props.skill.jobSkill ? this.props.skill.jobSkill.name : ""}</div>
                </div>
                {
                    this.props.skill && this.props.skill.certificates && this.props.skill.certificates.length ?
                        <div className="table-container view">
                            <table>
                                <tbody>
                                    {this.renderCertificates()}
                                </tbody>
                            </table>
                        </div> : ''
                }
                {
                    (this.props.skill && this.props.skill.note != '' && this.props.skill.note != null) ?
                        <div className="table-container view">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="note-action">
                                                <div className="title-note">{RS.getString('NOTE')}</div>
                                                <div className="reason-note">{this.props.skill.note}</div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> : ''
                }
            </div>
        );
    }
});

export default SkillTagView;