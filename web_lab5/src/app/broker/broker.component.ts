import { Component, OnInit } from '@angular/core';
import {Broker} from "./Broker";
import { TodoService} from "../todo.service";

@Component({
  selector: 'app-root',
  templateUrl: './broker.component.html',
  styleUrls: [ './broker.component.css' ],
  providers: [ TodoService ]
})
export class BrokerComponent implements OnInit {
  mydata: Broker[];
  ModalVis:boolean = false;
  MoneyFlag: number = 0;
  constructor(private todoService: TodoService) { }
  ngOnInit(): void { // При инициализации компонента
    this.todoService.getBrokers().subscribe(brokers =>this.mydata=brokers);
  }
  add(name: string, money:number) { // Добавление данных
    if(name === "" || name ===undefined || money === null || money ===undefined) {
      alert("Введите корректно!");
    }
    else if(this.findcopyname(name) !== -1)
      alert("Брокер с таким именем уже существует!");
    else {
      this.mydata.push(new Broker(name,money));
      this.todoService.updateBrokers(this.mydata);
      this.ModalVis = false;
    }
  }
  addform(){
    this.ModalVis = true;
  }
  closeaddform(){
    this.ModalVis = false;
  }
  delAkc(ind:number){
    this.mydata.splice(ind,1);
    this.todoService.updateBrokers(this.mydata);
  }
  editmoney(ind:number,newmoney:number){
    this.mydata[ind].money = newmoney;
    this.todoService.updateBrokers(this.mydata);
  }
  editmoneyflag(ind:number){
    this.MoneyFlag = ind;
  }
  findcopyname(name) {
    for (let i = 0; i < this.mydata.length; i++) {
      if (this.mydata[i].name == name) return i;
    }
    return -1;
  }
}
