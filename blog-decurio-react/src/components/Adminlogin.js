import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';
import qs from 'qs';

class Adminlogin extends Component{
	url = Global.url;

	emailRef = React.createRef();
	passRef = React.createRef();


	state = {
		user: {
		},
		status: null
	}
	
	changeState = () => {
		this.setState({
			user: {
				email: this.emailRef.current.value,
				password: this.passRef.current.value
			}
		});
		this.forceUpdate();
		console.log(this.state);
	}

	recibirFormulario = (e) => {
		e.preventDefault();

		this.changeState();

		var data = qs.stringify({
			'json': '{"email":"'+this.state.user.email+'", "password":"'+ this.state.user.password+'", "password":"'+ this.state.user.password+'"}' 
		});

		var config = {
			method: 'post',
			url: this.url+'login',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: data
		};
		
		axios(config)
			 .then(res => {
				if(this.state.user){
				this.setState({
					status: 'success'
				});
					this.state.user.getToken = res.data;

				
				
				
				localStorage.setItem('token', JSON.stringify(this.state.user.getToken));
				} else {
					this.setState({
						status: 'failed'
					});
				}
			});
			 console.log(this.state.user);
	}



	render(){

		if(this.state.status === 'success'){
			return <Redirect to="/" />
		}

		return(
			<section id="content">
				<h1 className="subheader">Admin</h1>

				<form className="mid-form" onSubmit={this.recibirFormulario}>
					<div className="registro">
						<label htmlFor="email">Correo electrónico</label>
						<input type="email" name="email" ref={this.emailRef} onChange={this.changeState} />
					</div>

					<div className="registro">
						<label htmlFor="password">Contraseña</label>
						<input type="password" name="password" ref={this.passRef} onChange={this.changeState} />
					</div>

					<div className="clearfix"></div>

					<input type="submit" value="Entrar" className="btn btn-success" />
				</form>
			</section>
		);
	}
}

export default Adminlogin;