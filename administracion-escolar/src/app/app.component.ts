import { Component, OnInit } from '@angular/core';
import { SPService }  from '../app/services/sp.service';  
import { MenuAdministracionEscolar } from './dtos/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'administracion-escolar';
  menu:MenuAdministracionEscolar[]=[];
  userName;
  constructor(private spService: SPService){}

  ngOnInit(){
    this.spService.getSiteInfo().subscribe(
      (Response)=>{
        console.log('Respuesta: ' + Response);
        this.title=Response.Title;
      },err=>{
        console.log('error: '+ err);
      }
    )
    this.getCurrentUser();

    //this.getMenu();
  }

  getCurrentUser(){
    this.spService.getCurrentUser().subscribe(
      (Response)=>{
        this.userName=Response.Title;
      },err=>{
        console.log('Error obteniendo usuario');
      }
    )
  }

  getMenu(){
    this.spService.getMenu().subscribe(
      (Response)=>{
        Response.forEach(element => {
          this.menu.push(new MenuAdministracionEscolar(element.Title,element.Descripcion,element.ID));
        });
        console.log('menu: '+ this.menu);
      }, 
      err=>{
        console.log('err: '+err);
      }
    );
  }
}
