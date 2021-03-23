import React, {Component} from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Topics from './components/Topics';
import Topic from './components/Topic';
import LastTopics from './components/LastTopics';
import TopicsGamesCategories from './components/TopicsGamesCategories';
import Register from './components/Register';
import Adminlogin from './components/Adminlogin';
import Search from './components/Search';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import Footer from './components/Footer';
import Error from './components/Error';

class Router extends Component{

	render(){
		return(
			<BrowserRouter>

				<Header />
			  	<div className="center">

					<Switch>
						<Route exact path="/" component={LastTopics} />
						<Route exact path="/topic/:id" component={Topic} />
						<Route exact path="/topics/:category/:game?" component={TopicsGamesCategories} />
						{/*<Route exact path="/topic/:id" render={() => (
							<section id="content">
							<h1>Página del artículo</h1>
							</section>
						)}/> */}
						<Route exact path="/registro" component={Register} />
						<Route exact path="/hidden-admin-login" component={Adminlogin} />
						<Route exact path="/crear-post" component={CreatePost} />
						<Route exact path="/editar-post/:id" component={EditPost} />
						<Route exact path="/busqueda/:search" component={Search} />
						<Route exact path="/redirect/:search" render={
							(props) => {
								var search = props.match.params.search;
								return (
										<Redirect to={'/busqueda/'+search}/>
								);
								
							}
						} />

						<Route exact path="/redirect/topics/:category" render={
							(props) => {
								var category = props.match.params.category;
								return (
										<Redirect to={'/topics/' + category}/>
								);
								
							}
						} />

						<Route exact path="/redirect/topics/:category/:game" render={
							(props) => {
								var category = props.match.params.category;
								var game = props.match.params.game;
								return (
										<Redirect to={'/topics/' + category + "/" + game}/>
								);
								
							}
						} />

						<Route component={Error} />
					</Switch>
			    </div>
				<Sidebar />
			    <div className="clearfix"></div>
				<Footer />

			</BrowserRouter>
		);
	}
}

export default Router;