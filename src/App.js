import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import { LIBRARY_ADDRESS, LIBRARY_ABI } from './config'

class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      manager: '',
      players: [],
      balance: '',
      value: '',
      message: '',
	  account: ''
    };
    this.loadData();
	this.updateaddress = this.upateaddress.bind(this);
  }

  async loadData() {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    var lottery = new web3.eth.Contract(LIBRARY_ABI, LIBRARY_ADDRESS);
    const balance = await web3.eth.getBalance(LIBRARY_ADDRESS);
    console.log(balance); 
    const manager = await lottery.methods.manager().call();
    var pcnt = await lottery.methods.getPlayerCnt().call();
    var players = [];
    var i;
    for (i = 0; i < pcnt; i++) {
      players[i] = await lottery.methods.players(i).call();
    }  
    if (pcnt === 0){
      console.log("pcnt");
      players = [];
    }
    this.setState({ manager, players, balance });
    this.setState({web3});
    this.setState({lottery});
  }
  
  
  
  upateaddress(event){
	  this.setState({account: event.target.value});
	  console.log(this.state.account);
	 
  }
   

  onSubmit = async (event) => {
    event.preventDefault();
	
	const accounts = await this.state.web3.eth.getAccounts();
	
	var flag = 0;
	var cnt;
	
	
	
    this.setState({ message: 'Waiting on transaction success...' })
	
	for(cnt = 0; cnt <accounts.length; cnt ++){
		if(this.state.account === accounts[cnt] && this.state.account !== accounts[0] ){
			flag = 1;
		}
		
	}
	
	if(flag === 1){
    
    await this.state.lottery.methods.enter().send({
      from: this.state.account,
      value: this.state.web3.utils.toWei('1', 'ether')
    });

    this.setState({ message: 'player: ' + this.state.account + ' have been entered!' })
	console.log(this.state.value);
	console.log(this.state.account);
	}
	
	else{
		 
		 this.setState({ message: 'please enter vaild address' })
		
	}
	this.loadData();
  };

  onClick = async () => {
    const accounts = await this.state.web3.eth.getAccounts();
	
	if(this.state.account === accounts[0]){

    this.setState({ message: 'Waiting on transaction success...' })

    await this.state.lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' })
	
	}
	
	else{
		
		 this.setState({ message: 'only manager is allowed to pick the winner!' })
	}
	
	
	
	this.loadData();

  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          The prize pool has {Web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>

        <hr />
		
		
		
		
		
		<form onSubmit={this.onSubmit}>
		
				  
		  <div>
            <label>Enter your address</label>
            <input
			  type = "text" name = "account"
              onChange={event => this.upateaddress(event)}
            />
          </div>
		  
		        <hr />
		
		
          <h4>Want to try your luck?</h4>
          <div>
          
			<h4>Press button to bet one ether</h4>

       		 		  
          <button>Bet</button>
		  </div>
		  
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
		

        <hr />

        <h1> {this.state.message} </h1>
		
		 <hr />
		 
		 <h3>Rules</h3>
		 
		 <p> plase enter you account befroe making a bet </p>
		 <p> Each player can make one ether of bet for each time </p>
		 <p> player can make multiple bets in one game before the manager picks the winner </p>
		 <p> The more bets a player have, the higher chance the player would be the winner </p>
		 
		 
		 
		
		

      </div> 
	  
	 
    );
  }
}

export default App;
