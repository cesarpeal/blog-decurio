import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';
import qs from 'qs';

class EditPost extends Component{

	url = Global.url;

	postId = null;

	titleRef = React.createRef();
	descriptionRef = React.createRef();
	contentRef = React.createRef();
	imageRef = React.createRef();
	linkRef = React.createRef();

	state = {
		topic: {},
		games: {},
		status: null,
		submitted: null,
		selectedFile: null
	}

	componentDidMount(){
		this.postId = this.props.match.params.id;
		this.getPost(this.postId);
	}


	getPost = (id) => {
		axios.get(this.url + 'topic/' + id)
			.then(res => {
				this.setState({
					topic: res.data.topic
				})
			});
	}
	
	changeState = () => {
		this.setState({
			topic: {
				title: this.titleRef.current.value,
				content: this.contentRef.current.value,
				description: this.descriptionRef.current.value,
				image: this.imageRef.current.value,
				link: this.linkRef.current.value
			}
		});
		this.forceUpdate();
	}

	recibirFormulario = (e) => {
		e.preventDefault();

		this.changeState();
		this.state.submitted = "Done";



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
					'json': '{"title":"'+this.state.topic.title+'", "content":"'+this.state.topic.content+'", "image":"'+res.data.image+'", "description":"'+this.state.topic.description+'", "link":"'+this.state.topic.link+'"}' 
					});

					var config = {
						method: 'put',
						url: this.url+'topic/'+this.postId,
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

			 				 		} else {
			 				 		this.setState({
			 				 			status: 'failed'
			 				 		});
			 				 		this.forceUpdate();
			 				 	}

			 				 });
			 				 
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
	}



	render(){
		if(this.state.submitted === 'Done'){
			return <Redirect to="/" />
		}

		return(
			<section id="content">
				<h2 id="subtitle">Editar post</h2>
				<form className="mid-form" onSubmit={this.recibirFormulario}>
					<div className="registro">
						<label htmlFor="title">Titulo</label>
						<input type="text" name="title" defaultValue={this.state.topic.title} ref={this.titleRef} onChange={this.changeState} />
					</div>
					<div className="clearfix"></div>
					<div className="registro">
						<label htmlFor="description">Descripción</label>
						<textarea name="description" defaultValue={this.state.topic.description}  ref={this.descriptionRef} onChange={this.changeState}></textarea>
					</div>

					<div className="registro">
						<label htmlFor="content">Contenido</label>
						<textarea name="content" defaultValue={this.state.topic.content}  ref={this.contentRef} onChange={this.changeState}></textarea>
					</div>
					<div className="clearfix"></div>

					<div className="registro">
						<label htmlFor="Link">Link</label>
						<textarea name="Link" defaultValue={this.state.topic.link}  ref={this.linkRef} onChange={this.changeState}></textarea>
					</div>

					<div className="registro">
						<label htmlFor="image">Imagen</label>
						<div className="clearfix"></div>
						<div className="image-wrap">
							{
								this.state.topic.image !== null ? (
									<img src={this.url + 'topic/image/' + this.state.topic.image} alt={this.state.topic.title} className="image-edit" />
								) : (
									<br />
								)
							}
							</div>
						<input type="file" name="file0" defaultValue={this.state.topic.image} ref={this.imageRef} onChange={this.fileChange} />
					</div>

					<div className="clearfix"></div>

					<input type="submit" value ="Editar post" className="btn btn-success" />
				</form>
			</section>
		);
	}
}

export default EditPost;