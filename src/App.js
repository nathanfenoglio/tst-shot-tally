import React, { Component } from 'react'; //added
//import logo from './logo.svg';
import './App.css';
/*
class App extends Component{ //added
	render(){
	  return (
		<div className="App">
			<div>
				<h1 style={{color: 'yellow', fontFamily: 'cursive', fontSize: 100}}> Tst Shot Tally</h1>
			</div>
		  <header className="App-header">
			<img src={logo} className="App-logo" alt="logo" />
			<p>
			  Edit <code>src/App.js</code> and save to reload.
			</p>
			<a
			  className="App-link"
			  href="https://reactjs.org"
			  target="_blank"
			  rel="noopener noreferrer"
			>
			  Learn React
			</a>
		  </header>
		</div>
	  );
	};
}
*/

//function App() {
class App extends Component{ //added
	
	state = {
		players: [],
		player: {
			F_name: '',
			L_name: '',
			player_ID: ''
		},
		duals_today: [],
		day_to_close: '',
		shooter: 0,
		got_shot: 0
	}
	
	componentDidMount(){
		this.getPlayers();
		this.getDualsToday();
	}
	
	getPlayers = _ => {
		//fetch('tst-shot-tally-take-million.cpp3rxeuxzx8.us-east-2.rds.amazonaws.com/players')
		//fetch('http://localhost:4000/players')
		//fetch('http://localhost:4000/api/players')
		fetch('http://ec2-3-139-86-44.us-east-2.compute.amazonaws.com/api/players')
		
		//fetch('http://localhost:5000/players')
		//fetch('https://tst-shot-tally.herokuapp.com/players')
		//fetch('https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/players')
			.then(response => response.json())
			.then(response => this.setState({ players: response.data }))
			.catch(err => console.error(err))
	}
	
	getDualsToday = () => {
		fetch('http://ec2-3-139-86-44.us-east-2.compute.amazonaws.com/api/duals_today')
		//fetch('http://localhost:4000/duals_today')
		//fetch('https://tst-shot-tally.herokuapp.com/duals_today')
		//fetch('https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/duals_today')
			.then(response => response.json())
			.then(response => this.setState({ duals_today: response.data }))
			.catch(err => console.error(err))
	}
	
	addPlayer = _ => {
		const { player } = this.state;
		fetch(`http://ec2-3-139-86-44.us-east-2.compute.amazonaws.com/api/players/add?F_name=${player.F_name}&L_name=${player.L_name}`)
		//fetch(`http://localhost:4000/players/add?F_name=${player.F_name}&L_name=${player.L_name}`)
		//fetch(`https://tst-shot-tally.herokuapp.com/players/add?F_name=${player.F_name}&L_name=${player.L_name}`)
		//fetch(`https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/players/add?F_name=${player.F_name}&L_name=${player.L_name}`)
			.then(this.getPlayers)
			.catch(err => console.error(err))
	}
	
	//just trying to update something like tot_shots
	updateSomething = _ => {
		const { player } = this.state;
		fetch(`http://ec2-3-139-86-44.us-east-2.compute.amazonaws.com/api/players/update_something?player_ID=${player.player_ID}`)
		//fetch(`http://localhost:4000/players/update_something?player_ID=${player.player_ID}`)
		//fetch(`https://tst-shot-tally.herokuapp.com/players/update_something?player_ID=${player.player_ID}`)
		//fetch(`https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/players/update_something?player_ID=${player.player_ID}`)
			.then(this.getPlayers)
			.catch(err => console.error(err))
	}
	
	//haven't figured out how to do stuff based on which of the buttons was pushed...
	getButtonsUsingMap = () =>{
		const { players } = this.state;
		return players.map((one_player) => {
			//return <button key={one_player.player_ID} onClick={console.log(one_player.F_name)}>{one_player.F_name}</button>
			return <button key={one_player.player_ID} onClick={this.handleClick}>{one_player.F_name}</button>
			//return <button key={one_player.player_ID} onClick= () => {this.setState({shooter: this.one_player.player_ID})}>{one_player.F_name}</button>
		})
	}
	
	begin_new_day = () =>{
		fetch(`http://ec2-3-139-86-44.us-east-2.compute.amazonaws.com/api/players/setup_new_day`)
		//fetch(`http://localhost:4000/players/setup_new_day`)
		//fetch(`https://tst-shot-tally.herokuapp.com/players/setup_new_day`)
		//fetch(`https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/players/setup_new_day`)
			.then(this.getPlayers)
			.then(this.getDualsToday)
			.catch(err => console.error(err))
	}
	/*
	end_day_tally = () => {
		fetch(`http://localhost:4000/players/end_day_tally`)
			.then(this.getPlayers)
			.then(this.getDualsToday)
			.catch(err => console.error(err))
	}
	*/
	//changing to accept date input instead of current day
	end_day_tally = () => {
		const { day_to_close } = this.state;
		fetch(`http://ec2-3-139-86-44.us-east-2.compute.amazonaws.com/api/players/end_day_tally?day_to_close=${day_to_close}`)
		//fetch(`http://localhost:4000/players/end_day_tally?day_to_close=${day_to_close}`)
		//fetch(`https://tst-shot-tally.herokuapp.com/players/end_day_tally?day_to_close=${day_to_close}`)
		//fetch(`https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/players/end_day_tally?day_to_close=${day_to_close}`)
			.then(this.getPlayers)
			.then(this.getDualsToday)
			.catch(err => console.error(err))
	}
	
	applyShot = () => {
		const { shooter, got_shot } = this.state;
		console.log("apply shot registered click");
		if(shooter < got_shot){
			fetch(`http://ec2-3-139-86-44.us-east-2.compute.amazonaws.com/api/players/apply_shot?shooter=${shooter}&got_shot=${got_shot}`)
			//fetch(`http://localhost:4000/players/apply_shot?shooter=${shooter}&got_shot=${got_shot}`)
			//fetch(`https://tst-shot-tally.herokuapp.com/players/apply_shot?shooter=${shooter}&got_shot=${got_shot}`)
			//fetch(`https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/players/apply_shot?shooter=${shooter}&got_shot=${got_shot}`)
				.then(this.getPlayers)
				.then(this.getDualsToday)
				.catch(err => console.error(err))
		}
		else{
			fetch(`http://ec2-3-139-86-44.us-east-2.compute.amazonaws.com/api/players/apply_shot_player2?shooter=${shooter}&got_shot=${got_shot}`)
			//fetch(`http://localhost:4000/players/apply_shot_player2?shooter=${shooter}&got_shot=${got_shot}`)
			//fetch(`https://tst-shot-tally.herokuapp.com/players/apply_shot_player2?shooter=${shooter}&got_shot=${got_shot}`)
			//fetch(`https://cors-anywhere.herokuapp.com/https://tst-shot-tally.herokuapp.com/players/apply_shot_player2?shooter=${shooter}&got_shot=${got_shot}`)
				.then(this.getPlayers)
				.then(this.getDualsToday)
				.catch(err => console.error(err))
		}
	
	}
	//just a comment
	renderPlayers = ({ player_ID, F_name, L_name, tot_shots}) => <div key={player_ID}>{F_name} {L_name} Total Shots: {tot_shots}</div>
	renderDualsByDay = ( {player1_ID, player2_ID, p1_first_name, p2_first_name, p1_shots_for_day, p2_shots_for_day}) => <div key={player1_ID + '-' + player2_ID}><h3 style={{ color: 'blue', fontSize: 50 }}>{p1_first_name}: {p1_shots_for_day} vs {p2_first_name}: {p2_shots_for_day}</h3></div>
	
	render(){
		const { players, player, duals_today, day_to_close } = this.state;
		return (
			<div className="App">
				<div>
					<h1 style={{color: 'yellow', fontFamily: 'cursive', fontSize: 100}}> Tst Shot Tally</h1>
				</div>
				
				<div>
					{/*{this.getButtonsUsingMap()}*/}
					<h1 style={{fontFamily: 'fantasy', fontSize: 50}}>The Shooter</h1>
					{console.log("Shooter: ", this.state.shooter)}
					<button style={{fontWeight: 'bold', color: 'orangered', fontFamily: 'fantasy', fontSize: 40}} onClick={() => this.setState({ shooter: 1 })}><img src="Nate_Grump_Face.png" alt="nathan" style={{width: '200px', height: '200px'}}/><br/>NathaN</button>
					<button style={{fontWeight: 'bold', color: 'orangered', fontFamily: 'fantasy', fontSize: 40}} onClick={() => this.setState({ shooter: 11 })}><img src="Daisy.png" alt="daisy" style={{width: '200px', height: '200px'}}/><br/>DaisY</button>
					<button style={{fontWeight: 'bold', color: 'orangered', fontFamily: 'fantasy', fontSize: 40}} onClick={() => this.setState({ shooter: 21 })}><img src="Tati_censored.png" alt="tatiana" style={{width: '200px', height: '200px'}}/><br/>TatianA</button>
					<button style={{fontWeight: 'bold', color: 'orangered', fontFamily: 'fantasy', fontSize: 40}} onClick={() => this.setState({ shooter: 31 })}><img src="Jessica_Normal_Face.png" alt="jessica" style={{width: '200px', height: '200px'}}/><br/>JessicA</button>
				</div>
				
				<div>
					<h1 style={{fontFamily: 'fantasy', fontSize: 50}}>The One Who Got Shot</h1>
					{console.log("Got Shot: ", this.state.got_shot)}
					<button style={{fontWeight: 'bold', color: 'orangered', fontFamily: 'fantasy', fontSize: 40}} onClick={() => this.setState({ got_shot: 1 })}><img src="Nate_Grump_Face.png" alt="nathan" style={{width: '200px', height: '200px'}}/><br/>NathaN</button>
					<button style={{fontWeight: 'bold', color: 'orangered', fontFamily: 'fantasy', fontSize: 40}} onClick={() => this.setState({ got_shot: 11 })}><img src="Daisy.png" alt="daisy" style={{width: '200px', height: '200px'}}/><br/>DaisY</button>
					<button style={{fontWeight: 'bold', color: 'orangered', fontFamily: 'fantasy', fontSize: 40}} onClick={() => this.setState({ got_shot: 21 })}><img src="Tati_censored.png" alt="tatiana" style={{width: '200px', height: '200px'}}/><br/>TatianA</button>
					<button style={{fontWeight: 'bold', color: 'orangered', fontFamily: 'fantasy', fontSize: 40}} onClick={() => this.setState({ got_shot: 31 })}><img src="Jessica_Normal_Face.png" alt="jessica" style={{width: '200px', height: '200px'}}/><br/>JessicA</button>
				</div>
				
				<div>
					<br/>
					<button onClick={this.applyShot} style={{backgroundColor: '#FF333E', width: '200px', height: '100px', fontSize: '33px', fontWeight: 'bold', color: 'chartreuse'}}>Apply Shot</button>
				</div>
				
				<div>
					<h1 style={{color: 'orchid', fontFamily: 'cursive', fontSize: 90}}>Today's Totals</h1>
					{duals_today.map(this.renderDualsByDay)}
				</div>
				
				<div>
					<button style={{height: 80, width: 180, fontFamily: 'calisto', fontWeight: 'bold', fontSize: 23, color: 'tomato'}} onClick={this.begin_new_day}>Start New Day of Violence</button>
				</div>
				
				<div>
					<br/><br/>
					<input value={day_to_close} placeholder='Enter date to close' onChange={e => this.setState({ day_to_close: e.target.value })}/>
					<h3>{day_to_close}</h3>
					<button style={{height: 80, width: 180, fontFamily: 'calisto', fontWeight: 'bold', fontSize: 23, color: 'tomato'}} onClick={this.end_day_tally}>End Day Tally Wins/Losses</button>
					
				</div>
				
				{players.map(this.renderPlayers)}
				
				<div>
					<h5>Register New Player</h5>
					<input value={player.F_name} placeholder='First Name' onChange={e => this.setState({ player: { ...player, F_name: e.target.value}})}/>
					<input value={player.L_name} placeholder='Last Name' onChange={e => this.setState({ player: { ...player, L_name: e.target.value}})}/>
					<button onClick={this.addPlayer}>Add Player</button>
				</div>
				
			</div>
		);
	};
	
}

export default App;

