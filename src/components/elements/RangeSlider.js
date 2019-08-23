
const styles = {
  app: {
    width: '400px',
    margin: '0 auto'
  },

  container: {
    position: 'relative',
    width: '100%',
    height: '24px',
    padding: '35px 0 10px 0',
    cursor: 'default'
  },

  slideBar: {
    width: '100%',
    height: '4px',
    backgroundColor: 'rgb(125, 122, 122)',
    boxShadow: '0px 0px 2px 0px rgba(0, 0, 0, 0.74)',
    borderRadius: '4px',
    position: 'absolute'
  },

  slideBarFill: {
    backgroundColor: 'rgb(216, 216, 216)',
    boxShadow: 'none',
    width: '60%',
    transition: 'width 0.1s ease-in-out'
  },

  labelContainer: {
        width: '100%'
    },

    maxLabel: {
        display: 'inline-block',
        float: 'right',
        userSelect: 'none'
    },

    valuePopUp: {
        position: 'absolute',
        top: 0,
        transition: 'opacity 0.15s ease-in-out',
        backgroundColor: 'rgb(24, 24, 24)',
        borderRadius: '4px',
        padding: '5px',
        border: '1px solid rgb(69, 68, 68)'
    }
};


class _RangeSlider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            fillWidth: ((this.props.value - this.props.min)/(this.props.max - this.props.min) * 100),
            value: this.props.value,
            mouseX: 0,
            mouseDown: false
        }
    }

    static propTypes = {

        min: React.PropTypes.number.isRequired,
        max: React.PropTypes.number.isRequired,
        value: React.PropTypes.number.isRequired,
        onChange: React.PropTypes.func,
        type: React.PropTypes.string

    };

    static defaultProps = {
        type: 'float'
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            fillWidth: ((nextProps.value - nextProps.min)/(nextProps.max - nextProps.min) * 100),
            value: nextProps.value
        });
    }

    handleClick(e) {

        let rect = this.refs.container.getBoundingClientRect();
        let percentage = (e.pageX - rect.left) / rect.width;

        if (this.props.type == 'float') {

            let value = this.props.min + percentage * this.props.max;

            this.setState({
                fillWidth: percentage * 100,
                value: value,
                mouseX: rect.left + (e.pageX - rect.left)
            });

            if (this.props.onChange)
            {
                this.props.onChange(value);
            }

        }
        else {

            let value = Math.round( this.props.min + percentage * this.props.max );

            let intPercentage = (value/(this.props.max - this.props.min)) * 100;

            this.setState({
                fillWidth: intPercentage,
                value: value,
                mouseX: rect.left + (e.pageX - rect.left)
            });

            if (this.props.onChange)
            {
                this.props.onChange(value);
            }

        }

    }

    handleMouseDown() {
        this.setState({
           mouseDown: true
        });
    }

    handleMouseUp() {
        this.setState({
            mouseDown: false
        });
    }

    handleMouseMove(e) {
        if (this.state.mouseDown)
        {
            this.handleClick(e);
        }
    }

    handleMouseLeave(e) {
        if (this.state.mouseDown)
        {
            this.handleClick(e);
            this.setState({
                mouseDown: false
            });
        }
    }

    render() {
        return (
            <div>
                <div style={[styles.container]}
                     ref="container"
                     onClick={this.handleClick.bind(this)}
                     onMouseUp={this.handleMouseUp.bind(this)}
                     onMouseMove={this.handleMouseMove.bind(this)}
                     onMouseLeave={this.handleMouseLeave.bind(this)}
                     onMouseDown={this.handleMouseDown.bind(this)}>
                    <div style={[styles.slideBar]}></div>
                    <div style={[styles.slideBar, styles.slideBarFill, {width: this.state.fillWidth + '%'}]}></div>
                </div>
                <div style={[styles.labelContainer]}>
                    <span style={{userSelect: 'none'}}>{this.props.min}</span>
                    <span style={[styles.maxLabel]}>{this.props.max}</span>
                </div>
                <div style={ [
                    styles.valuePopUp,
                    this.state.mouseDown ? {opacity: '1'} : {opacity: '0'},
                    {left: (this.state.mouseX - 15) + 'px'}
                ]}>
                    {Number(this.state.value.toFixed(2))}
                </div>
            </div>
        );
    };

}
const RangeSlider = Radium(_RangeSlider);

const _App = () =>
  <div style={[styles.app]}>
    <RangeSlider min={0} max={10} value={0} type={'int'} />
  </div>;

const App = Radium(_App);


ReactDOM.render(<App />, document.getElementById('renderTarget'));