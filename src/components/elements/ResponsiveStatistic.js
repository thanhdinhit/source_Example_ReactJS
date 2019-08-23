import React, { PropTypes } from "react";
import _ from "lodash";
import TwoSideDropdown from './TwoSideDropdown';

class ResponsiveStatistic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxItems: 0,
      width: 0,
      itemsWidth: []
    };
    this.items = [];
    this.widthOffset = 100;
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  updateDimensions() {
    if (this.refs.statistics) {
      let width = this.refs.statistics.clientWidth;
      let itemsWidth = _.map(_.filter(this.items, (item) => !!item), (item) => {
        if (item) {
          return item.clientWidth > this.props.itemMinWidth ? item.clientWidth : this.props.itemMinWidth;
        }
        return 0;
      });

      if (itemsWidth.length && itemsWidth.length == this.props.items.length && !_.isEqual(this.state.itemsWidth, itemsWidth)) {
        this.setState({ width, itemsWidth });
      } else {
        itemsWidth = _.cloneDeep(this.state.itemsWidth);
      }
      let sumWidth = this.widthOffset, maxItems = 0;
      if (!itemsWidth.length || itemsWidth[0] == width) {
        maxItems = this.props.items.length;
      } else {
        _.each(itemsWidth, (item, index) => {
          if (item) {
            sumWidth += item;
            if (sumWidth > width) {
              return false;
            }
            maxItems = index + 1;
          }
        });
      }
      if (this.state.maxItems != maxItems) {
        this.setState({ maxItems });
      }
    }
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("load", this.updateDimensions);
    window.addEventListener("resize", this.updateDimensions);
  }

  componentDidUpdate() {
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("load", this.updateDimensions);
    window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    let showItems = _.take(this.props.items, this.state.maxItems);
    let moreItems = _.takeRight(this.props.items, this.props.items.length - showItems.length);
    moreItems = _.map(moreItems, (item) => {
      return {
        leftContent: item.name,
        rightContent: item.value
      };
    });
    return (
      <div className="group-stat" ref="statistics">
        {_.map(showItems, (item, index) => {
          let style = (this.state.itemsWidth && this.state.itemsWidth[index] != this.state.width ? { width: this.state.itemsWidth[index] } : {});
          return (
            <div className="cell-stat" style={style} key={index} ref={(item) => this.items[index] = item}>
              <div>
                <span>{item.value.toFixed(1)}</span>h
              </div>
              <div className="name">{item.name}</div>
            </div>
          );
        })}
        {
          moreItems.length > 0 &&
          <TwoSideDropdown
            className="stat-more"
            isRight
            label="&bull;&bull;&bull;"
            items={moreItems}
            onClick={() => {}}
          />
        }
      </div>
    );
  }
}

ResponsiveStatistic.defaultProps = {
  itemMinWidth: 100
};

export default ResponsiveStatistic;
