import { Component, OnInit, OnDestroy } from '@angular/core';
import { SPService } from '../services/sp.service';
import { Subject } from 'rxjs';
import { StudentWithDebt } from '../dtos/StudentWithDebt';
import { ConceptStudent } from '../dtos/conceptStudent';
import { StudentPayment } from '../dtos/studentPayment';
import { StudentByDivision } from '../dtos/studentByDivision';
import { SummaryPayment } from '../dtos/summaryPayment';
import { AppSettings } from '../shared/appSettings';
import { StageSchool } from '../dtos/stageSchool';
import { PaymentConcept } from '../dtos/paymentConcept';
import { Month } from '../dtos/month';

@Component({
  selector: 'app-students-with-debt',
  templateUrl: './students-with-debt.component.html',
  styleUrls: ['./students-with-debt.component.css']
})
export class StudentsWithDebtComponent implements OnDestroy, OnInit  {
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  studentswithdebt: StudentWithDebt[]= [];
  studentswithdebtByDivision: StudentWithDebt[]= [];
  studentsFilter: StudentWithDebt[] = [];
  conceptsByStudent:ConceptStudent[]=[];
  studentPayments:StudentPayment[]=[];
  students: StudentByDivision[]= [];
  selectedStageSchool: StageSchool;
  stagesSchool: StageSchool[] = [];
  selectedPaymentConcepts: PaymentConcept[] = [];
  paymentConcepts: PaymentConcept[] = [];
  selectedMonth:Month;
  months:Month[]=[];
  public loading:boolean;
  showTable: boolean = false;

  constructor(private spService: SPService) {
    this.loading=true;
   }

  ngOnInit() {
    this.getStageSchool();
    this.getMonths();
    this.getStudentPaymentList();
  }

  private configDataTable() {
    this.dtOptions = null;
    this.dtOptions = AppSettings.getDataTableConfiguration();
  }

  getStageSchool() {
    this.spService.getStageShoolList().subscribe(
      (Response) => {
        this.stagesSchool = StageSchool.fromJsonList(Response);
      }
    )
  }

  getMonths(){
    this.spService.getMonthsList().subscribe(
      (Response)=>{
        this.months=Month.fromJsonList(Response);
      }
    )
  }

  selectConcept(concept:PaymentConcept){
    concept.checked = !concept.checked;
    this.getFilterStudent();
  }

  selectecMonth(){
    this.getFilterStudent();
  }

  getFilterStudent(){
    this.loading=true;
    this.configDataTable();
    this.dtOptions
    this.studentsFilter = StudentWithDebt.getStudentDebtFilter(this.studentswithdebt,this.paymentConcepts.filter(p=>p.checked),this.selectedMonth,null,this.studentPayments);
    
    setTimeout(() => {
      this.dtTrigger.next();
    }, 7000);
    this.loading=false;
    
  }

  selectStage() {
    this.loading=true;
    this.spService.getPaymentConceptList(this.selectedStageSchool.id).subscribe(
      (Response) => {
        this.paymentConcepts = PaymentConcept.fromJsonList(Response);
        this.getStudentByDivision();
        this.loading=false;
      }
    )
  }

  getStudentByDivision(){
    this.spService.getStudentsByDivisionList(this.selectedStageSchool.id).subscribe(
      (Response)=>{
        this.studentswithdebt = StudentWithDebt.fromJsonList(Response);
      }
    )
  }

  getSummaryPayment(conceptsByStudent, studentPayments){
    return SummaryPayment.getSummaryPaymentList(conceptsByStudent,studentPayments);
    
  }

  getStudentPaymentList(){
    this.spService.getStudenPaymentList().subscribe(
      (Response)=>{
        this.studentPayments = StudentPayment.fromJsonListExpan(Response);
        this.loading=false;
      },err=>{
        console.log('error obteniendo lista de pagos')
      }
    )
  }

  private getConcepts(student:StudentWithDebt){
    student.sumaryPayments.forEach(element => {
        if (element.conceptName === 'Colegiatura') {
            student.colegiatura = element.amount;
        }
        if (element.conceptName === 'Inscripción') {
          student.inscripcion = element.amount;
      }
      if (element.conceptName === 'Credencial') {
        student.credencial = element.amount;
    }
    });
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
                    this.getConcepts(student);
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
