import { Injectable } from '@angular/core';
import pnp from 'sp-pnp-js';
import { environment } from '../../environments/environment';
import { from } from 'rxjs';

@Injectable()
export class SPService {
  constructor() {}

  private getConfig(){
      const mySp = pnp.sp.configure({
          headers:{
              "Accept":"application/json; odata=verbose"
          }
      },environment.web);

      return mySp;
  }

  getSiteInfo(){
      let data = from(this.getConfig().web.get());
      return data;
  }

  getCurrentUser(){
      let data = from(this.getConfig().web.currentUser.get());
      return data;
  }

  getMenu(){
      let data = from(this.getConfig().web.lists.getByTitle(environment.menuList).items.getAll());
      return data;
  }
}