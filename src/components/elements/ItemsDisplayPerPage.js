import React from 'react';
import RS from '../../resources/resourceManager';
import Select from './Select/Select';

const ItemsDisplayPerPage = React.createClass({
  // Add the Formsy Mixin

  getInitialState: function () {
    return { value: 0 }
  },
  onChange: function (item) {
    this.setState({ value: item.value })
    this.props.onChange(item.value)
  },
  componentWillMount: function () {
    if (this.props.value)
      this.state.value = this.props.value
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.value)
      this.setState({ value: nextProps.value });
  },
  render() {

    const items = [];
    for (let i = 1; i <= 10; i++) {
      items.push({ value: (i * 5), label: (i * 5), key: i });
    }
    const styles = {
      inline: {
        display: "inline"
      },
      CustomWidth: {
        width: 50,
      }
    };

    return (
      <div className="page-size">
        <div>{RS.getString('DISPLAY')}</div>

        <div className="page-size-selector">
          <Select
            tabIndex="6"
            placeholder={RS.getString('SELECT')}
            //style={{ marginTop: '-4px', marginBottom: '24px' }}
            clearable={false}
            searchable={false}
            name={this.props.name}
            value={this.state.value || 5}
            options={items}
            onChange={this.onChange}
          />
        </div>
        <div>{RS.getString('ENTRIES_PER_PAGE', this.props.totalRecord)}</div>
      </div>
    );
  }
});

export default ItemsDisplayPerPage;

