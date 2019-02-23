import { Component, OnInit } from '@angular/core';
import {Stocks} from "./Stocks";
import { TodoService} from "../todo.service";

@Component({
  selector: 'app-root',
  templateUrl: './stock.component.html',
  styleUrls: [ './stock.component.css' ],
  providers: [ TodoService ]
})

export class StockComponent implements OnInit {
  mydata: Stocks[];
  ModalVis:boolean = false;
  constructor(private todoService: TodoService) { }
  ngOnInit(): void {
    this.todoService.getAkcii().subscribe(akcii => this.mydata = akcii);
  }
  findcopyname(name) {
    for (let i = 0; i < this.mydata.length; i++) {
      if (this.mydata[i].name == name) return i;
    }
    return -1;
  }
  add(name:string,availCount:number,minPrice:number,maxPrice:number,distr:string){
    if(name && availCount && minPrice
      && maxPrice && distr){
      if(this.findcopyname(name) !== -1)
        alert("Акция с таким названием уже существует!");
      else {
        this.mydata.push(new Stocks(name, availCount, minPrice, maxPrice, distr));
        this.todoService.updateAkcii(this.mydata);
        this.ModalVis = false;
      }
    }
    else {
      alert("Введите корректно!");
    }
  }
  addform(){
    this.ModalVis = true;
  }
  closeaddform(){
    this.ModalVis = false;
  }
  deleteStock(ind:number){
    this.mydata.splice(ind,1);
    this.todoService.updateAkcii(this.mydata);
  }


}
