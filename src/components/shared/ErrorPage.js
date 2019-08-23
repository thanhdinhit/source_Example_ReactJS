import React from 'react';
import { Link } from 'react-router';

const NotFoundPage = () => {
  return (
    <div className="container">
      <div className="section">
        <div className="row">
        <img src ={require("../../images/error.jpg")}/>
          <h4>
            Something went wrong
          </h4>
          <Link to="/"> Go back to homepage </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
