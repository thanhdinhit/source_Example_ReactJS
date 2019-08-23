import React from 'react';
import { browserHistory } from 'react-router';
import RS from '../../resources/resourceManager';
import RaisedButton from '../../components/elements/RaisedButton';


const NotPermissionPage = () => {
  return (
    <div className="notFound-container">
      <div className="page-row-header">
        <img src={require("../../images/restrict-icon.png")} />
      </div>
      <div className="page-row-content">
        <label>{RS.getString("P149")}</label>
        <label>{RS.getString("P150")}</label>
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

export default NotPermissionPage;
