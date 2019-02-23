import { Component, OnInit } from '@angular/core';
import {Settings} from "./Settings";
import { TodoService} from "../todo.service";

@Component({
  selector: 'app-root',
  templateUrl: './settings.component.html',
  styleUrls: [ './settings.component.css' ],
  providers: [ TodoService ]
})
export class SettingsComponent implements OnInit {
  mydata: Settings;
  constructor(private todoService: TodoService) { }
  ngOnInit(): void {
    this.todoService.getSetts().subscribe(setts => this.mydata = setts);
  }
  updateStart(start){
    this.mydata.startT = start + "-00";
  }
  updateEnd(end){
    this.mydata.endT = end + "-00";
  }
  updateWait(waitting){
    this.mydata.waitT = waitting;
  }
  saveSetts(){
    this.todoService.updateSetts(this.mydata);
  }
}
