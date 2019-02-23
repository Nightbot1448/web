import { Broker} from "./broker/Broker";
import { Stocks } from "./stock/Stocks";
import { Settings } from "./settings/Settings";
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';


@Injectable()
export class TodoService {
  constructor(private http: HttpClient) {
  }
  getBrokers() {
    return this.http.get<Broker[]>('/api/broker');
  }
  getSetts() {
    return this.http.get<Settings>('/api/setts');
  }
  getAkcii() {
    return this.http.get<Stocks[]>('/api/trade');
  }
  updateBrokers(brokers: Broker[]){
    this.http.put('/api/broker',brokers).subscribe();
  }
  updateAkcii(akcii: Stocks[]){
    this.http.put('/api/akcii',akcii).subscribe();
  }
  updateSetts(setts: Settings){
    this.http.put('/api/setts',setts).subscribe();
  }
}
