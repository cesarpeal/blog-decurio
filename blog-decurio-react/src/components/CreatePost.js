import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';
import qs from 'qs';

class CreatePost extends Component{



	url = Global.url;

	titleRef = React.createRef();
	descriptionRef = React.createRef();
	contentRef = React.createRef();
	category_idRef = React.createRef();
	game_idRef = React.createRef();
	imageRef = React.createRef();
	linkRef = React.createRef();

	state = {
		topic: {},
		games: {},
		status: null,
		submitted: null,
		selectedFile: null
	}

	componentDidMount (){
		this.getGames();
	}


	getGames = () => {
		axios.get(this.url+"game")
			 .then(res => {
			 	this.setState({
			 		games: res.data.games,
			 		status: 'success'
			 	});
			 });
	}
	
	changeState = () => {
		this.setState({
			topic: {
				title: this.titleRef.current.value,
				category_id: parseInt(this.category_idRef.current.value),
				game_id: parseInt(this.game_idRef.current.value),
				content: this.contentRef.current.value,
				description: this.descriptionRef.current.value,
				image: null,
				link: this.linkRef.current.value
			}
		});
		this.forceUpdate();
	}

	recibirFormulario = (e) => {
		e.preventDefault();

		this.changeState();



		if(this.state.selectedFile !== null){
			 		const formData = new FormData();

			 		formData.append(
			 			'file0',
			 			this.state.selectedFile,
			 			this.state.selectedFile.name
			 		);


			 		var ifconfig = {
						method: 'post',
						url: this.url+'topic/upload',
						headers: { 'Authorization': localStorage.getItem('token').replace(/['"]+/g, '')},
						data: formData
					};

			 		axios(ifconfig)
			 				 .then(res => {
			 				 	if(res.data){
			 				 		this.setState({
			 				 			topic: this.state.topic,
			 				 			status: 'success'
			 				 		});

			 		var data = qs.stringify({
					'json': '{"title":"'+this.state.topic.title+'", "content":"'+this.state.topic.content+'", "category_id":"'+this.state.topic.category_id+'", "game_id":"'+this.state.topic.game_id+'", "image":"'+res.data.image+'", "description":"'+this.state.topic.description+'", "link":"'+this.state.topic.link+'"}'});

					var config = {
						method: 'post',
						url: this.url+'topic',
						headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.getItem('token').replace(/['"]+/g, '')},
						data: data
					};
					
					axios(config)
						 .then(res => {
							if(this.state.topic){
							this.setState({
								topic: this.state.topic,
								status: 'success'
							});
						 	
						 	
						}else{
							this.setState({
								status: 'error'
							});
							
						}
					});
						 this.forceUpdate();

			 				 		} else {
			 				 		this.setState({
			 				 			status: 'failed'
			 				 		});
			 				 	}

			 				 });
			 				 this.forceUpdate();
			 		} else {
			 			this.setState({
			 				status: 'success'
			 			});
			 		}	 		
			this.state.submitted = "Done";	
		}
	

	fileChange = (event) => {
		this.setState({
		selectedFile: event.target.files[0]
		});
		this.forceUpdate();
	}


	render(){

		if(this.state.games.length >= 1 && this.state.status === 'success'){
			var Games = this.state.games.map((game) => {
				return (
						<option value={game.id}>{game.name}</option>
						);
				});
		}

		if(this.state.submitted === 'Done'){
			return <Redirect to="/" />
		}
			return(
				<section id="content">
					<h2 id="subtitle">Crear post</h2>
					<form className="mid-form" onSubmit={this.recibirFormulario}>
						<div className="registro">
							<label htmlFor="title">Titulo</label>
							<input type="text" name="title" ref={this.titleRef} onChange={this.changeState} />
						</div>
						<div className="registro">
							<label htmlFor="game_id">Juego</label>
							<div className="clearfix"></div>
							<select name="game_id" ref={this.game_idRef} onChange={this.changeState}>
								{Games}
							</select>
						</div>
						<div className="clearfix"></div>
						<div className="registro">
							<label htmlFor="category_id">Categoría</label>
							<div className="clearfix"></div>
							<select name="category_id" ref={this.category_idRef} onChange={this.changeState} >
								<option value="1">Reviews</option>
								<option value="2">Guías</option>
								<option value="3">Mods</option>
							</select>
						</div>
						<div className="clearfix"></div>
						<div className="registro">
							<label htmlFor="description">Descripción</label>
							<textarea name="description"  ref={this.descriptionRef} onChange={this.changeState}></textarea>
						</div>

						<div className="registro">
							<label htmlFor="content">Contenido</label>
							<textarea name="content"  ref={this.contentRef} onChange={this.changeState}></textarea>
						</div>
						<div className="clearfix"></div>

						<div className="registro">
							<label htmlFor="Link">Link</label>
							<textarea name="Link"  ref={this.linkRef} onChange={this.changeState}></textarea>
						</div>

						<div className="registro">
							<label htmlFor="image">Imagen</label>
							<div className="clearfix"></div>
							<input type="file" name="file0" ref={this.imageRef} onChange={this.fileChange} />
						</div>

						<div className="clearfix"></div>

						<input type="submit" value ="Crear post" className="btn btn-success" />
					</form>
				</section>
			);
	}
}

export default CreatePost;