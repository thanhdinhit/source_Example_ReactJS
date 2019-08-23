import React from 'react';
import { browserHistory } from 'react-router';
import RS, { Option } from '../../resources/resourceManager';
import RaisedButton from '../../components/elements/RaisedButton';


const NotFoundPage = () => {
  return (
    <div className="notFound-container">
      <div className="page-row-header">
        <label className="num-four">4</label>
        <img src={require("../../images/404-icon.png")} />
        <label className="num-four">4</label>
      </div>
      <div className="page-row-content">
        <label>{RS.getString("P146")}</label>
        <label>{RS.getString("P147")}</label>
      </div>
      <div>
        <RaisedButton
          className="go-back"
          label={RS.getString('P148')}
          onClick={() => browserHistory.push(`/`)}
        />
      </div>
    </div>
  );
};

export default NotFoundPage;
