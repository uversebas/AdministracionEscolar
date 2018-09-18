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
  public loading:boolean;
  constructor(private spService: SPService, private router: Router) {
    this.loading = true;
   }

  ngOnInit() {
    this.getMenu();
  }

  getMenu(){
    this.spService.getMenu().subscribe(
      (Response)=>{
        this.menu = MenuAdministracionEscolar.fromJsonList(Response);
        this.loading = false;
      }, 
      err=>{
        console.log('err: '+err);
        this.loading = false;
      }
    );
  }

  menuOptionClick(item){
    if (item.RouterFinal) {
      sessionStorage.setItem('routerFinal',item.RouterFinal);
    }
    if (item.FiltroDivision) {
      sessionStorage.setItem('filtroDivision',item.FiltroDivision);
    }
    this.router.navigate([item.NombreRouter]);
  }

}
