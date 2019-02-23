import {Component} from "react";
import React from "react";
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:80');

class Admin extends Component{
    constructor(props) {
        super(props);
        this.state = {
            broker : null,
            brokers: this.props.brokers,
            spots:this.props.spots
        };
        this.showAcBrok=this.showAcBrok.bind(this);
    }
    componentDidMount(){
        socket.on('hello', (name) =>
        {
            this.setState({
                brokers :
                    this.state.brokers.map(function (broker) {
                        if (broker.name === name) {
                            broker.online = true;
                        }
                        return broker;
                    }),
            });
        });

        socket.on('disct', (name) =>
        {
            this.setState({
                brokers :
                    this.state.brokers.map(function (broker) {
                        if (broker.name === name) {
                            broker.online = false;
                        }
                        return broker;
                    }),
            });
        });

        socket.on('BuyStocks', (data) => {
            let shownewbr = null;
            if(this.state.broker)
                for(let i=0; i<data[0].length;i++){
                    if(this.state.broker.name === data[0][i].name)
                        shownewbr = data[0][i]
                }
            this.setState({
                brokers:data[0],
                spots: data[1],
                broker: shownewbr
            })
        });
        socket.on('SellStocks', (data) => {
            let shownewbr = null;
            if(this.state.broker)
                for(let i=0; i<data[0].length;i++){
                    if(this.state.broker.name === data[0][i].name)
                        shownewbr = data[0][i]
                }
            this.setState({
                brokers:data[0],
                spots: data[1],
                broker: shownewbr
            })
        });

        socket.on('TradeStocks', (data) => {
            let shownewbr = null;
            if(this.state.broker)
                for(let i=0; i<data[0].length;i++){
                    if(this.state.broker.name === data[0][i].name)
                        shownewbr = data[0][i]
                }
            this.setState({
                brokers:data[0],
                spots: data[1],
                broker: shownewbr
            })
        });
    }
    showAcBrok(ind){
        this.setState({
            broker: this.state.brokers[ind]
        })
    }
    render(){ return(
        <>
            <div className='w3-container'>
                <div className="w3-row w3-center">
                    <h3>
                        Список брокеров
                    </h3>
                </div>
                <div className="w3-row">
                    <div className="w3-container">
                        <div className="w3-row w3-teal">
                            <div className="w3-col s3 w3-center">
                                Имя
                            </div>
                            <div className="w3-col s3 w3-center">
                                Баланс
                            </div>
                            <div className="w3-col s3 w3-center">
                                Онлайн
                            </div>
                            <div className="w3-col s3 w3-center">
                                Информация об акциях
                            </div>
                        </div>
                        {this.state.brokers.map((broker, index) => {
                            if(broker.name !== 'Admin')
                                return(
                                    <div className="w3-row w3-hover-cyan">
                                        <div className="w3-col s3 w3-center">
                                            <div className={'mt1px'}>
                                                {broker.name}
                                            </div>
                                        </div>
                                        <div className="w3-col s3 w3-center">
                                            {broker.currmoney}
                                        </div>
                                        <div className="w3-col s3 w3-center">
                                            {broker.online ? <span> &#x2714; </span> : <span> &#x2718; </span>}
                                        </div>
                                        <div className="w3-col s3 w3-center">
                                            <button onClick={this.showAcBrok.bind(this,index)} className={'w3-button w3-medium'}>
                                                Показать
                                            </button>
                                        </div>
                                    </div>
                                )
                        })}
                    </div>
                </div>
                {this.state.broker ?
                    <>
                        <div className="w3-row">
                            <hr/>
                        </div>
                        <div className='w3-row'>
                            <div className='w3-container'>
                                <div className='w3-row w3-center'>
                                    <h3>
                                        Брокер - {this.state.broker.name}
                                    </h3>
                                </div>
                                <div className='w3-row w3-teal'>
                                    <div className="w3-col s4 w3-center bold">
                                        Акция
                                    </div>
                                    <div className="w3-col s4 w3-center bold">
                                        Количество в наличии
                                    </div>
                                    <div className="w3-col s4 w3-center bold">
                                        Количество на продаже
                                    </div>
                                </div>
                                {this.state.spots.map((stock, index) => {
                                    return (
                                        <div className="w3-row w3-hover-cyan">
                                            <div className="w3-col s4 w3-center bold">
                                                {stock.name}
                                            </div>
                                            <div className="w3-col s4 w3-center bold">
                                                {this.state.broker.acBought[index].count}
                                            </div>
                                            <div className="w3-col s4 w3-center bold">
                                                {this.state.broker.acForSell[index].count}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                :''}
            </div>
        </>
    )}
}
export default Admin;