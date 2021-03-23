import React, {Component} from 'react';

class Register extends Component{
	render(){
		return(
			<section id="content">
				<h1 className="subheader">REGISTRO</h1>

				<form className="mid-form">
					<div className="registro">
						<label for="nickname">Nickname</label>
						<input type="text" name="nickname" />
					</div>

					<div className="registro">
						<label for="email">Correo electrónico</label>
						<input type="email" name="email" />
					</div>

					<div className="registro">
						<label for="password">Contraseña</label>
						<input type="password" name="email" />
					</div>

					<div className="registro">
						<label for="repeat-pass">Repetir contraseña</label>
						<input type="password" name="repeat-pass" />
					</div>

					<div className="clearfix"></div>

					<input type="submit" value="Registrarse" className="btn btn-success" />
				</form>
			</section>
		);
	}
}

export default Register;