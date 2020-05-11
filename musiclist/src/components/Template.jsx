import React from 'react';

import Header from './shared/Header';
import HomePage from './home/HomePage';

export default function Template(){
	return(
		<div className="wrapper">
			<Header username= "JANGO" />
			<HomePage />
		</div>
	);
}