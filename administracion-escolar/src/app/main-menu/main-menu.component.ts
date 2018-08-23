import { Component, OnInit } from '@angular/core';
import { SPService }  from '../services/sp.service';
import { MenuAdministracionEscolar } from '../dtos/menu';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  menu:MenuAdministracionEscolar[]=[];
  constructor(private spService: SPService) { }

  ngOnInit() {
    this.getMenu();
  }

  getMenu(){
    this.spService.getMenu().subscribe(
      (Response)=>{
        Response.forEach(element => {
          this.menu.push(new MenuAdministracionEscolar(element.Title,element.Descripcion,element.NombreRouter,element.ImagenMenu.Url,element.ID));
        });
      }, 
      err=>{
        console.log('err: '+err);
      }
    );
  }

}
