import { Component, OnInit } from '@angular/core';
import { SPService } from '../app/services/sp.service';
import { MenuAdministracionEscolar } from './dtos/menu';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'administracion-escolar';
  userName;
  constructor(private spService: SPService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 2000);

    this.spService.getSiteInfo().subscribe(
      (Response) => {
        this.title = Response.Title;
      }, err => {
        console.log('error: ' + err);
      }
    )
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.spService.getCurrentUser().subscribe(
      (Response) => {
        this.userName = Response.Title;
      }, err => {
        console.log('Error obteniendo usuario');
      }
    )
  }
}
