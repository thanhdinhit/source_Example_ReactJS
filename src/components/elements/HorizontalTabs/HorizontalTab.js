import React, { PropTypes } from 'react';
import DropdownButton from '../../elements/DropdownButton';
import RS from '../../../resources/resourceManager';
import _ from 'lodash';

class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = { curTab: '' };
        this.handleChangeTab = this.handleChangeTab.bind(this);
        this.renderTabsIndex = this.renderTabsIndex.bind(this);
        this.renderMoreTabs = this.renderMoreTabs.bind(this);
        this.handleOnClickMoreTab = this.handleOnClickMoreTab.bind(this);
    }

    componentWillMount() {
        this.setState({ curTab: this.props.curTab });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ curTab: nextProps.curTab });
    }

    handleChangeTab(tab, event) {
        if (this.props.hold) {
            _.delay(function () {
                $("#tab" + tab).removeClass("active")
                $("#tab" + this.state.curTab).addClass("active")
            }.bind(this), 0)
        }
        else {
            this.setState({ curTab: tab });
        }
        this.props.handleChangeTab && this.props.handleChangeTab(tab);
    }

    handleOnClickMoreTab() {
        $('#moreTab').removeClass('active');
        $($('#moreTab').siblings()[this.state.curTab]).addClass('active');
    }

    renderTabsIndex() {
        let self = this;

        return this.props.tabs.map(function (tab, index) {
            return (
                <li
                    id={"tab" + tab.value}
                    className={self.state.curTab === tab.value ? 'active' : ''}
                    onClick={self.handleChangeTab.bind(this, tab.value)}
                    key={index}
                >
                    <a data-toggle="tab">
                        {
                            tab.icon &&
                            <i className={tab.icon} />
                        }
                        {/* <img src={require("../../../images/" + tab.img)} /> */}
                        <span>{tab.label}</span>
                    </a>
                </li>
            );
        });
    }

    renderMoreTabs() {
        if (!this.props.more) return;

        const self = this;
        let cloneMoreTabs = _.cloneDeep(this.props.more);
        let activatedTab;
        let hasActivated = cloneMoreTabs.some(function (tab, index) {
            if (tab.value === self.state.curTab) {
                cloneMoreTabs.splice(index, 1);
                activatedTab = tab;
                return true;
            }
        });
        const listDropDownTab = cloneMoreTabs.map(function (tab) {
            return {
                id: tab.value,
                name: tab.label,
                icon: (
                    <i className={tab.icon + " icon-in-more"}></i>
                )
            };
        });

        if (hasActivated) {
            return (
                <li className="active tab-more-active">
                    <DropdownButton
                        button={
                            <div className="columnName" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <a data-toggle="tab">
                                    <i className={activatedTab.icon + " icon-in-tab"}></i>
                                    <span>{activatedTab.label}</span>
                                    <i className="drown-arrow icon-dropdown-arrow"></i>
                                </a>
                            </div>
                        }
                        isRight
                        label=""
                        listActions={listDropDownTab}
                        onClick={this.handleChangeTab}
                    />
                </li>
            );
        }
        return (
            <li id="moreTab" className="tab-more">
                <DropdownButton
                    button={
                        <div className="columnName" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <a>
                                <span onClick={this.handleOnClickMoreTab}>
                                    {RS.getString('MORE')}
                                    <i className="drown-arrow icon-dropdown-arrow"></i>
                                </span>
                            </a>
                        </div>
                    }
                    isRight
                    label=""
                    listActions={listDropDownTab}
                    onClick={this.handleChangeTab}
                />
            </li>
        );
    }

    render() {
        return (
            <div className="tab-position">
                <div className={"tabs " + this.props.className || ''}>
                    <ul className="nav nav-tabs">
                        {this.renderTabsIndex()}
                        {this.renderMoreTabs()}
                    </ul>
                </div>
            </div>
        );
    }
}

Tabs.propTypes = {
    tabs: PropTypes.array,
    more: PropTypes.array,
    handleChangeTab: PropTypes.func,
    className: PropTypes.string,
    curTab: PropTypes.number,
    hold: PropTypes.bool
};

export default Tabs;