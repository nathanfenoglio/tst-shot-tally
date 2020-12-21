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
*/

const connection = mysql.createConnection({
	host: 'tst-shot-tally-take-million.cpp3rxeuxzx8.us-east-2.rds.amazonaws.com',
	user: 'admin',
	password: 'password123',
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
//app.get('/', (req, res) => {
app.get('/api/', (req, res) => {
//app.get('https://tst-shot-tally.herokuapp.com/', (req, res) => {
//app.get('https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/', (req, res) => {
	res.send('<div><h1>hello from the server side and fart in your face</h1><h3>butt</h3></div>go to /players to see players');
	//res.send('<div><h1>hello from the server side and fart in your face</h1><h3>butt</h3></div>');
});

//create route to players
//app.get('tst-shot-tally-take-million.cpp3rxeuxzx8.us-east-2.rds.amazonaws.com/players', (req, res) => {
//app.get('/players', (req, res) => {
app.get('/api/players', (req, res) => {
//app.get('https://tst-shot-tally.herokuapp.com/players', (req, res) => {
//app.get('https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/players', (req, res) => {
	//const SELECT_ALL_PLAYERS_QUERY = 'SELECT * FROM players';
	const SELECT_ALL_PLAYERS_QUERY = 'SELECT * FROM Players';
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

//create route to duals_by_day for just today
app.get('/api/duals_today', (req, res) => {
//app.get('/duals_today', (req, res) => {
//app.get('https://tst-shot-tally.herokuapp.com/duals_today', (req, res) => {
//app.get('https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/duals_today', (req, res) => {
	//const SELECT_ALL_DUALS_FOR_TODAY_QUERY = 'SELECT player1_ID, player2_ID, p1_shots_for_day, p2_shots_for_day FROM duals_by_day WHERE date_of_dual = curdate()';
	//const SELECT_ALL_DUALS_FOR_TODAY_QUERY = 'SELECT player1_ID, player2_ID, p1.F_name, p2.F_name, p1_shots_for_day, p2_shots_for_day FROM duals_by_day, players p1, players p2 WHERE date_of_dual = curdate() AND player1_ID = p1.player_ID AND player2_ID = p2.player_ID';
	//const SELECT_ALL_DUALS_FOR_TODAY_QUERY = 'SELECT player1_ID, player2_ID, p1.F_name as p1_first_name, p2.F_name as p2_first_name, p1_shots_for_day, p2_shots_for_day FROM duals_by_day, players p1, players p2 WHERE date_of_dual = curdate() AND player1_ID = p1.player_ID AND player2_ID = p2.player_ID';
	const SELECT_ALL_DUALS_FOR_TODAY_QUERY = 'SELECT player1_ID, player2_ID, p1.F_name as p1_first_name, p2.F_name as p2_first_name, p1_shots_for_day, p2_shots_for_day FROM Duals_By_Day, Players p1, Players p2 WHERE date_of_dual = curdate() AND player1_ID = p1.player_ID AND player2_ID = p2.player_ID';
	connection.query(SELECT_ALL_DUALS_FOR_TODAY_QUERY, (err, results) => {
		if(err){
			return res.send(err);
		}
		else{
			return res.json({
				data: results
			});
		}
	})
})

//create route to add player
app.get('/api/players/add', (req, res) => {
//app.get('/players/add', (req, res) => {
//app.get('https://tst-shot-tally.herokuapp.com/players/add', (req, res) => {
//app.get('https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/players/add', (req, res) => {
	const { F_name, L_name } = req.query; //not sure what this line is doing??? maybe to get user input???
	const INSERT_PLAYER_QUERY = `INSERT INTO Players(F_name, L_name, tot_got_hits, tot_losses, tot_shots, tot_wins) VALUES ('${F_name}', '${L_name}', 0, 0, 0, 0)`;
	connection.query(INSERT_PLAYER_QUERY, (err, results) => {
		if(err){
			return res.send(err);
		}
		else{
			return res.send('successfully added player');
		}
	});
	
});

/*
//create route to update something
app.get('/api/players/update_something', (req, res) => {
//app.get('/players/update_something', (req, res) => {
//app.get('https://tst-shot-tally.herokuapp.com/players/update_something', (req, res) => {
//app.get('https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/players/update_something', (req, res) => {
	
	const { player_ID } = req.query;
	//var num_to_add_1_to = ...
	const UPDATE_SOMETHING_QUERY = `UPDATE Players SET tot_shots = tot_shots + 1 WHERE player_ID = '${player_ID}'`;
	connection.query(UPDATE_SOMETHING_QUERY, (err, results) => {
		if(err){
			return res.send(err);
		}
		else{
			return res.send('successfully updated something');
		}
	});
});
*/
//create route to start a new day
app.get('/api/players/setup_new_day', (req, res) => {
//app.get('/players/setup_new_day', (req, res) => {
//app.get('https://tst-shot-tally.herokuapp.com/players/setup_new_day', (req, res) => {
//app.get('https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/players/setup_new_day', (req, res) => {
	//const SETUP_NEW_DAY_QUERY = 'insert into duals_by_day(player1_ID, player2_ID, date_of_dual, p1_shots_for_day, p2_shots_for_day) values (1, 2, curdate(), 0, 0), (1, 3, curdate(), 0, 0), (1, 4, curdate(), 0, 0), (2, 3, curdate(), 0, 0), (2, 4, curdate(), 0, 0), (3, 4, curdate(), 0, 0)';
	//const SETUP_NEW_DAY_QUERY = 'insert into duals_by_day(player1_ID, player2_ID, date_of_dual, p1_shots_for_day, p2_shots_for_day) values (1, 11, curdate(), 0, 0), (1, 21, curdate(), 0, 0), (1, 31, curdate(), 0, 0), (11, 21, curdate(), 0, 0), (11, 31, curdate(), 0, 0), (21, 31, curdate(), 0, 0)';
	const SETUP_NEW_DAY_QUERY = 'insert into Duals_By_Day(player1_ID, player2_ID, date_of_dual, p1_shots_for_day, p2_shots_for_day) values (1, 2, curdate(), 0, 0), (1, 3, curdate(), 0, 0), (1, 4, curdate(), 0, 0), (2, 3, curdate(), 0, 0), (2, 4, curdate(), 0, 0), (3, 4, curdate(), 0, 0)';
	connection.query(SETUP_NEW_DAY_QUERY, (err, results) => {
		if(err){
			return res.send(err);
		}
		else{
			return res.send('successfully created new day of play');
		}
	});
});
/*
//create route to end a day and tally up wins and losses
app.get('/players/end_day_tally', (req, res) => {
	const END_DAY_TALLY_QUERY = 'update duals D, duals_by_day DBD set D.p1_tot_wins = D.p1_tot_wins + 1 where DBD.date_of_dual = curdate() and (DBD.p1_shots_for_day > DBD.p2_shots_for_day) and D.player1_ID = DBD.player1_ID and D.player2_ID = DBD.player2_ID; update duals D, duals_by_day DBD set D.p2_tot_wins = D.p2_tot_wins + 1 where DBD.date_of_dual = curdate() and (DBD.p2_shots_for_day > DBD.p1_shots_for_day) and D.player1_ID = DBD.player1_ID and D.player2_ID = DBD.player2_ID; update players p set p.tot_wins = p.tot_wins + (SELECT COUNT(*) FROM duals_by_day DBD WHERE DBD.date_of_dual = curdate() and (DBD.p1_shots_for_day > DBD.p2_shots_for_day) and p.player_ID = DBD.player1_ID); update players p set p.tot_losses = p.tot_losses + (SELECT COUNT(*) FROM duals_by_day DBD where DBD.date_of_dual = curdate() and (DBD.p1_shots_for_day > DBD.p2_shots_for_day) and p.player_ID = DBD.player2_ID); update players p set p.tot_wins = p.tot_wins + (SELECT COUNT(*) FROM duals_by_day DBD where DBD.date_of_dual = curdate() and (DBD.p2_shots_for_day > DBD.p1_shots_for_day) and p.player_ID = DBD.player2_ID); update players p set p.tot_losses = p.tot_losses + (SELECT COUNT(*) FROM duals_by_day DBD where DBD.date_of_dual = curdate() and (DBD.p2_shots_for_day > DBD.p1_shots_for_day) and p.player_ID = DBD.player1_ID);';
	connection.query(END_DAY_TALLY_QUERY, (err, results) => {
		if(err){
			return res.send(err);
		}
		else{
			return res.send('successfully tallied day wins and losses');
		}
	});
});
*/

//create route to end a day and tally up wins and losses - changing to accept date input instead of current day
app.get('/api/players/end_day_tally', (req, res) => {
//app.get('/players/end_day_tally', (req, res) => {
//app.get('https://tst-shot-tally.herokuapp.com/players/end_day_tally', (req, res) => {
//app.get('https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/players/end_day_tally', (req, res) => {
	const { day_to_close } = req.query;
	console.log("day_to_close: " + day_to_close);
	//const END_DAY_TALLY_QUERY = `update duals D, duals_by_day DBD set D.p1_tot_wins = D.p1_tot_wins + 1 where DBD.date_of_dual = '${day_to_close}' and (DBD.p1_shots_for_day > DBD.p2_shots_for_day) and D.player1_ID = DBD.player1_ID and D.player2_ID = DBD.player2_ID; update duals D, duals_by_day DBD set D.p2_tot_wins = D.p2_tot_wins + 1 where DBD.date_of_dual = '${day_to_close}' and (DBD.p2_shots_for_day > DBD.p1_shots_for_day) and D.player1_ID = DBD.player1_ID and D.player2_ID = DBD.player2_ID; update players p set p.tot_wins = p.tot_wins + (SELECT COUNT(*) FROM duals_by_day DBD WHERE DBD.date_of_dual = '${day_to_close}' and (DBD.p1_shots_for_day > DBD.p2_shots_for_day) and p.player_ID = DBD.player1_ID); update players p set p.tot_losses = p.tot_losses + (SELECT COUNT(*) FROM duals_by_day DBD where DBD.date_of_dual = '${day_to_close}' and (DBD.p1_shots_for_day > DBD.p2_shots_for_day) and p.player_ID = DBD.player2_ID); update players p set p.tot_wins = p.tot_wins + (SELECT COUNT(*) FROM duals_by_day DBD where DBD.date_of_dual = '${day_to_close}' and (DBD.p2_shots_for_day > DBD.p1_shots_for_day) and p.player_ID = DBD.player2_ID); update players p set p.tot_losses = p.tot_losses + (SELECT COUNT(*) FROM duals_by_day DBD where DBD.date_of_dual = '${day_to_close}' and (DBD.p2_shots_for_day > DBD.p1_shots_for_day) and p.player_ID = DBD.player1_ID);`;
	const END_DAY_TALLY_QUERY = `update Duals D, Duals_By_Day DBD set D.p1_tot_wins = D.p1_tot_wins + 1 where DBD.date_of_dual = '${day_to_close}' and (DBD.p1_shots_for_day > DBD.p2_shots_for_day) and D.player1_ID = DBD.player1_ID and D.player2_ID = DBD.player2_ID; update Duals D, Duals_By_Day DBD set D.p2_tot_wins = D.p2_tot_wins + 1 where DBD.date_of_dual = '${day_to_close}' and (DBD.p2_shots_for_day > DBD.p1_shots_for_day) and D.player1_ID = DBD.player1_ID and D.player2_ID = DBD.player2_ID; update Players p set p.tot_wins = p.tot_wins + (SELECT COUNT(*) FROM Duals_By_Day DBD WHERE DBD.date_of_dual = '${day_to_close}' and (DBD.p1_shots_for_day > DBD.p2_shots_for_day) and p.player_ID = DBD.player1_ID); update Players p set p.tot_losses = p.tot_losses + (SELECT COUNT(*) FROM Duals_By_Day DBD where DBD.date_of_dual = '${day_to_close}' and (DBD.p1_shots_for_day > DBD.p2_shots_for_day) and p.player_ID = DBD.player2_ID); update Players p set p.tot_wins = p.tot_wins + (SELECT COUNT(*) FROM Duals_By_Day DBD where DBD.date_of_dual = '${day_to_close}' and (DBD.p2_shots_for_day > DBD.p1_shots_for_day) and p.player_ID = DBD.player2_ID); update Players p set p.tot_losses = p.tot_losses + (SELECT COUNT(*) FROM Duals_By_Day DBD where DBD.date_of_dual = '${day_to_close}' and (DBD.p2_shots_for_day > DBD.p1_shots_for_day) and p.player_ID = DBD.player1_ID);`;
	console.log(END_DAY_TALLY_QUERY);
	
	connection.query(END_DAY_TALLY_QUERY, (err, results) => {
		if(err){
			return res.send(err);
		}
		else{
			return res.send('successfully tallied day wins and losses');
		}
	});
	
});
//just a comment
//create route for lesser indexed player to shoot higher indexed player
app.get('/api/players/apply_shot', (req, res) => {
//app.get('/players/apply_shot', (req, res) => {
//app.get('https://tst-shot-tally.herokuapp.com/players/apply_shot', (req, res) => {
//app.get('https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/players/apply_shot', (req, res) => {
	const { shooter, got_shot } = req.query;
	console.log(shooter + ' ' + got_shot);
	//what day and time does it think it is anyway?
	var current_date = new Date().toLocaleString();
	console.log(current_date);
	//const APPLY_SHOT_QUERY_TO_DUALS_BY_DAY = `update duals_by_day set p1_shots_for_day = p1_shots_for_day + 1 where player1_ID = ${shooter} and player2_ID = ${got_shot} and date_of_dual = curdate(); update duals set p1_tot_shots = p1_tot_shots + 1 where player1_ID = ${shooter} and player2_ID = ${got_shot}; update players set tot_shots = tot_shots + 1 where player_ID = ${shooter}; update players set tot_got_hits = tot_got_hits + 1 where player_ID = ${got_shot};`;
	const APPLY_SHOT_QUERY_TO_DUALS_BY_DAY = `update Duals_By_Day set p1_shots_for_day = p1_shots_for_day + 1 where player1_ID = ${shooter} and player2_ID = ${got_shot} and date_of_dual = curdate(); update Duals set p1_tot_shots = p1_tot_shots + 1 where player1_ID = ${shooter} and player2_ID = ${got_shot}; update Players set tot_shots = tot_shots + 1 where player_ID = ${shooter}; update Players set tot_got_hits = tot_got_hits + 1 where player_ID = ${got_shot};`;
	connection.query(APPLY_SHOT_QUERY_TO_DUALS_BY_DAY, (err, results) => {
		if(err){
			return res.send(err);
		}
		else{
			return res.send('shooter: ' + shooter + ' shot ' + got_shot);
		}
	});
});

//create route for higher indexed player to shoot lower indexed player
app.get('/api/players/apply_shot_player2', (req, res) => {
//app.get('/players/apply_shot_player2', (req, res) => {
//app.get('https://tst-shot-tally.herokuapp.com/players/apply_shot_player2', (req, res) => {
//app.get('https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/players/apply_shot_player2', (req, res) => {
	const { shooter, got_shot } = req.query;
	console.log(shooter + ' ' + got_shot);
	//const APPLY_SHOT_QUERY_TO_DUALS_BY_DAY = `update duals_by_day set p2_shots_for_day = p2_shots_for_day + 1 where player2_ID = ${shooter} and player1_ID = ${got_shot} and date_of_dual = curdate(); update duals set p2_tot_shots = p2_tot_shots + 1 where player2_ID = ${shooter} and player1_ID = ${got_shot}; update players set tot_shots = tot_shots + 1 where player_ID = ${shooter}; update players set tot_got_hits = tot_got_hits + 1 where player_ID = ${got_shot};`;
	const APPLY_SHOT_QUERY_TO_DUALS_BY_DAY = `update Duals_By_Day set p2_shots_for_day = p2_shots_for_day + 1 where player2_ID = ${shooter} and player1_ID = ${got_shot} and date_of_dual = curdate(); update Duals set p2_tot_shots = p2_tot_shots + 1 where player2_ID = ${shooter} and player1_ID = ${got_shot}; update Players set tot_shots = tot_shots + 1 where player_ID = ${shooter}; update players set tot_got_hits = tot_got_hits + 1 where player_ID = ${got_shot};`;
	connection.query(APPLY_SHOT_QUERY_TO_DUALS_BY_DAY, (err, results) => {
		if(err){
			return res.send(err);
		}
		else{
			return res.send('shooter: ' + shooter + ' shot ' + got_shot);
		}
	});
});

app.listen(process.env.PORT || 4000, () => {
//app.listen(process.env.PORT || 5000, () => {
	console.log(`Products server listening on port 4000`);
	//console.log(`Products server listening on port 5000`);
});