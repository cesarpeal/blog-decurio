import React, {Component} from 'react';
import Topics  from './Topics';

class TopicsGamesCategories extends Component{
	render(){
		var category = this.props.match.params.category;
		var game = this.props.match.params.game;

		return (
			<section id="content">
			<Topics 
				category={category}
				game={game}
			/>
			</section>
		);
	}
}

export default TopicsGamesCategories;