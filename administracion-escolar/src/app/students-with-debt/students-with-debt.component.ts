import { Component, OnInit, OnDestroy } from '@angular/core';
import { SPService } from '../services/sp.service';
import { Subject } from 'rxjs';
import { StudentWithDebt } from '../dtos/StudentWithDebt';
import { ConceptStudent } from '../dtos/conceptStudent';
import { StudentPayment } from '../dtos/studentPayment';
import { StudentByDivision } from '../dtos/studentByDivision';
import { SummaryPayment } from '../dtos/summaryPayment';
import { AppSettings } from '../shared/appSettings';

@Component({
  selector: 'app-students-with-debt',
  templateUrl: './students-with-debt.component.html',
  styleUrls: ['./students-with-debt.component.css']
})
export class StudentsWithDebtComponent implements OnDestroy, OnInit  {
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  studentswithdebt: StudentWithDebt[]= [];
  conceptsByStudent:ConceptStudent[]=[];
  studentPayments:StudentPayment[]=[];
  students: StudentByDivision[]= [];
  public loading:boolean;

  constructor(private spService: SPService) {
    this.loading=true;
   }

  ngOnInit() {
    this.configDataTable();
    this.getAllStudents();
  }

  private configDataTable() {
    this.dtOptions = AppSettings.getDataTableConfiguration();
  }

  getAllStudents(){
    this.spService.getAllStudentList().subscribe(
      (Response)=>{
        this.studentswithdebt = StudentWithDebt.fromJsonList(Response);
        this.getStudentsDebt();
      }
    )
  }

  getSummaryPayment(conceptsByStudent, studentPayments){
    return SummaryPayment.getSummaryPaymentList(conceptsByStudent,studentPayments);
    
  }

  getStudentsDebt(){
    for (let index = 0; index < this.studentswithdebt.length; index++) {
      const student = this.studentswithdebt[index];
      this.spService.getConceptsByStudent(student.id).subscribe(
        (Response)=>{
          let concepstByStudent = ConceptStudent.fromJsonList(Response);
          if (concepstByStudent.length>0) {
              this.spService.getStudentPaymentExpandList(student.id).subscribe(
                (Response)=>{
                  let studentPayments = StudentPayment.fromJsonListExpan(Response);
                  if (studentPayments.length>0) {
                    student.sumaryPayments = this.getSummaryPayment(concepstByStudent,studentPayments);
                    let notDebt = false;
                    for (let j = 0; j < student.sumaryPayments.length; j++) {
                      const payment = student.sumaryPayments[j];
                      if (!payment.isPayment) {
                        notDebt=true;
                        break;
                      }
                    }
                    if (!notDebt) {
                      this.studentswithdebt.splice(index,1);
                    }
                  }
                }
              )
          }
        }
      )
    }
    this.dtTrigger.next();
    this.loading=false;
  }

  getConceptsByStudent(stundetId:number){
    this.spService.getConceptsByStudent(stundetId).subscribe(
      (Response)=>{
        this.conceptsByStudent = ConceptStudent.fromJsonList(Response);
        if (this.conceptsByStudent.length>0) {
          this.getPaymentByStudent(stundetId)
        }
        
      }
    )
  }

  getPaymentByStudent(stundetId:number){
    this.spService.getStudentPaymentExpandList(stundetId).subscribe(
      (Response)=>{
        this.studentPayments = StudentPayment.fromJsonListExpan(Response);
      }
    )
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
