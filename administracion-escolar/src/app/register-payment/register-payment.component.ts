import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SPService } from '../services/sp.service';
import { Student } from '../dtos/student';
import { StageSchool } from '../dtos/stageSchool';
import { Cycle } from '../dtos/cycle';
import { Grade } from '../dtos/grade';
import { Group } from '../dtos/group';
import { PaymentModality } from '../dtos/paymentModality';
import { PaymentConcept } from '../dtos/paymentConcept';
import { filter } from 'rxjs/operators';
import { Month } from '../dtos/month';
import { ReceivedPerson } from '../dtos/receivedPerson';
import { PaymentWay } from '../dtos/paymentWay';
import { StudentPayment } from '../dtos/studentPayment';
import { element } from 'protractor';

@Component({
  selector: 'app-register-payment',
  templateUrl: './register-payment.component.html',
  styleUrls: ['./register-payment.component.css']
})
export class RegisterPaymentComponent implements OnInit {

  registerPaymentForm: FormGroup;
  student: Student;
  currentUser:string;
  stagesSchool:StageSchool[]=[];
  stageSchool:StageSchool;
  cycles:Cycle[]=[];
  cycle:Cycle;
  grades:Grade[]=[];
  grade:Grade;
  groups:Group[]=[];
  group:Group;
  paymentModalities:PaymentModality[]=[];
  paymentModality:PaymentModality;
  paymentConcepts:PaymentConcept[]=[];
  paymentConceptsStudent:PaymentConcept[]=[];
  selectedPaymentConcept:PaymentConcept=new PaymentConcept('',0,0,'',false,false);
  months:Month[]=[];
  monthsPaymentModality:Month[]=[];
  selectedPaymentMonth:Month;
  receivedPersons:ReceivedPerson[]=[];
  selectedReceivedPerson:ReceivedPerson;
  paymentWays:PaymentWay[]=[];
  selectedPaymentWay:PaymentWay;
  studentPayments:StudentPayment[]=[];

  constructor(private formBuilder: FormBuilder, private spService: SPService) { }

  ngOnInit() {
    this.registerControlsForm();
    this.getCurrentUser();
    this.getStudent();
    this.getReceivedPerson();
    this.getPaymentWays();
    this.disabledControls();
    

    this.registerPaymentForm.setValue({
      paymentDateControl:new Date().toISOString(),
      entryDateControl:new Date().toISOString(),
      receivedPersonControl:'',
      paymentConceptControl:'',
      paymentMonthControl:'',
      paymentWayControl:'',
      referenceControl:'',
      quantityToPayControl:'',
      debtAmountControl:'',
      totalAmountToPayControl:'',
      amountToPayControl:'',
      newBalanceControl:'',
      paymentAgreementControl:'',
      observationControl:''
      
    });
  }
  disabledControls(){
    this.registerPaymentForm.controls['newBalanceControl'].disable();
    this.registerPaymentForm.controls['totalAmountToPayControl'].disable();
    this.registerPaymentForm.controls['debtAmountControl'].disable();
  }

  calculatePayment(){
    if (this.selectedPaymentConcept.id && this.selectedPaymentConcept.id>0) {
      let amount = this.registerPaymentForm.controls.quantityToPayControl.value;
      let debt = this.registerPaymentForm.controls.debtAmountControl.value;
      this.registerPaymentForm.controls.totalAmountToPayControl.setValue(debt - amount);
    }
  }

  get f(){return this.registerPaymentForm.controls}

  getStudent(){
    this.student = JSON.parse(sessionStorage.getItem('student'));
    this.getStudentPaymentList();
    this.getActiveCycleList();
    this.getGradeList();
    this.getPaymentModalityList();

  }

  getStudentPaymentList(){
    this.spService.getStudentPaymentList(this.student.id).subscribe(
      (Response)=>{
        this.studentPayments = StudentPayment.fromJsonList(Response);
        this.getStageSchool();
      }
    )
  }

  selectecPaymentConcept(){
    let paymentUntilNow= this.getPaymentUntilNow(this.selectedPaymentConcept)
    let debt = this.selectedPaymentConcept.amount - paymentUntilNow;
    this.registerPaymentForm.controls.debtAmountControl.setValue(debt);
  }

  getPaymentWays(){
    this.spService.getPaymentWaysList().subscribe(
      (Response)=>{
        this.paymentWays= PaymentWay.fromJsonList(Response);
      }
    )
  }

  getCurrentUser(){
    this.currentUser = sessionStorage.getItem('currentUserName');
  }

  getReceivedPerson(){
    this.spService.getReceivedPersonList().subscribe(
      (Response)=>{
        this.receivedPersons=ReceivedPerson.fromJsonList(Response);
      }
    )
  }
  getActiveCycleList(){
    this.spService.getActiveCycle().subscribe(
      (Response)=>{
        this.cycles= Cycle.fromJsonList(Response);
        this.cycle=this.cycles.find(c => c.id===this.student.cycleId);
      }
    )
  }

  getGradeList(){
    this.spService.getGradeList().subscribe(
      (Response)=>{
        this.grades=Grade.fromJsonList(Response);
        this.grade=this.grades.find(g => g.id === this.student.gradeId);
        this.getGruopList();
      }
    )
  }

  getGruopList(){
    this.spService.getGroupByGradeId(this.grade.id).subscribe(
      (Response)=>{
        this.groups=Group.fromJsonList(Response);
        this.group = this.groups.find(g => g.id === this.student.groupId);
      }
    )
  }

  getStageSchool(){
    this.spService.getStageShoolList().subscribe(
      (Response)=>{
        this.stagesSchool = StageSchool.fromJsonList(Response);
        this.stageSchool = this.stagesSchool.find(s => s.id===this.student.stageSchoolId);
        this.getPaymentConcepts();
      }
    )
  }

  getPaymentConcepts(){
    this.spService.getPaymentConceptList(this.stageSchool.id).subscribe(
      (Response)=>{
        this.paymentConcepts= PaymentConcept.fromJsonList(Response);
        this.getRemainingPaymentConcepts();
      }
    )
  }

  private getRemainingPaymentConcepts() {
    this.paymentConceptsStudent = new Array();
    this.paymentConcepts.forEach( pc => {
      this.student.paymentConceptIds.forEach(spc => {
        if (pc.id === spc) {
          let totalAmoun = 0;
          totalAmoun = this.getPaymentUntilNow(pc);
          if (totalAmoun < pc.amount) {
            this.paymentConceptsStudent.push(pc);
          }
        }
      });
    });
  }

  private getPaymentUntilNow(concept: PaymentConcept) {
    let totalAmoun = 0;
    for (let j = 0; j < this.studentPayments.length; j++) {
      const payment = this.studentPayments[j];
      if (concept.id === payment.conceptId) {
        totalAmoun += payment.amount;
      }
    }
    return totalAmoun;
  }

  getPaymentModalityList(){
    this.spService.getPaymentModalityList().subscribe(
      (Response)=>{
        this.paymentModalities = PaymentModality.fromJsonList(Response);
        this.paymentModality = this.paymentModalities.find(p => p.id === this.student.paymentMadalityId);
        this.getMonths();
      }
    )
  }

  getMonths(){
    this.spService.getMonthsList().subscribe(
      (Response)=>{
        this.months=Month.fromJsonList(Response);
        this.monthsPaymentModality = new Array();
        this.months.forEach(m => {
          this.paymentModality.monthsIds.forEach(pm => {
            if (m.id === pm) {
              this.monthsPaymentModality.push(m);
            }
          });
        });
      }
    )
  }

  private registerControlsForm() {
    this.registerPaymentForm = this.formBuilder.group({
      paymentDateControl:['',Validators.required],
      entryDateControl:['',Validators.required],
      receivedPersonControl:['',Validators.required],
      paymentConceptControl:['',Validators.required],
      paymentMonthControl:['',Validators.required],
      paymentWayControl:['',Validators.required],
      referenceControl:[''],
      quantityToPayControl:['',Validators.required],
      debtAmountControl:[''],
      totalAmountToPayControl:[''],
      amountToPayControl:[''],
      newBalanceControl:[''],
      paymentAgreementControl:[''],
      observationControl:['']
    });
  }

}
