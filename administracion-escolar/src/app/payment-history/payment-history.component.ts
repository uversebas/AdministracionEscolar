import { Component, OnInit } from '@angular/core';
import { Student } from '../dtos/student';
import { PaymentConcept } from '../dtos/paymentConcept';
import { Month } from '../dtos/month';
import { Scholarship } from '../dtos/scholarship';
import { StudentPayment } from '../dtos/studentPayment';
import { ConceptStudent } from '../dtos/conceptStudent';
import { SPService } from '../services/sp.service';
import { Subject } from 'rxjs';
import { AppSettings } from '../shared/appSettings';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  student: Student;
  paymentConcepts:PaymentConcept[]=[];
  paymentConceptsStudent:PaymentConcept[]=[];
  months:Month[]=[];
  scholarshipList:Scholarship[]=[];
  studentPayments:StudentPayment[]=[];
  conceptsByStudent:ConceptStudent[]=[];

  constructor(private spService: SPService) { }

  ngOnInit() {
    this.configDataTable();
    this.getStudent();
  }

  getStudent(){
    this.student = JSON.parse(sessionStorage.getItem('student'));
    this.getStudentPaymentList();

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  private configDataTable() {
    this.dtOptions = AppSettings.getDataTableConfiguration();
  }

  getStudentPaymentList(){
    this.spService.getStudentPaymentExpandList(this.student.id).subscribe(
      (Response)=>{
        this.studentPayments = StudentPayment.fromJsonListExpan(Response);
        this.getPaymentConcepts();
      }
    )
  }

  getPaymentConcepts(){
    this.spService.getPaymentConceptList(this.student.stageSchoolId).subscribe(
      (Response)=>{
        this.paymentConcepts= PaymentConcept.fromJsonList(Response);
        this.getScholarshipList();
        this.getConceptsByStudent();
      }
    )
  }

  getScholarshipList(){
    this.spService.getScholarshipList(this.student.id).subscribe(
      (Response)=>{
        this.scholarshipList = Scholarship.fromJsonList(Response);
        
      }
    )
  }

  getConceptsByStudent(){
    this.spService.getConceptsByStudent(this.student.id).subscribe(
      (Response)=>{
        this.conceptsByStudent = ConceptStudent.fromJsonList(Response);
      }
    )
  }

}