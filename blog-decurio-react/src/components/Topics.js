import React, {Component} from 'react';
import axios from 'axios';
import {NavLink} from 'react-router-dom';
import Global from '../Global';

import ImageDefault from '../assets/images/ImageDefault.png'

import Moment from 'react-moment';
import 'moment/locale/es';

class Topics extends Component{
	url = Global.url;

	state = {
		topics: [],
		lasttopics: [],
		games: [],
		status: null
	}

	componentDidMount (){
		var search = this.props.search;
		var category = this.props.category;
		var game = this.props.game;

		if(search && (search !== null || search !== undefined)){
			this.getBySearch(search);
		} else if(category && (category !== null || category !== undefined) && (game === null || game === undefined)) {
			this.getGamesByCategory(category, null);
		} else if(game && (game !== null || game !== undefined)){
			this.getTopicsByGame(category, game);
		} else {
			this.getLastTopics();
		}
	}

	getBySearch = (searched) => {
		axios.get(this.url+"topic/search/"+searched)
			 .then(res => {
			 	this.setState({
			 		topics: res.data.topics,
			 		status: 'success'
			 	});
			 })
			 .catch(err => {
			 	this.setState({
				 	topics: [],
				 	status: 'success'
				 });
			 });
	}

	getLastTopics = () => {
		axios.get(this.url+"lasttopics")
			 .then(res => {
			 	this.setState({
			 		lasttopics: res.data.topics,
			 		status: 'success'
			 	});
			 });
	}

	getGamesByCategory = (category) => {
		axios.get(this.url+"topic/topics/" + category)
			 .then(res =>{
				this.setState({
					games: res.data.games,
					status: 'success'
					});
				})
				.catch(err => {
					this.setState({
						games: [],
						status: 'success'
					});
				});
	}

	getTopicsByGame = (category, game) => {
		axios.get(this.url+"topic/topics/" + category + "/" + game)
			 .then(res =>{
				this.setState({
					topics: res.data.topics,
					status: 'success'
					});
				})
				.catch(err => {
					this.setState({
						topics: [],
						status: 'success'
					});
				});
	}

	render() {

		var category = this.props.category;
		var game = this.props.game;

		if(this.state.games.length >= 1 && this.state.status === 'success'){
			var GamesByCategory = this.state.games.map((game) => {
				return (
					<article className="articles games">
						{game.image !== null ?	(
							<img src={this.url+'game/image/' + game.image} alt={game.title} />
							): (
							<img src={ImageDefault} alt={game.title} />
							)
						}
						<div className="clearfix"></div>
						<div className="data">
							<NavLink to={ '/redirect/topics/' + category + "/" + game.id } key={game.id}><h3>{game.name}</h3></NavLink>
						</div>
						<div className="clearfix"></div>
					</article>
				);
			});

		return(
			<div>
				{GamesByCategory}
			</div>
		);
			
		} else if(this.state.topics.length >= 1 && this.state.status === 'success'){
			var categoria = "";
			var Topics = this.state.topics.map((topic) => {
				return (
					<article className="articles">
						{topic.image !== null ?	(
							<img src={this.url+'topic/image/'+topic.image} alt={topic.title} />
							): (
							<img src={ImageDefault} alt={topic.title} />
							)
						}
						<div className="data">
							<NavLink to={ '/topic/' + topic.id } key={topic.id}>{topic.title}</NavLink>
							<span>{(function(){
								if(topic.category_id === 1){
									categoria = "Reviews"
								} else if(topic.category_id === 2){
									categoria = "Guías"
								} else {
									categoria = "Mods"
								}
							}).call(this)} {categoria} - <Moment fromNow>{topic.updated_at}</Moment></span>
							<p>{topic.description}</p>
						</div>
						<div className="clearfix"></div>
					</article>
				);
			});

		return(
			<div>
				{Topics}
			</div>
		);
			
		} else if(this.state.lasttopics.length >= 1 && this.state.status === 'success'){
			categoria = "";
			var lastTopics = this.state.lasttopics.map((lasttopic) => {
				return (
					<article className="articles">
						<div className="state">
							{lasttopic.created_at === lasttopic.updated_at ?(
								<span>Nuevo</span>
								) : (
								<span>Actualizado</span>
								)
							}
						</div>
						{lasttopic.image !== null ?	(
							<img src={this.url+'topic/image/'+lasttopic.image} alt={lasttopic.title} />
							): (
							<img src={ImageDefault} alt={lasttopic.title} />
							)
						}
						<div className="data">
							<NavLink to={ '/topic/' + lasttopic.id } key={lasttopic.id}>{lasttopic.title}</NavLink>
							<span> - {lasttopic.game.name} - {(function(){
								if(lasttopic.category_id === 1){
									categoria = "Reviews"
								} else if(lasttopic.category_id === 2){
									categoria = "Guías"
								} else {
									categoria = "Mods"
								}
							}).call(this)} {categoria} - <Moment fromNow>{lasttopic.updated_at}</Moment></span>
							<p>{lasttopic.description}</p>
						</div>
						<div className="clearfix"></div>
					</article>
				);
			});

		return(
			<div>
				{lastTopics}
			</div>
		);
			
		} else if(this.state.topics.length === 0 && this.state.games.length === 0 && this.state.status === 'success'){
			return (
				<div id="articles">
					<h2 className="subtitle">No hay artículos para mostrar</h2>
					<p>La búsqueda no ha dado resultados</p>
				</div>
			);
		} else {
			return (
				<div id="articles">
					<h1>Cargando...</h1>
				</div>
			);
		}
	}
}

export default Topics;