import {Component} from "react";
import React from "react";
import openSocket from "socket.io-client";

const socket = openSocket('http://localhost:80');

class Brokers extends Component{
    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
            totalmoney:this.props.broker.currmoney + this.totalPriceAkc(),
            openmodal : [0,0,0]
        };
        this.totalPriceAkc=this.totalPriceAkc.bind(this);
        this.priceAc=this.priceAc.bind(this);
        this.onBuy=this.onBuy.bind(this);
        this.onSell=this.onSell.bind(this);
        this.onTrade=this.onTrade.bind(this);
        this.closeMod=this.closeMod.bind(this);
        this.BuyStocks=this.BuyStocks.bind(this);
        this.SellStocks=this.SellStocks.bind(this);
        this.TradeStocks=this.TradeStocks.bind(this);
    }
    componentDidMount(){
        this.setState({
            totalmoney:this.props.broker.currmoney + this.totalPriceAkc()
        });
        socket.emit('hello', this.props.broker.name);

    }
    BuyStocks(ind){
        let count=document.getElementById('stbuyinp').value;
        if(count < 0 || count > this.props.spots[ind].availCount || count===null){
            document.getElementById('uncorcount').style.display = 'block';
        }
        else if( count*this.props.spots[ind].minPrice > this.props.broker.currmoney)
            document.getElementById('uncorcount').style.display = 'block';
        else {
            document.getElementById('uncorcount').style.display = 'none';
            this.setState({
                openmodal:[0,0,0]
            });
            socket.json.emit('BuyStocks', {
                'broker': this.props.broker.name,
                'price': this.props.spots[ind].minPrice,
                'count': count,
                'id': ind
            });
        }
    }
    SellStocks(ind){
        let count=document.getElementById('stsellinp').value;
        if(count < 0 || count > this.props.broker.acBought[ind].count || count===null){
            document.getElementById('uncorcount').style.display = 'block';
        }
        else {
            document.getElementById('uncorcount').style.display = 'none';
            this.setState({
                openmodal:[0,0,0]
            });
            socket.json.emit('SellStocks', {
                'broker': this.props.broker.name,
                'price': this.props.spots[ind].minPrice,
                'count': count,
                'id': ind
            });
        }
    }
    TradeStocks(ind){
        let count=document.getElementById('sttradeinp').value;
        if(count < 0 || count > this.props.broker.acBought[ind].count || count===null){
            document.getElementById('uncorcount').style.display = 'block';
        }
        else {
            document.getElementById('uncorcount').style.display = 'none';
            let price = Number(Number(this.state.totalmoney) - Number(count)*this.props.spots[ind].minPrice);
            console.log(price);
            this.setState({
                openmodal:[0,0,0],
                totalmoney: Number(price),
            });
            socket.json.emit('TradeStocks', {
                'broker': this.props.broker.name,
                'price': this.props.spots[ind].minPrice,
                'count': count,
                'id': ind
            });
        }
    }
    closeMod(){
        this.setState({
            openmodal:[0,0,0]
        })
    }
    totalPriceAkc(){
        let price=0;
        for (let i=0;i<this.props.broker.acBought.length;i++){
            price+=this.priceAc(i);
        }
        return price;
    }
    priceAc(ind){
        return this.props.spots[ind].minPrice*this.props.broker.acBought[ind].count;
    }
    onBuy(ind){
        this.setState({
            openmodal:[ind+1,0,0]
        })
    }
    onSell(ind){
        this.setState({
            openmodal:[0,ind+1,0]
        })
    }
    onTrade(ind){
        this.setState({
            openmodal:[0,0,ind+1]
        })
    }
    render(){
        let broker = this.props.broker;
        let stocks = this.props.spots;
        let modalBuy = [''];
        let modalSell=[''];
        let modalTrade=[''];
        stocks.map( (stock,index) => {
            modalBuy.push(
                <div className="w3-modal" key={stock.name}>
                    <div className="w3-modal-content w3-card-4 modal-width">
                        <header className="w3-container w3-teal">
                                <span className="w3-button w3-display-topright"
                                      onClick={this.closeMod.bind(this)}>
                                    &times;
                                </span>
                            <h2 className="w3-center">Покупка {stock.name}</h2>
                        </header>
                        <div className={'w3-container'}>
                            <p className={'bold'}>Введите кол-во</p>
                            <input id={'stbuyinp'}className='w3-input w3-border' type='number'/>
                            <p id='uncorcount' style={{'display':'none'}} className={'w3-block w3-red bold'}>Неккоректное кол-во</p>
                            <input type={'button'} value={'Купить'} id='butbuyst' onClick={this.BuyStocks.bind(this,index)}
                                   className="w3-button w3-block w3-teal w3-section w3-padding" />
                        </div>
                    </div>
                </div>
            );
            modalSell.push(
                <div className="w3-modal" key={stock.name}>
                    <div className="w3-modal-content w3-card-4 modal-width">
                        <header className="w3-container w3-teal">
                                <span className="w3-button w3-display-topright"
                                      onClick={this.closeMod.bind(this)}>
                                    &times;
                                </span>
                            <h2 className="w3-center">Продажа {stock.name}</h2>
                        </header>
                        <div className={'w3-container'}>
                            <p className={'bold'}>Введите кол-во</p>
                            <input id={'stsellinp'}className='w3-input w3-border' type='number'/>
                            <p id='uncorcount' style={{'display':'none'}} className={'w3-block w3-red bold'}>Неккоректное кол-во</p>
                            <input type={'button'} value={'Продать'} id='butsellst' onClick={this.SellStocks.bind(this,index)}
                                   className="w3-button w3-block w3-teal w3-section w3-padding"/>
                        </div>
                    </div>
                </div>
            );
            modalTrade.push(
                <div className="w3-modal" key={stock.name}>
                    <div className="w3-modal-content w3-card-4 modal-width">
                        <header className="w3-container w3-teal">
                                <span className="w3-button w3-display-topright" onClick={this.closeMod.bind(this)}>
                                    &times;
                                </span>
                            <h2 className="w3-center">Выставить на продажу {stock.name}</h2>
                        </header>
                        <div className={'w3-container'}>
                            <p className={'bold'}>Введите кол-во</p>
                            <input id={'sttradeinp'}className='w3-input w3-border' type='number'/>
                            <p id='uncorcount' style={{'display':'none'}} className={'w3-block w3-red bold'}>Неккоректное кол-во</p>
                            <input type={'button'} value={'Выставить'} id='buttradest' onClick={this.TradeStocks.bind(this,index)}
                                   className="w3-button w3-block w3-teal w3-section w3-padding" />
                        </div>
                    </div>
                </div>
            )
        });
        return(
            <>
                <div className='w3-container'>
                    <div className="w3-row w3-center">
                         <h3>
                             Брокер
                         </h3>
                    </div>
                    <div className="w3-row">
                        <div className="w3-container">
                            <div className="w3-row w3-teal">
                                <div className="w3-col s3 w3-center">
                                    Имя
                                </div>
                                <div className="w3-col s3 w3-center">
                                    Начальный баланс
                                </div>
                                <div className="w3-col s3 w3-center">
                                    Текущий баланс
                                </div>
                                <div className="w3-col s3 w3-center">
                                    Суммарный баланс
                                </div>
                            </div>
                            <div className="w3-row w3-hover-cyan">
                                <div className="w3-col s3 w3-center">
                                    {broker.name}
                                </div>
                                <div className="w3-col s3 w3-center">
                                    {broker.startmoney}
                                </div>
                                <div className="w3-col s3 w3-center">
                                    {broker.currmoney}
                                </div>
                                <div className="w3-col s3 w3-center">
                                    {this.state.totalmoney}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w3-row w3-center w3-margin-top">
                        <h3>
                            Акции брокера
                        </h3>
                    </div>
                    <div className="row">
                        <div className="w3-container">
                            <div className="w3-row w3-teal">
                                <div className="w3-col s4 w3-center bold">
                                    Акция
                                </div>
                                <div className="w3-col s3 w3-center">
                                    Количество
                                </div>
                                <div className="w3-col s3 w3-center">
                                    Общая стоимость
                                </div>
                                <div className="w3-col s1 w3-center bold">
                                    Продать
                                </div>
                                <div className="w3-col s1 w3-center bold">
                                    Торги
                                </div>
                            </div>
                            {broker.acBought.map( (stock, index) => {
                                return(
                                    <div className="w3-row w3-hover-cyan">
                                        <div className="w3-col s4 w3-center bold">
                                            {stock.name}
                                        </div>
                                        <div className="w3-col s3 w3-center">
                                            {stock.count}
                                        </div>
                                        <div className="w3-col s3 w3-center">
                                            {this.priceAc(index)}
                                        </div>
                                        <div className="w3-col s1 w3-center">
                                            <button className={'w3-button w3-medium'} onClick={this.onSell.bind(this,index)}>
                                                Продать
                                            </button>
                                        </div>
                                        <div className="w3-col s1 w3-center">
                                            <button className={'w3-button w3-medium'}  onClick={this.onTrade.bind(this,index)}>
                                                Выставить
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="w3-row">
                        <hr/>
                    </div>
                    <div className="w3-row w3-center w3-margin-top">
                        <h3>
                            Биржа
                        </h3>
                    </div>
                    <div className="w3-row">
                        <div className="w3-container">
                            <div className="w3-row w3-teal">
                                <div className="w3-col s3 w3-center">
                                    Акция
                                </div>
                                <div className="w3-col s3 w3-center">
                                    Стоимость
                                </div>
                                <div className="w3-col s2 w3-center bold">
                                    Доступно
                                </div>
                                <div className="w3-col s2 w3-center bold">
                                    Закон распределения
                                </div>
                                <div className="w3-col s2 w3-center bold">
                                    Купить
                                </div>
                            </div>
                            {this.props.spots.map( (stock, index) => {
                                return(
                                    <div className="w3-row w3-hover-cyan">
                                        <div className="w3-col s3 w3-center">
                                            {stock.name}
                                        </div>
                                        <div className="w3-col s3 w3-center">
                                            <div className='mt1px'>
                                                {stock.minPrice}
                                            </div>
                                        </div>
                                        <div className="w3-col s2 w3-center bold">
                                            {stock.availCount}
                                        </div>
                                        <div className="w3-col s2 w3-center bold">
                                            {stock.distr}
                                        </div>
                                        <div className="w3-col s2 w3-center bold">
                                            <button onClick={this.onBuy.bind(this,index)} className='w3-button w3-medium'>
                                                Купить
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="w3-row">
                        <hr/>
                    </div>
                    <div className="w3-row w3-center w3-margin-top">
                        <h3>
                            Торги
                        </h3>
                    </div>
                    <div className="row w3-margin-bottom">
                        <div className="w3-container">
                            <div className="w3-row w3-teal">
                                <div className="w3-col s4 w3-center bold">
                                    Акция
                                </div>
                                <div className="w3-col s4 w3-center bold">
                                    Количество
                                </div>
                                <div className="w3-col s4 w3-center bold">
                                    Возможная выручка
                                </div>
                            </div>
                            {broker.acForSell.map( (stock, index) => {
                                return(
                                    <div className="w3-row w3-hover-cyan">
                                        <div className="w3-col s4 w3-center bold">
                                            {stock.name}
                                        </div>
                                        <div className="w3-col s4 w3-center bold">
                                            {stock.count}
                                        </div>
                                        <div className="w3-col s4 w3-center bold">
                                            {stock.count*this.props.spots[index].minPrice}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                {modalBuy[this.state.openmodal[0]]}
                {modalSell[this.state.openmodal[1]]}
                {modalTrade[this.state.openmodal[2]]}
            </>
        )}
}
export default Brokers;