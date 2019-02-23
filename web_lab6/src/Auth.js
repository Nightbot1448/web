import {Component} from "react";
import React from "react";
import openSocket from "socket.io-client";

const socket = openSocket('http://localhost:80');

class Auth extends Component{
    constructor(props) {
        super(props);
        this.state = {name : "",
            brokers: this.props.brokers,
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this)
       // this.getInfo=this.getInfo.bind(this)
    }
    componentDidMount(){
        socket.on('hello', (name) =>
        {
            this.setState({
                brokers:
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
    }
    onChange(e) {
        let value = e.target.value
        this.setState({name: value})
    }
    onSubmit(e) {
        this.props.submit(this.state.name)
    }
    render(){
        return(
            <div className='w3-container mtpx'>
                <div className='w3-row'>
                    <div className="w3-col s4">
                        &nbsp;
                    </div>
                    <div className="w3-col s3 w3-center">
                        <select className="select-class w3-select" onChange={this.onChange}>
                            <option>
                                --Ваше имя--
                            </option>
                            {this.state.brokers.map(function (broker, index) {
                                if(!broker.online)
                                    return <option value={broker.name} key={broker.name}>{broker.name}</option>
                            })}
                        </select>
                    </div>
                    <div className="w3-col s4">
                        <button className="w3-button w3-cyan" onClick = {this.onSubmit}>
                            Отправить
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default Auth;