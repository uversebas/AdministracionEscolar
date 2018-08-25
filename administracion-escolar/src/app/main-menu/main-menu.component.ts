import { Component, OnInit } from '@angular/core';
import { SPService }  from '../services/sp.service';
import { MenuAdministracionEscolar } from '../dtos/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  menu:MenuAdministracionEscolar[]=[];
  constructor(private spService: SPService, private router: Router) { }

  ngOnInit() {
    this.getMenu();
  }

  getMenu(){
    this.spService.getMenu().subscribe(
      (Response)=>{
        this.menu = MenuAdministracionEscolar.fromJsonList(Response);
      }, 
      err=>{
        console.log('err: '+err);
      }
    );
  }

  menuOptionClick(item){
    if (item.RouterFinal) {
      sessionStorage.setItem('routerFinal',item.RouterFinal);
    }
    this.router.navigate([item.NombreRouter]);
  }

}
