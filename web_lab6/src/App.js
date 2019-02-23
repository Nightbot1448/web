import React, { Component } from 'react';
import  Brokers  from "./Brokers"
import Auth from  "./Auth"
import Admin from "./Admin"
import $ from 'jQuery'

import './App.css';
import openSocket from "socket.io-client";

const socket = openSocket('http://localhost:80');

class App extends Component{
    constructor(){
        super();
        this.state={
            name:'',
            brokers:null,
            spots:null,
            isLoad : false,
        };
        this.login = this.login.bind(this);
        this.unlogin=this.unlogin.bind(this);
        this.sortBr=this.sortBr.bind(this);
        this.findBroker=this.findBroker.bind(this);
    }
    sortBr(){
        let offBr=[];
        for(let i=0;i<this.state.brokers.length;i++) {
            if (!this.state.brokers[i].online)
                offBr.push(this.state.brokers[i])
        }
        return offBr;
    }
    login(name){
        this.setState({
            name: name
        })
    }
    unlogin(){
        window.location="http://localhost:3000";
    }
    findBroker(){
        for(let i=0;i< this.state.brokers.length;i++){
            if(this.state.name === this.state.brokers[i].name)
                return i;
        }
    }
    componentDidMount() {
        $.ajax({
            url: 'http://localhost:80/info',
            method: 'GET',
            crossDomain: true,
            success:  (data)  => {
                this.setState({
                    brokers : data.brokers,
                    spots: data.spots,
                    isLoad: true,
                })
            }
        });
        socket.on('BuyStocks', (data) => {
            this.setState({
                brokers:data[0],
                spots: data[1]
            })
        });
        socket.on('SellStocks', (data) => {
            this.setState({
                brokers:data[0],
                spots: data[1]
            })
        });
        socket.on('TradeStocks', (data) => {
            this.setState({
                brokers:data[0],
                spots: data[1]
            })
        });
    }

    render() {
        let view='';
        if(this.state.isLoad) {
            if (this.state.name === '') {
                view = <Auth brokers={this.sortBr()} submit={this.login}/>;
            }
            else if (this.state.name === 'Admin')
                view = <Admin brokers={this.state.brokers} spots={this.state.spots}/>;
            else {
                view = <Brokers spots={this.state.spots} broker={this.state.brokers[this.findBroker()]}/>
            }
        }

        return (
            <div>
                {this.state.name !=='' ?
                    <button className='w3-margin-left w3-margin-top w3-button w3-cyan' onClick={this.unlogin}>Назад</button>
                    : ''}
                {view}
            </div>
        );
    }
}

export default App;
