import React, { Component } from 'react';
import { Router } from '../routes';

class Logout extends Component {

	componentDidMount(){
		localStorage.removeItem('token');
	}

	render() {
		Router.push('/');
		return (null);
	}
}

export default Logout;