import React, {Component} from 'react';
import Topics  from './Topics';

class Search extends Component{
	render(){

		var searched = this.props.match.params.search;

		return (
			<section id="content">
				<h1 className="subtitle">Búsqueda: {searched}</h1>

				<div className="center">
					<Topics
						search={searched}
					/>
				</div>
			</section>
		);
	}
}

export default Search;