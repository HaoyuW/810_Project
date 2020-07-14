import React, { Component } from 'react';
import logo from './logo.svg';
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
	  bet1: '', 
	  bet2: '', 
	  bet3: '', 
	  bet4: '', 
      message: ''
    };
    this.loadData();
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
      console.log("no players now");
      players = [];
    }
	
    this.setState({ manager, players, balance });
    this.setState({web3});
    this.setState({lottery});
  }

  onSubmit1 = async (event) => {
    event.preventDefault();

    const accounts = await this.state.web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' })

    await this.state.lottery.methods.enter().send({
      from: accounts[1],
      value: this.state.web3.utils.toWei(this.state.value, 'ether')
    });
	
	this.setState({ bet1: this.state.value })
	
    this.setState({ message: 'You have been entered!' })
	this.loadData();
  };
  
  onSubmit2 = async (event) => {
    event.preventDefault();

    const accounts = await this.state.web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' })

    await this.state.lottery.methods.enter().send({
      from: accounts[2],
      value: this.state.web3.utils.toWei(this.state.value, 'ether')
    });
	
	this.setState({ bet2: this.state.value })
	
    this.setState({ message: 'You have been entered!' })
	this.loadData();
  };
  
  onSubmit3 = async (event) => {
    event.preventDefault();

    const accounts = await this.state.web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' })

    await this.state.lottery.methods.enter().send({
      from: accounts[3],
      value: this.state.web3.utils.toWei(this.state.value, 'ether')
    });
	
	this.setState({ bet3: this.state.value })
	
    this.setState({ message: 'You have been entered!' })
	this.loadData();
  };
  
  onSubmit4 = async (event) => {
    event.preventDefault();

    const accounts = await this.state.web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' })

    await this.state.lottery.methods.enter().send({
      from: accounts[4],
      value: this.state.web3.utils.toWei(this.state.value, 'ether')
    });
	
	this.setState({ bet4: this.state.value })
	
    this.setState({ message: 'You have been entered!' })
	this.loadData();
  };
 
  onClick = async () => {
    const accounts = await this.state.web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' })

    await this.state.lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' })
	this.loadData();
  };

  render() {
    return (
      <div>
        <h2>Group5: BlockChain Lottery Demo</h2>
        <p>
          This Lottery Game (The contract) is managed by {this.state.manager}. <br /> <br />
          There are currently {this.state.players.length} people entered, <br />
          competing to win {Web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>

        <hr />
		
		<h4>Want to try your luck?</h4>
		<label>Amount of ether to enter</label>
		<input
		  value={this.state.value}
		  onChange={event => this.setState({ value: event.target.value })}
		/>
		
        <form onSubmit={this.onSubmit1}>
		<div>
			<button>Player1</button>
			<label> Player1 bet {this.state.bet1 } ether </label>
		</div>	
		</form>
		
		<form onSubmit={this.onSubmit2}>
			<div>
			<button>Player2</button>
			<label> Player2 bet {this.state.bet2 } ether </label>
			</div>
		</form> 
		
		<form onSubmit={this.onSubmit3}> 
			<div>
			<button>Player3</button>
			<label> Player3 bet {this.state.bet3 } ether </label>
			</div>
		</form>  
		
		<form onSubmit={this.onSubmit4}>  
			<div>
				<button>Player4</button>
				<label> Player4 bet {this.state.bet4 } ether </label>
			</div>
        </form> 

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
		
        <hr />

        <h1>{this.state.message}</h1>

      </div>
    );
  }
}

export default App;
