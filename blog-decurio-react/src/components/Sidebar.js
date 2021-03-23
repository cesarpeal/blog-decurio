import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

class Sidebar extends Component {

	token = localStorage.getItem('token');

	render(){

		return(
			<aside id="lateral">
			{/*
				<h3>LOGIN</h3>
				<div id="login" className="aside-box">
					<form>
						<label id="user" className="icon">U</label>
						<input type="email" />

						<label id="password" className="icon">w</label>
						<input type="password" />

						<input type="submit"value="Entrar" />
						<input type="Reset" value="Limpiar" />

						<NavLink to="/registro">Regístrate aquí</NavLink>
						<NavLink to="/registro">Contraseña olvidada</NavLink>
					</form> 
				</div>	*/}
				<div className="clearfix"></div>
				{this.token &&
					<div id="nav-blog" className="sidebar-item">
						<NavLink to="/crear-post" className="btn btn-success">Crear artículo</NavLink>
					</div>
				}
				<div className="clearfix"></div>
			</aside>
		);
	}

}

export default Sidebar;