const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());

//commenting out all of the specific database access stuff to test 
/*
//create connection to database - localhost
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'tst_shot_tally',
	multipleStatements: true
});

//connect to database
connection.connect(err  => {
	if(err){
		return err;
	}
});



//creating route
app.get('/', (req, res) => {
//app.get('https://tst-shot-tally.herokuapp.com/', (req, res) => {
//app.get('https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/', (req, res) => {
	res.send('go to /players to see players');
});

//create route to players
app.get('/players', (req, res) => {
//app.get('https://tst-shot-tally.herokuapp.com/players', (req, res) => {
//app.get('https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/players', (req, res) => {
	const SELECT_ALL_PLAYERS_QUERY = 'SELECT * FROM players';
	connection.query(SELECT_ALL_PLAYERS_QUERY, (err, results) => {
		if(err){
			return res.send(err);
		}
		else{
			return res.json({
				data: results
			});
			console.log(results.player_ID);
		}
	});
});
//commenting out all of the specific database access stuff to test
*/
app.get('/', (req, res) => {
	//res.send('hello from the server side and fart in your face');
	res.send('<button style={{fontWeight: 'bold', color: 'orangered', fontFamily: 'fantasy', fontSize: 40}};<h1>hello from the server side and fart in your face</h1>');
});

app.listen(process.env.PORT || 4000, () => {
	console.log(`Products server listening on port 4000`);
});