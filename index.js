let mapReverse = require('map-reverse');

const userNames = [
'selfjbsfwf',
'lsldhf',
'askfba',
'afdbfewofh',
'kelly',
'JANGO'
];

const userNamesUp = userNames.map(name => {
	return name.toUpperCase();
});

for(let i = 0; i<userNamesUp.length; i++){
	console.log(userNamesUp[i]);
}

const userNamesUpRev = mapReverse(userNames, name => {
	return name.toUpperCase();
});

for(let i = 0; i<userNamesUpRev.length; i++){
	console.log(userNamesUpRev[i]);
}
