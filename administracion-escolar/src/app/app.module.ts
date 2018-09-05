import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {RouterModule} from '@angular/router';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { EnrollStudentComponent } from './enroll-student/enroll-student.component';
import { UpdateStudentComponent } from './update-student/update-student.component';
import { ReEnrollStudentComponent } from './re-enroll-student/re-enroll-student.component';
import { RegisterPaymentComponent } from './register-payment/register-payment.component';
import { SearchStudentComponent } from './search-student/search-student.component';
import { AssingScholarshipComponent } from './assing-scholarship/assing-scholarship.component';

import { SPService } from '../app/services/sp.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatTabsModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    EnrollStudentComponent,
    UpdateStudentComponent,
    ReEnrollStudentComponent,
    RegisterPaymentComponent,
    SearchStudentComponent,
    AssingScholarshipComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    NgxSpinnerModule,
    MatTabsModule,
    ModalModule.forRoot(),
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
  providers: [SPService, MatDatepickerModule,{provide: MAT_DATE_LOCALE, useValue: 'es-US'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
