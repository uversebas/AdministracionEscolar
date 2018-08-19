import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { EnrollStudentComponent } from './enroll-student/enroll-student.component';
import { UpdateStudentComponent } from './update-student/update-student.component';
import { ReEnrollStudentComponent } from './re-enroll-student/re-enroll-student.component';
import { RegisterPaymentComponent } from './register-payment/register-payment.component';
import { SearchStudentComponent } from './search-student/search-student.component';
import { AssingScholarshipComponent } from './assing-scholarship/assing-scholarship.component';

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
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
