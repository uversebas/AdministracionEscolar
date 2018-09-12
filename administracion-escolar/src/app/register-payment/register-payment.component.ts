import { Component, OnInit, TemplateRef } from '@angular/core';
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
import { ConceptStudent } from '../dtos/conceptStudent';
import { Scholarship } from '../dtos/scholarship';
import { StatusScholarship } from '../dtos/statusScholarship';
import { ItemAddResult } from 'sp-pnp-js';

@Component({
  selector: 'app-register-payment',
  templateUrl: './register-payment.component.html',
  styleUrls: ['./register-payment.component.css']
})
export class RegisterPaymentComponent implements OnInit {

  submitted = false;
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
  selectedPaymentConcept:PaymentConcept=new PaymentConcept('',0,0,'',false,false,0,false);
  months:Month[]=[];
  monthsPaymentModality:Month[]=[];
  remainingPaymentMonths:Month[]=[];
  selectedPaymentMonth:Month= new Month('',0);
  receivedPersons:ReceivedPerson[]=[];
  selectedReceivedPerson:ReceivedPerson;
  paymentWays:PaymentWay[]=[];
  selectedPaymentWay:PaymentWay;
  studentPayments:StudentPayment[]=[];
  conceptsByStudent:ConceptStudent[]=[];
  totalDebt:number=0;
  currentStatusScholarship:StatusScholarship;
  paymentDay;

  scholarshipList:Scholarship[]=[];
  statusScholarshipList:StatusScholarship[]=[];

  previousBalance='Abono Anterior';

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

  getScholarshipStatus(){
    this.spService.getScholarshipStatus().subscribe(
      (Response)=>{
        this.statusScholarshipList = StatusScholarship.fromJsonList(Response);
        this.scholarshipList.forEach(element => {
          
          this.paymentConcepts.forEach(concept =>{
            if (element.id === concept.id) {
              element.conceptName = concept.title;
            }
          })
        });
        this.currentStatusScholarship = this.statusScholarshipList.find(s => s.id === this.scholarshipList[0].statusId);
        this.paymentDay = this.scholarshipList[0].paymentDay;
      }
    )
  }

  disabledControls(){
    this.registerPaymentForm.controls['quantityToPayControl'].disable();
    this.registerPaymentForm.controls['debtAmountControl'].disable();
    this.registerPaymentForm.controls['totalAmountToPayControl'].disable();
    this.registerPaymentForm.controls['newBalanceControl'].disable();

  }

  calculatePayment(){
    if (this.selectedPaymentConcept.dues) {
      let totalAmountToPay = this.registerPaymentForm.controls.totalAmountToPayControl.value;
      let amountToPay = this.registerPaymentForm.controls.amountToPayControl.value;
      let newBalance = totalAmountToPay-amountToPay;
      if (newBalance>this.selectedPaymentConcept.amount) {
        this.registerPaymentForm.controls.amountToPayControl.setValue(0);
        this.registerPaymentForm.controls.newBalanceControl.setValue(0);
      }else{
        this.registerPaymentForm.controls.newBalanceControl.setValue(newBalance);
      }
    }else{
      let totalAmountToPay = this.registerPaymentForm.controls.totalAmountToPayControl.value;
      let amountToPay = this.registerPaymentForm.controls.amountToPayControl.value;
      let newBalance = totalAmountToPay-amountToPay;
      if (newBalance<0) {
        this.registerPaymentForm.controls.amountToPayControl.setValue(0);
        this.registerPaymentForm.controls.newBalanceControl.setValue(0);
      }else{
        this.registerPaymentForm.controls.newBalanceControl.setValue(newBalance);
      }
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
    this.clearValueControls();
    if (this.selectedPaymentConcept.dues) {
      this.registerPaymentForm.controls.paymentMonthControl.setValidators([Validators.required]);
      this.previousBalance='Adeudo anterior';
      let modalityStudent = this.conceptsByStudent.find(c => c.conceptId === this.selectedPaymentConcept.id);
      this.paymentModality = this.paymentModalities.find(p => p.id === modalityStudent.paymentModalityId);
      this.selectedPaymentMonth=new Month('',0);
      this.getMonths();
    }else{
      this.registerPaymentForm.controls.paymentMonthControl.clearValidators();
      this.previousBalance='Abono anterior';
      this.registerPaymentForm.controls.quantityToPayControl.setValue(this.selectedPaymentConcept.amount);
      let paymentUntilNow= this.getPaymentUntilNow(this.selectedPaymentConcept);
      this.registerPaymentForm.controls.debtAmountControl.setValue(paymentUntilNow);
      this.registerPaymentForm.controls.totalAmountToPayControl.setValue(this.selectedPaymentConcept.amount-paymentUntilNow);
    }
  }

  selectecMonth(){
    this.clearValueControls();
    if (this.selectedPaymentConcept.id > 0 && this.selectedPaymentConcept.dues) {
      let amount = this.getAmountFee();
      this.registerPaymentForm.controls.quantityToPayControl.setValue(amount);
      let paymentUntilNow = this.getPaymentUntilNowTermsConcepts(this.selectedPaymentMonth);
      let deb = 0;
      if (paymentUntilNow>0) {
        deb = amount-paymentUntilNow;
      }
      this.registerPaymentForm.controls.debtAmountControl.setValue(this.totalDebt);
      this.registerPaymentForm.controls.totalAmountToPayControl.setValue(this.totalDebt+ amount);
    }
  }

  clearValueControls(){
    this.registerPaymentForm.controls.amountToPayControl.setValue('');
    this.registerPaymentForm.controls.newBalanceControl.setValue('');
    this.registerPaymentForm.controls.debtAmountControl.setValue('');
    this.registerPaymentForm.controls.totalAmountToPayControl.setValue('');
    this.registerPaymentForm.controls.quantityToPayControl.setValue('');
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
        this.getScholarshipList();
        this.getConceptsByStudent();
      }
    )
  }

  getScholarshipList(){
    this.spService.getScholarshipList(this.student.id).subscribe(
      (Response)=>{
        this.scholarshipList = Scholarship.fromJsonList(Response);
        this.getScholarshipStatus()
        
      }
    )
  }

  getConceptsByStudent(){
    this.spService.getConceptsByStudent(this.student.id).subscribe(
      (Response)=>{
        this.conceptsByStudent = ConceptStudent.fromJsonList(Response);
        this.getRemainingPaymentConcepts();
      }
    )
  }

  private getRemainingPaymentConcepts() {
    this.paymentConceptsStudent = new Array();
    this.paymentConcepts.forEach( pc => {
      this.conceptsByStudent.forEach(spc => {
        if (pc.id === spc.conceptId) {
          let totalAmount = 0;
          totalAmount = this.getPaymentUntilNow(pc);
          if (totalAmount < pc.amount) {
            this.paymentConceptsStudent.push(pc);
          }
        }
      });
    });
  }

  private getPaymentUntilNow(concept: PaymentConcept) {
    let totalAmount = 0;
    for (let j = 0; j < this.studentPayments.length; j++) {
      const payment = this.studentPayments[j];
      if (concept.id === payment.conceptId) {
        totalAmount += payment.amount;
      }
    }
    return totalAmount;
  }

  private getPaymentUntilNowTermsConcepts(month: Month){
    let totalAmount = 0;
    this.studentPayments.forEach(payment => {
      if (payment.monthId) {
        if ((this.selectedPaymentConcept.id === payment.conceptId)&&(payment.monthId === month.id)) {
          totalAmount += payment.amount;
        }
      }
    });
    return totalAmount;
  }

  loadRemainingMonths(){
    this.totalDebt=0;
    this.remainingPaymentMonths = new Array();
    let fee = this.getAmountFee();
    this.monthsPaymentModality.forEach(month => {
        let amount = 0;
        amount = this.getPaymentUntilNowTermsConcepts(month);
        if (amount===0) {
          this.remainingPaymentMonths.push(month);
        }
        if (amount>0 && amount<fee) {
          let debt =  fee - amount;
          this.totalDebt += debt;
        }
    });
  }

  getAmountFee(){
    let counterFee = this.paymentModality.monthCounter;
    return this.selectedPaymentConcept.amount/counterFee;
  }

  getPaymentModalityList(){
    this.spService.getPaymentModalityList().subscribe(
      (Response)=>{
        this.paymentModalities = PaymentModality.fromJsonList(Response);
        this.paymentModality = this.paymentModalities.find(p => p.id === this.student.paymentMadalityId);
        
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
        this.loadRemainingMonths();
      }
    )
  }

  private registerControlsForm() {
    this.registerPaymentForm = this.formBuilder.group({
      paymentDateControl:['',Validators.required],
      entryDateControl:['',Validators.required],
      receivedPersonControl:['',Validators.required],
      paymentConceptControl:['',Validators.required],
      paymentMonthControl:[''],
      paymentWayControl:['',Validators.required],
      referenceControl:[''],
      quantityToPayControl:[''],
      debtAmountControl:[''],
      totalAmountToPayControl:[''],
      amountToPayControl:['',[Validators.required, Validators.min(1)]],
      newBalanceControl:[''],
      paymentAgreementControl:[''],
      observationControl:['']
    });
  }

  onSubmit(template:TemplateRef<any>){
    this.submitted=true;
    if (this.registerPaymentForm.invalid) {
      return;
    }
    let quantityToPay = this.registerPaymentForm.controls.quantityToPayControl.value;
    let amountToPay = this.registerPaymentForm.controls.amountToPayControl.value;
    //let totalAmountToPay = this.registerPaymentForm.controls.totalAmountToPayControl.value;
    let newBalance = this.registerPaymentForm.controls.newBalanceControl.value;
    let debtAmount = this.registerPaymentForm.controls.debtAmountControl.value;
    
    if (this.selectedPaymentConcept.dues) {
      if (debtAmount===0 && newBalance === 0) {
        this.addPaymentStudentConceptDues(amountToPay,this.selectedPaymentMonth.id);
      }else{
        if (debtAmount>0) {
          let restAmount = amountToPay - debtAmount;
          let newDebt= debtAmount;
          this.studentPayments.forEach(payment => {
            if ((newDebt>0)&&(this.selectedPaymentConcept.id === payment.conceptId && payment.amount < quantityToPay)) {
              let newAmount = newDebt + payment.amount;
              if (newAmount<=quantityToPay) {
                newDebt = 0;
                this.updatePaymentStudentConceptDues(newAmount, payment.id);
              }
              if(newAmount>quantityToPay){
                newDebt = newDebt - quantityToPay;
                this.updatePaymentStudentConceptDues(quantityToPay, payment.id);
              }
            }
          });
          if(restAmount>0){
            restAmount = this.inprovePayment(restAmount, quantityToPay);
          }
        }else{
          this.inprovePayment(amountToPay, quantityToPay);
        }
      }
    }else{
      this.addPaymentStudentConceptNotDues(amountToPay);
    }
  }

  private inprovePayment(restAmount: number, quantityToPay: any) {
    this.remainingPaymentMonths.forEach(month => {
      if (restAmount > 0) {
          let newAmount = restAmount;
          if (newAmount <= quantityToPay) {
            restAmount=0;
            this.addPaymentStudentConceptDues(newAmount, month.id);
          }else{
            restAmount = restAmount - quantityToPay;
            this.addPaymentStudentConceptDues(quantityToPay, month.id);
            }
        }
    });
    return restAmount;
  }

  addPaymentStudentConceptNotDues(amountToPay:number){
    this.spService.addPaymentStudent(this.student.id, this.selectedPaymentConcept.id,amountToPay).then(
      (iar:ItemAddResult)=>{
        
      },err=>{

      }
    )
  }

  addPaymentStudentConceptDues(amountToPay:number, monthId:number){
    this.spService.addPaymentStudentWithMont(this.student.id, this.selectedPaymentConcept.id,amountToPay,monthId).then(
      (iar:ItemAddResult)=>{
        
      },err=>{

      }
    )
  }

  updatePaymentStudentConceptDues(amountToPay:number,paymentId:number){
    this.spService.updatePaymentStudentConceptDues(amountToPay,paymentId)
  }

}
