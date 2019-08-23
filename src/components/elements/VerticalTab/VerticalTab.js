import React, { PropTypes } from 'react';

export default React.createClass({
    propTypes: {
        children: PropTypes.array,
        onChange: PropTypes.func,
        valueSelected: PropTypes.string,
        isOpenMenu: PropTypes.bool,
        toggle: PropTypes.bool
    },

    render: function () {
        const childs = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                valueSelected: this.props.valueSelected,
                handleClick: this.props.onChange,
                isOpenMenu: this.props.isOpenMenu
            })
        );

        return (
            <div className={this.props.isOpenMenu ? 'my-tab open' : 'my-tab'}>
                <ul>
                    {childs}
                </ul>
            </div>
        );
    }
});