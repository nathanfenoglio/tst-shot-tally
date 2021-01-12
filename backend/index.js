const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());

//can run in browser with yarn start
//any time that you add another route you need to 
//forever stopall
//forever start index.js
//in this backend directory

//create connection to mysql workbench database
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

app.get('/api/players', (req, res) => {
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
});

//create route to Duals for history to display
app.get('/api/duals_totals', (req, res) => {
	const GET_DUALS_HISTORY = 'SELECT P1.F_name AS p1_F_name, D.p1_tot_wins AS p1_tot_wins, P2.F_name AS p2_F_name, D.p2_tot_wins AS p2_tot_wins FROM Duals D, Players P1, Players P2 WHERE P1.player_ID = D.player1_ID AND P2.player_ID = D.player2_ID';
	connection.query(GET_DUALS_HISTORY, (err, results) => {
		if(err){
			return res.send(err);
		}
		else{
			return res.json({
				data: results
			});
		}
	})
});

//create route to add player
app.get('/api/players/add', (req, res) => {
	const { F_name, L_name } = req.query; 
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

//create route to start a new day
app.get('/api/players/setup_new_day', (req, res) => {
	//Query is hard coded. If new player is added, will need to add to query 
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

//create route to end a day and tally up wins and losses - changing to accept date input instead of current day
app.get('/api/players/end_day_tally', (req, res) => {
	const { day_to_close } = req.query;
	console.log("day_to_close: " + day_to_close);
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

//create route for lesser indexed player to shoot higher indexed player
app.get('/api/players/apply_shot', (req, res) => {
	const { shooter, got_shot } = req.query;
	console.log(shooter + ' ' + got_shot);
	var current_date = new Date().toLocaleString();
	console.log(current_date);
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
	const { shooter, got_shot } = req.query;
	console.log(shooter + ' ' + got_shot);
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
	console.log(`Products server listening`);
});