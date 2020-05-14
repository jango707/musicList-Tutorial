import React from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

const renderLogin = () => (
  <Nav className="ml-auto" navbar>
    <NavItem>
      <NavLink tag={Link} to="/account/login">Log In</NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={Link} to="/account/register">Register</NavLink>
    </NavItem>
  </Nav>
);

export default class Header extends React.Component {
constructor(props){
	super(props);

	this.logOutClick = this.logOutClick.bind(this);
    this.renderGreeting = this.renderGreeting.bind(this);
	this.toggleNavbar = this.toggleNavbar.bind(this);

	this.state = {
		isOpen: false,
	};
}

logOutClick(e) {
	e.preventDefault();
	const { logUserOutFunction } = this.props;
	logUserOutFunction();
}

toggleNavbar() {
	this.setState({
		isOpen: !this.state.isOpen,
	});
}

renderGreeting(name) {
	return(
		 <span>
        	Welcome, {name} | <a href="/logout" onClick={this.logOutClick}>Log Out</a>
      	 </span>
	);
}


render() {
	const { isLoggedIn, firstName } = this.props.authentication;
	return(
		<header className="wrapper">
			<Navbar bg="light" color="light" light toggleable expand="md" >
				 <NavbarToggler onClick={this.toggleNavbar} />
				 <NavbarBrand  tag={Link} to="/" >Music List</NavbarBrand>
				 <Collapse  isOpen={this.state.isOpen} navbar>
				 	{ isLoggedIn ? this.renderGreeting(firstName) : renderLogin() }
				 </Collapse>
			</Navbar>
		</header>
	);
  }
}

/*
export default function Header(props) {
	const { username } = props;
	return(
		<header>
			<h1>MusicList</h1>
			<div className="user-menu">
				<h2>Welcome { username }</h2>
				<nav>
					<ul>
						<li><Link to="/">Home</Link></li>
						<li><Link to="/account/profile/jango">Profile</Link></li>
					</ul>
				</nav>	
			</div>
		</header>
	);
}
**/

