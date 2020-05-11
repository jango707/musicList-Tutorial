import React from 'react';

export default function Header(props) {
	const { username } = props;
	return(
		<header>
			<h1>MusicList</h1>
			<div className="user-menu">
				<h2>Welcome { username }</h2>
			</div>
		</header>
	);
}