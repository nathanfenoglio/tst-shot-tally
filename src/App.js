//Do I need to change all of the fetches to be ec2-3-21-12-36.us-east-2.compute.amazonaws.com because it seems to be different after I stopped and restarted the instance???

import React, { Component } from 'react'; 
import './App.css';
import MachineGunFire from "./machine_gun_fire.mp3";

class App extends Component{ 
	
	state = {
		players: [],
		player: {
			F_name: '',
			L_name: '',
			player_ID: ''
		},
		duals_today: [],
		duals_history: [],
		day_to_close: '',
		shooter: 0,
		got_shot: 0
	}
	
	componentDidMount(){
		this.getPlayers();
		this.getDualsToday();
		this.getDualsHistory();
	}
	
	//api fetch requests
	getPlayers = () => {
		fetch('http://ec2-3-139-86-44.us-east-2.compute.amazonaws.com/api/players')		
			.then(response => response.json())
			.then(response => this.setState({ players: response.data }))
			.catch(err => console.error(err))
	}
	
	getDualsToday = () => {
		fetch('http://ec2-3-139-86-44.us-east-2.compute.amazonaws.com/api/duals_today')
			.then(response => response.json())
			.then(response => this.setState({ duals_today: response.data }))
			.catch(err => console.error(err))
	}

	getDualsHistory = () =>{
		fetch('http://ec2-3-139-86-44.us-east-2.compute.amazonaws.com/api/duals_totals')
			.then(response => response.json())
			.then(response => this.setState({ duals_history: response.data }))
			.catch(err => console.error(err))
	}
	
	addPlayer = () => {
		const { player } = this.state;
		fetch(`http://ec2-3-139-86-44.us-east-2.compute.amazonaws.com/api/players/add?F_name=${player.F_name}&L_name=${player.L_name}`)
			.then(this.getPlayers)
			.catch(err => console.error(err))
	}
	
	begin_new_day = () =>{
		fetch(`http://ec2-3-139-86-44.us-east-2.compute.amazonaws.com/api/players/setup_new_day`)
			.then(this.getPlayers)
			.then(this.getDualsToday)
			.catch(err => console.error(err))
	}
	
	//changing to accept date input instead of current day to allow for tallying previous days
	end_day_tally = () => {
		const { day_to_close } = this.state;
		fetch(`http://ec2-3-139-86-44.us-east-2.compute.amazonaws.com/api/players/end_day_tally?day_to_close=${day_to_close}`)
			.then(this.getPlayers)
			.then(this.getDualsToday)
			.catch(err => console.error(err))
	}
	
	applyShot = () => {
		const { shooter, got_shot } = this.state;
		console.log("apply shot registered click");
		//choice of which order the player is in player_1 or player_2 based on how the duals are organized to make the logic work
		if(shooter < got_shot){
			fetch(`http://ec2-3-139-86-44.us-east-2.compute.amazonaws.com/api/players/apply_shot?shooter=${shooter}&got_shot=${got_shot}`)
				.then(this.getPlayers)
				.then(this.getDualsToday)
				.catch(err => console.error(err))
		}
		else{
			fetch(`http://ec2-3-139-86-44.us-east-2.compute.amazonaws.com/api/players/apply_shot_player2?shooter=${shooter}&got_shot=${got_shot}`)
				.then(this.getPlayers)
				.then(this.getDualsToday)
				.catch(err => console.error(err))
		}
	
	}

	//render functions to take data from state and turn into html like display stuff
	renderPlayers = ({ player_ID, F_name, L_name, tot_shots}) => <div className="tot-shots-long-term" key={player_ID}>{F_name} {L_name} Total Shots: {tot_shots}</div>
	renderDualsByDay = ( {player1_ID, player2_ID, p1_first_name, p2_first_name, p1_shots_for_day, p2_shots_for_day}) => <div key={player1_ID + '-' + player2_ID}><h3 className="total-entries">{p1_first_name}: {p1_shots_for_day} vs {p2_first_name}: {p2_shots_for_day}</h3></div>
	renderDualsHistory = ( {p1_F_name, p1_tot_wins, p2_F_name, p2_tot_wins } ) => <div key={p1_F_name + '-' + p2_F_name}><h3 className="total-entries">{p1_F_name}: {p1_tot_wins} vs {p2_F_name}: {p2_tot_wins}</h3></div>

	render(){
		const { players, player, duals_today, day_to_close, duals_history } = this.state;
		return (
			<div className="App">
				{window.scrollTo(0, 0)}
				<div>
					<h1 className="title"> Tst Shot Tally</h1>
				</div>
				
				<div>
					<h1 className="shot-got-shot-header">The Shooter</h1>
					{console.log("Shooter: ", this.state.shooter)}
					<button className="player-button" onClick={() => this.setState({ shooter: 1 })}><img src="Nate_Waiving.png" alt="nathan" style={{width: '7vw', height: '7vw'}}/><br/>NathaN</button>
					<button className="player-button" onClick={() => this.setState({ shooter: 2 })}><img src="Daisy.png" alt="daisy" style={{width: '7vw', height: '7vw'}}/><br/>DaisY</button>
					<button className="player-button" onClick={() => this.setState({ shooter: 3 })}><img src="Tati_censored.png" alt="tatiana" style={{width: '7vw', height: '7vw'}}/><br/>TatianA</button>
					<button className="player-button" onClick={() => this.setState({ shooter: 4 })}><img src="Jessica_Normal_Face.png" alt="jessica" style={{width: '7vw', height: '7vw'}}/><br/>JessicA</button>
				</div>
				
				<div>
					<h1 className="shot-got-shot-header">The One Who Got Shot</h1>
					{console.log("Got Shot: ", this.state.got_shot)}
					<button className="player-button" onClick={() => this.setState({ got_shot: 1 })}><img src="Nate_Waiving.png" alt="nathan" style={{width: '7vw', height: '7vw'}}/><br/>NathaN</button>
					<button className="player-button" onClick={() => this.setState({ got_shot: 2 })}><img src="Daisy.png" alt="daisy" style={{width: '7vw', height: '7vw'}}/><br/>DaisY</button>
					<button className="player-button" onClick={() => this.setState({ got_shot: 3 })}><img src="Tati_censored.png" alt="tatiana" style={{width: '7vw', height: '7vw'}}/><br/>TatianA</button>
					<button className="player-button" onClick={() => this.setState({ got_shot: 4 })}><img src="Jessica_Normal_Face.png" alt="jessica" style={{width: '7vw', height: '7vw'}}/><br/>JessicA</button>
				</div>
				
				<div>
					<br/>
					<button className="apply-shot-button" onClick={this.applyShot}>Apply Shot</button>
				</div>
				
				<div>
					<h1 className="todays-totals-header">Today's Totals</h1>
					{duals_today.map(this.renderDualsByDay)}
				</div>
				
				<div>
					<h1 className="todays-totals-header" style={{marginTop: "10vw"}}>Win/Loss Totals</h1>
					{duals_history.map(this.renderDualsHistory)}
				</div>

				<div>
					<button className="button-default" onClick={this.begin_new_day}>Start New Day of Violence</button>
				</div>
				
				<div>
					<br/><br/>
					<input className="input-box" value={day_to_close} placeholder='Enter date to close' onChange={e => this.setState({ day_to_close: e.target.value })}/>
					<h3>{day_to_close}</h3>
					<button className="button-default" onClick={this.end_day_tally}>End Day Tally Wins/Losses</button>
				</div>
				<div>
					<h1 class="todays-totals-header" >All Time Shot Totals</h1>
				</div>

				{players.map(this.renderPlayers)}
				
				<div style={{marginBottom: "10em"}}>
					<h5 style={{fontSize: "3vw", paddingBottom: "0em"}}>Register New Player</h5>
					<input className="input-box" value={player.F_name} placeholder='First Name' onChange={e => this.setState({ player: { ...player, F_name: e.target.value}})}/>
					<input className="input-box" value={player.L_name} placeholder='Last Name' onChange={e => this.setState({ player: { ...player, L_name: e.target.value}})}/>
					<br/>
					<button className="button-default" onClick={this.addPlayer}>Add Player</button>
				</div>

				<div>
					<audio className="audio-link" ref="audio_tag" src={MachineGunFire} autoPlay/>	
				</div>		
			</div>
		);
	};
	
}

export default App;

