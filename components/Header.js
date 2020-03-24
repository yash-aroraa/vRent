import React from 'react';
import { Menu, Segment } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }} inverted>
      <Link route="/">
        <a className="item">Rental System</a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/">
          <a className="item" color="blue">Registered Vehicles' List</a>
        </Link>

        <Link route="/rents/new">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
