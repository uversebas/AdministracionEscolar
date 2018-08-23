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
  userName;
  constructor(private spService: SPService){}

  ngOnInit(){
    this.spService.getSiteInfo().subscribe(
      (Response)=>{
        this.title=Response.Title;
      },err=>{
        console.log('error: '+ err);
      }
    )
    this.getCurrentUser();
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
}
