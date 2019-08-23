import React from 'react';
import _ from 'lodash'
const defaultStyle ={
     margin: 'auto', position: 'absolute', top: "25%", left: "25%", right: "25%", bottom: "25%", overflow: 'hidden' 
}
var Preloader = React.createClass({
    render: function () {
        let color = "spinner-"+this.props.color + "-only";
        return (
            <div style={_.assign({},defaultStyle, this.props.style)} className="preloader-wrapper small active">
                <div className={"spinner-layer "+color}>
                    <div className="circle-clipper left">
                        <div className="circle"></div>
                    </div><div className="gap-patch">
                        <div className="circle"></div>
                    </div><div className="circle-clipper right">
                        <div className="circle"></div>
                    </div>
                </div>
            </div>
        );

    }
});
export default Preloader;