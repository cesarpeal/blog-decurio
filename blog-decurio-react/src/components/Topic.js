import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';
import Moment from 'react-moment'

class Topic extends Component {

	url = Global.url;

	token = localStorage.getItem("token");

	state = {
		topic: false,
		status: null
	}

	componentDidMount(){
		this.getTopic();
	}

	getTopic = () => {
		var id = this.props.match.params.id;

		axios.get(this.url + 'topic/' + id)
			 .then(res => {
			 	this.setState({
			 		topic: res.data.topic,
			 		status: 'success'
			 	});
			 }).catch(err => {
			 	this.setState({
			 		topic: false,
			 		status: 'success'
			 	});
			 });
	}

	deleteTopic = (id) => {

		var config = {
					method: 'delete',
					url: this.url+'topic/'+this.props.match.params.id,
					headers: {'Authorization': localStorage.getItem('token').replace(/['"]+/g, '')}
				};

		axios(config)
			 .then(res => {
			 	this.setState({
			 		topic: res.data.topic,
			 		status: 'deleted'
			 	});

			 });
	}

	render(){

		var topic = this.state.topic;
		return(
			<section id="content">
				{this.state.topic &&
					<article>
						<h2>{topic.title}</h2>
						<h3><Moment fromNow>{topic.updated_at}</Moment></h3>
						<img src={this.url+'topic/image/'+topic.image} alt={topic.title} />
						<p>{topic.content}</p>
						<div className="clearfix"></div>

						{topic.link &&
							<div>
								<a href={topic.link}>Link aquí</a>
								<div className="clearfix"></div>
							</div>
						}


						{this.token &&
						<div className="editdelete">
							<Link to={'/'}>
								<button onClick={
									() => {
										this.deleteTopic(topic.id)
									}
								} className="btn btn-danger">Eliminar</button>
							</Link>
							<Link to={'/editar-post/'+topic.id} className="btn btn-warning">Editar</Link>
						</div>
						}

						<div className="clearfix"></div>
					</article>
				}

				{!this.state.topic && this.state.status === 'success' &&
					<div>
						<h2>El artículo no existe</h2>
					</div>
				}

				{this.state.status == null &&
					<div>
						<h2>Cargando...</h2>
						<p>Espere un momento</p>
					</div>
				}
			</section>
			);
	}
}

export default Topic;