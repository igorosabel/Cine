import { Injectable } from '@angular/core';

@Injectable()
export class DataShareService {
  globals = {};

  constructor() { }
  
  setGlobal(key: string, value: any){
    this.globals[key] = value;
  }
  
  getGlobal(key:string){
    if (!this.globals[key]){
      return null;
    }
    return this.globals[key];
  }
  
  removeGlobal(key:string){
    if (this.globals[key]){
		  delete this.globals[key];
    }
  }
  
  resetGlobals(){
    this.globals = {};
  }
}