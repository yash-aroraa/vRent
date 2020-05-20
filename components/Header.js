import React, { Component } from 'react';
import { Menu, Segment } from 'semantic-ui-react';
import { Link } from '../routes';

class Header extends Component {
  state = {
    login: false
  }
  componentDidMount() {
    if(localStorage.getItem('token')) {
      this.setState({login: true});
    }
  }
  render() {
    const path = this.state.login ? "/rents/new" : "/auth"
    let auth = ( 
        <Link route="/auth?new=false">
          <a className="item">Authenticate</a>
        </Link>);
    if(this.state.login) {
      auth = (
        <Link route="/logout">
          <a className="item">Logout</a>
        </Link>
      )
    }
    return (
      <Menu style={{ marginTop: '10px' }} inverted>

      <Link route="/">
        <a className="item">vRent</a>
      </Link>

      <Menu.Menu position="right">
        <Link route={path}>
          <a className="item">+</a>
        </Link>

        <Link route="/">
          <a className="item" color="blue">Registered Vehicles' List</a>
        </Link>

        {auth}
      </Menu.Menu>
    </Menu>
    )
  }
}

export default Header;
