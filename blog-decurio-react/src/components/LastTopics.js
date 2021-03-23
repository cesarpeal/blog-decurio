import React, {Component} from 'react';
import Topics  from './Topics';

class LastTopics extends Component{
	render(){


		return (
			<section id="content">
				<h1 className="subtitle">Útimas publicaciones</h1>
				<Topics/>
			</section>
		);
	}
}

export default LastTopics;