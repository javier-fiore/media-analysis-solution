import React, { Component } from 'react';
import Amplify, { Auth, Storage, API } from 'aws-amplify';
import { BrowserRouter as Router, Switch, Route, NavLink as RRNavLink, Link} from 'react-router-dom';
import { NavbarBrand, Navbar, Nav, NavItem, NavLink } from 'reactstrap';
import Upload from './upload';
import Browse from './browse';
import Settings from './settings';
import Live from './Live';
import Result from './result';
import nubityIcon from './../img/nubity-icon.png';
import './../styles/navbar.css';
declare var media_analysis_config;

Amplify.configure({
  Auth: {
    region: media_analysis_config.SOLUTION_REGION,
    userPoolId: media_analysis_config.SOLUTION_USERPOOLID,
    userPoolWebClientId: media_analysis_config.SOLUTION_USERPOOLWEBCLIENTID,
    identityPoolId: media_analysis_config.SOLUTION_IDENTITYPOOLID
  },
  Storage: {
        bucket: media_analysis_config.SOLUTION_BUCKET,
        region: media_analysis_config.SOLUTION_REGION,
        identityPoolId: media_analysis_config.SOLUTION_IDENTITYPOOLID
    },
  API: {
      endpoints: [
        {
            name: "MediaAnalysisApi",
            region: media_analysis_config.SOLUTION_REGION,
            endpoint: media_analysis_config.SOLUTION_ENDPOINT
        }
      ]
  }
});

class App extends Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <Router>
          <div>
            <Navbar color="dark">
              <NavbarBrand tag={Link} to="/">
                <img alt="Media Analysis Solution" src={nubityIcon} className="brand-image"  />
                <span className="ml-2 text-white">Nubity media solution</span>
              </NavbarBrand>
              <Nav className="ml-auto">
                <NavItem>
                  <NavLink tag={RRNavLink} to="/live" className="text-light" activeClassName="active">Live</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/" className="text-light" activeClassName="active" exact>Media</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/collection" className="text-light" activeClassName="active">Collection</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/settings" className="text-light" activeClassName="active">Settings</NavLink>
                </NavItem>
              </Nav>
            </Navbar>
            <hr />
            <Switch>
                <Route exact path='/' component={Browse} />
                <Route path='/collection' component={Upload} />
                <Route path='/Live' component={Live} />
                <Route path='/settings' component={Settings} />
                <Route path='/result/:objectid' component={Result} />
            </Switch>
          </div>
        </Router>
        <hr />
      </div>
    );
  }
}

export default App;
