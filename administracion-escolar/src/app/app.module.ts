import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { EnrollStudentComponent } from './enroll-student/enroll-student.component';
import { UpdateStudentComponent } from './update-student/update-student.component';
import { ReEnrollStudentComponent } from './re-enroll-student/re-enroll-student.component';
import { RegisterPaymentComponent } from './register-payment/register-payment.component';
import { SearchStudentComponent } from './search-student/search-student.component';
import { AssingScholarshipComponent } from './assing-scholarship/assing-scholarship.component';

import { SPService } from '../app/services/sp.service';
import { adminLteConf } from './admin-lte.conf';
import { LayoutModule } from 'angular-admin-lte';
import { BoxModule, BoxSmallModule as MkBoxSmallModule } from 'angular-admin-lte'; 

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    EnrollStudentComponent,
    UpdateStudentComponent,
    ReEnrollStudentComponent,
    RegisterPaymentComponent,
    SearchStudentComponent,
    AssingScholarshipComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    BoxModule,
    MkBoxSmallModule,
    LayoutModule.forRoot(adminLteConf),
    RouterModule.forRoot([
      {path:'',redirectTo:'/menu',pathMatch:'full'},
      {path:'menu',component:MainMenuComponent},
      {path:'registrar-alumno', component:EnrollStudentComponent},
      {path:'registrar-pago', component:RegisterPaymentComponent},
      {path:'actualizar-alumno', component:UpdateStudentComponent},
      {path:'reeinscribir-alumno', component:ReEnrollStudentComponent},
      {path:'beca', component:AssingScholarshipComponent},
      {path:'buscar-alumno', component:SearchStudentComponent}
    ])
  ],
  providers: [SPService],
  bootstrap: [AppComponent]
})
export class AppModule { }
