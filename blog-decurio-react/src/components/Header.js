import React, {Component} from 'react';
import {NavLink, Redirect} from 'react-router-dom';

class Header extends Component {

	searchRef = React.createRef();

	state = {
		search: "",
		redirect: false
	}


	redirectToSearch = (event) => {
		event.preventDefault();

		this.setState({
			search: this.searchRef.current.value,
			redirect: true
		});
	}


	render(){

		if(this.state.redirect){
			return(
				<div>
				<Header />
					<Redirect to={'/redirect/'+this.state.search} />
				</div>
			);
		}

		return(
			<header id="header">
				<div className="titulo">
					<img id="logo1" src="assets/images/cthulhu.png" />
					<h1 id="titulo">EL SUBFONDO PELÁGICO</h1>
				</div>
				<div id="subheader">
					<nav id="menu">
						<ul>
							<li><NavLink to="/">Inicio</NavLink></li>
							<li><NavLink to="/redirect/topics/2">Guías</NavLink></li>
							<li><NavLink to="/redirect/topics/1">Reviews</NavLink></li>
							<li><NavLink to="/redirect/topics/3">Mods</NavLink></li>
							<li><NavLink to="#">Info</NavLink></li>
						</ul>
					</nav>
					<div id="search">
						<form onSubmit={this.redirectToSearch}>
							<input type="text" name="search" ref={this.searchRef} />
							<input type="submit" value="L" className="icon" />
						</form>
					</div>
				</div>
				<div className="clearfix"></div>
			</header>
		);
	}
}

export default Header;