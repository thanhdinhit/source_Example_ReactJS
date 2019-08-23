import React, { PropTypes } from 'react';
import Overlay from 'react-bootstrap/lib/Overlay';
import ReactDOM from 'react-dom';

const propTypes = {

}

class ContentBox extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className={"custom-overlay " + this.props.className}>
                <div className="arrow" />
                {this.props.children}
            </div>
        )
    }
}


class CustomPopover extends React.Component {
    constructor(props) {
        super(props)
        this.PLACEMENT = {
            TOP:"top",
            BOTTOM: "bottom",
            LEFT: "left",
            RIGHT: "right"
        };
        this.state = {
            isOpen: this.props.isOpen,
            placement: this.PLACEMENT.TOP
        }

        this.hide = this.hide.bind(this);
        this.calcPosition = this.calcPosition.bind(this);
    }
    hide() {
        if (this.props.onHide) {
            this.props.onHide();
        } else {
            this.setState({ isOpen: false, placement: this.PLACEMENT.TOP });
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.isOpen != nextProps.isOpen) {
            if (nextProps.isOpen) {
                this.setState({ isOpen: true }, () => this.contentBox && this.calcPosition(nextProps.container));
            } else {
                this.setState({ isOpen: false, placement: this.PLACEMENT.TOP });
            }
        }
    }
    calcPosition(parent) {
        let parentBox = ReactDOM.findDOMNode(parent).getBoundingClientRect();
        let contentBox = ReactDOM.findDOMNode(this.contentBox).getBoundingClientRect();
        if (contentBox.top < 60) {
            this.setState({placement: this.PLACEMENT.BOTTOM})
        }
        // if(contentBox.bot > $(window).height()){
        //     this.setState({placement: this.PLACEMENT.TOP})
        // }
        if(contentBox.left < 53){
            this.setState({placement: this.PLACEMENT.RIGHT})
        }
        if(contentBox.right > window.innerWidth){
            this.setState({placement: this.PLACEMENT.LEFT})
        }

    }
    render() {
        return (
            this.state.isOpen ?
                <Overlay
                    animation={false}
                    rootClose
                    show={this.state.isOpen}
                    container={this.props.container}
                    onHide={this.hide}
                    target={() => ReactDOM.findDOMNode(this.props.container)}
                >
                    <ContentBox
                        className = {this.state.placement}
                        ref={(contentBox) => this.contentBox = contentBox}
                    >
                        {this.props.children}
                    </ContentBox>
                </Overlay> : null
        )
    }
}

CustomPopover.propTypes = propTypes;

export default CustomPopover;