import React, { PropTypes } from "react";
import _ from "lodash";

class TwoSideDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        show: false
    };
  }

  handleClickItem(item, index) {
    if (item) {
      this.setState({ selectedIndex: index });
      this.props.onClick && this.props.onClick(item.id);
    }
  }

  render() {
    let className = this.props.isRight ? ' pull-right' : '';
    return (
      <div className={"btn-group dropup " + this.props.className}>
        {this.props.button || (
          <button
            className="btn btn-default dropdown-toggle"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {this.props.label || ""}
          </button>
        )}
        <ul className={"dropdown-menu " + className}>
          {_.map(this.props.items, (item, index) => {
            return (
              <li
                className={this.state.selectedId === index ? "active" : ""}
                key={index}
                onClick={this.handleClickItem.bind(this, item, index)}
              >
                <a>
                  <span className="left">{item.leftContent}</span>
                  <span className="right">{item.rightContent}</span>
                </a>
              </li>
            );
          })}
        </ul>
        <div className={"arrow-down " + (this.props.sortList || "")} />
      </div>
    );
  }
}

export default TwoSideDropdown;
