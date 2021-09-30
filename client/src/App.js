import React, { Component } from "react";
import countSolidity from "./contracts/countsolidity.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { count: 10, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const instance = new web3.eth.Contract(
        countSolidity,
        "0xE5d56C7330F7a1313E7d3e2EAb4c84300850E794"
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getCount);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getCount = async () => {
    const { accounts, contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.count().call();

    // Update state with the result.
    this.setState({ count: response });
  };
  
  increaseCount = async () => {
    console.log('here...');
    const { accounts, contract } = this.state;
    await contract.methods.increaseCount().send({from: accounts[0]});
    this.getCount()
  }
  decreaseCount = async () => {
    const { accounts, contract } = this.state;
    await contract.methods.decreaseCount().send({from: accounts[0]});
    this.getCount()
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Count = {this.state.count}</h1>
        <button onClick={this.increaseCount}>Increase</button>
        <button onClick={this.decreaseCount}>Decrease</button>


      </div>
    );
  }
}

export default App;
