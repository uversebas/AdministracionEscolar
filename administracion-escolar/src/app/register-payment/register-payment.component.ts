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
import { Month } from '../dtos/month';
import { ReceivedPerson } from '../dtos/receivedPerson';
import { PaymentWay } from '../dtos/paymentWay';
import { StudentPayment } from '../dtos/studentPayment';
import { ConceptStudent } from '../dtos/conceptStudent';
import { Scholarship } from '../dtos/scholarship';
import { StatusScholarship } from '../dtos/statusScholarship';
import { ItemAddResult } from 'sp-pnp-js';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

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
  paymentDay = 0;
  studentHasSholarship=false;

  scholarshipList:Scholarship[]=[];
  statusScholarshipList:StatusScholarship[]=[];
  currentDay;
  alertScholarshipDay = false;
  conceptAmount = 0;

  public successCreateRegisterPaymentModal:BsModalRef;

  previousBalance='Abono Anterior';
  public loading:boolean;

  constructor(private formBuilder: FormBuilder, private spService: SPService, private modalService: BsModalService, private router: Router) {
    this.loading=true;
    this.currentDay = new Date().getDate();
    console.log(this.currentDay);
   }

  ngOnInit() {
    this.registerControlsForm();
    this.getCurrentUser();
    this.getStudent();
    this.getReceivedPerson();
    this.getPaymentWays();
    this.disabledControls();
    
  }

  private loadValues() {
    this.registerPaymentForm.setValue({
      paymentDateControl: new Date().toISOString(),
      entryDateControl: new Date().toISOString(),
      receivedPersonControl: this.receivedPersons.find(p => p.loadDefault),
      paymentConceptControl: '',
      paymentMonthControl: '',
      paymentWayControl: '',
      referenceControl: '',
      quantityToPayControl: '',
      debtAmountControl: '',
      totalAmountToPayControl: '',
      amountToPayControl: '',
      newBalanceControl: '',
      paymentAgreementControl: '',
      observationControl: ''
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
    this.conceptAmount=this.selectedPaymentConcept.amount;
    if (this.selectedPaymentConcept.dues) {
      this.registerPaymentForm.controls.paymentMonthControl.setValidators([Validators.required]);
      this.previousBalance='Adeudo anterior';
      let modalityStudent = this.conceptsByStudent.find(c => c.conceptId === this.selectedPaymentConcept.id);
      this.paymentModality = this.paymentModalities.find(p => p.id === modalityStudent.paymentModalityId);
      this.conceptAmount = this.selectedPaymentConcept.amount/this.paymentModality.monthCounter;
      this.selectedPaymentMonth=new Month('',0);
      this.getMonths();
    }else{
      this.registerPaymentForm.controls.paymentMonthControl.clearValidators();
      this.previousBalance='Abono anterior';
      let scholarshipAmount = this.validateScholarshipConcept(this.selectedPaymentConcept);
      let quantityToPay = 0;
      if (scholarshipAmount>0) {
        quantityToPay = scholarshipAmount;
      }else{
        quantityToPay = this.selectedPaymentConcept.amount;
      }
      this.registerPaymentForm.controls.quantityToPayControl.setValue(quantityToPay);
      let paymentUntilNow= this.getPaymentUntilNow(this.selectedPaymentConcept);
      this.registerPaymentForm.controls.debtAmountControl.setValue(paymentUntilNow);
      this.registerPaymentForm.controls.totalAmountToPayControl.setValue(quantityToPay-paymentUntilNow);
    }
  }

  validateScholarshipConcept(concept:PaymentConcept){
    let scholarshipAmount = 0
    let scholarship = this.scholarshipList.find(s => s.conceptId === concept.id && s.statusId === 1);
    if (scholarship) {
      scholarshipAmount = scholarship.amount;
      if(this.currentDay > this.paymentDay){
        this.alertScholarshipDay = true;
      }
    }
    return scholarshipAmount;
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
    this.alertScholarshipDay = false;
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
        this.loadValues();
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
        if (this.scholarshipList.length>0) {
          this.studentHasSholarship=true;
          this.getScholarshipStatus()
        }
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
          if (pc.dues) {
            let totalAmount = 0;
            totalAmount = this.getPaymentUntilNow(pc);
            if (totalAmount < pc.amount) {
            this.paymentConceptsStudent.push(pc);
            }
          }else{
            let isPayment = false;
            isPayment = this.isConceptCompleted(pc);
            if (!isPayment) {
              this.paymentConceptsStudent.push(pc);
            }
          }
        }
      });
    });
    this.loading=false;
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

  private isConceptCompleted(concept){
    let isPayment = false;
    for (let j = 0; j < this.studentPayments.length; j++) {
      const payment = this.studentPayments[j];
      if (concept.id === payment.conceptId) {
        isPayment = payment.isPayment;
      }
    }
    return isPayment;
  }

  private isConceptMonthCompleted(concept, monthId){
    let isPayment = false;
    for (let j = 0; j < this.studentPayments.length; j++) {
      const payment = this.studentPayments[j];
      if (concept.id === payment.conceptId && payment.monthId === monthId) {
        isPayment = payment.isPayment;
      }
    }
    return isPayment;
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
    let scholarship = this.scholarshipList.find(s => s.conceptId === this.selectedPaymentConcept.id);
    let fee = this.getAmountFee();
    this.monthsPaymentModality.forEach(month => {
        let amount = 0;
        let isCompleted = this.isConceptMonthCompleted(this.selectedPaymentConcept,month.id);
        amount = this.getPaymentUntilNowTermsConcepts(month);
        if (amount === 0) {
          this.remainingPaymentMonths.push(month);
        }
        if (amount>0 && amount<fee) {
          if (!isCompleted) {
            let debt =  fee - amount;
            this.totalDebt += debt;
          }
        }
    });
  }

  getAmountFee(){
    let scholarship = this.scholarshipList.find(s => s.conceptId === this.selectedPaymentConcept.id && s.statusId === 1);
    if (scholarship) {
      if (this.currentDay>this.paymentDay) {
        this.alertScholarshipDay = true;
      }
      return scholarship.amount;
    }else{
      let counterFee = this.paymentModality.monthCounter;
      return this.selectedPaymentConcept.amount/counterFee;
    }

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

  closeSuccessRegisterPaymentModal(){
    this.router.navigate(['/menu']);
    this.successCreateRegisterPaymentModal.hide();
  }

  otherPay(){
    this.successCreateRegisterPaymentModal.hide();
    window.location.reload();
  }

  backMenu(){
    this.router.navigate(['/menu']);
  }

  onSubmit(template:TemplateRef<any>){
    this.submitted=true;
    if (this.registerPaymentForm.invalid) {
      return;
    }
    this.loading=true;
    let paymentDate = new Date(this.registerPaymentForm.controls.paymentDateControl.value);
    let registerDate = new Date(this.registerPaymentForm.controls.entryDateControl.value);
    let receivedPersonId = this.registerPaymentForm.controls.receivedPersonControl.value.id;
    let paymentWayId = this.registerPaymentForm.controls.paymentWayControl.value.id;
    let reference = this.registerPaymentForm.controls.referenceControl.value;
    let paymentAgreement = this.registerPaymentForm.controls.paymentAgreementControl.value;
    let observation = this.registerPaymentForm.controls.observationControl.value;

    let quantityToPay = this.registerPaymentForm.controls.quantityToPayControl.value;
    let amountToPay = this.registerPaymentForm.controls.amountToPayControl.value;
    let totalAmountToPay = this.registerPaymentForm.controls.totalAmountToPayControl.value;
    let newBalance = this.registerPaymentForm.controls.newBalanceControl.value;
    let debtAmount = this.registerPaymentForm.controls.debtAmountControl.value;
    
    if (this.selectedPaymentConcept.dues) {
      if (debtAmount===0 && newBalance === 0) {
        this.addPaymentStudentConceptDues(amountToPay,this.selectedPaymentMonth.id, paymentDate.toISOString(), registerDate.toISOString(), receivedPersonId, paymentWayId,reference,paymentAgreement,observation, true);
      }else{
        if (debtAmount>0) {
          let restAmount = amountToPay - debtAmount;
          let newDebt= debtAmount;
          this.studentPayments.forEach(payment => {
            if ((newDebt>0)&&(this.selectedPaymentConcept.id === payment.conceptId && payment.amount < quantityToPay)) {
              let newAmount = newDebt + payment.amount;
              if (newAmount<=quantityToPay) {
                newDebt = 0;
                if (newAmount === quantityToPay) {
                  this.updatePaymentStudentConceptDues(newAmount, payment.id, paymentDate.toISOString(), registerDate.toISOString(), receivedPersonId, paymentWayId,reference,paymentAgreement,observation, true);
                }else{
                  this.updatePaymentStudentConceptDues(newAmount, payment.id, paymentDate.toISOString(), registerDate.toISOString(), receivedPersonId, paymentWayId,reference,paymentAgreement,observation, false);
                }
              }
              if(newAmount>quantityToPay){
                newDebt = newDebt - quantityToPay;
                this.updatePaymentStudentConceptDues(quantityToPay, payment.id, paymentDate.toISOString(), registerDate.toISOString(), receivedPersonId, paymentWayId,reference,paymentAgreement,observation, true);
              }
            }
          });
          if(restAmount>0){
            restAmount = this.inprovePayment(restAmount, quantityToPay, paymentDate.toISOString(), registerDate.toISOString(), receivedPersonId, paymentWayId,reference,paymentAgreement,observation);
          }
        }else{
          this.inprovePayment(amountToPay, quantityToPay, paymentDate.toISOString(), registerDate.toISOString(), receivedPersonId, paymentWayId,reference,paymentAgreement,observation);
        }
      }
    }else{
      if (totalAmountToPay === amountToPay) {
        this.addPaymentStudentConceptNotDues(amountToPay, paymentDate.toISOString(), registerDate.toISOString(), receivedPersonId, paymentWayId,reference,paymentAgreement,observation, true);
      }else{
        this.addPaymentStudentConceptNotDues(amountToPay, paymentDate.toISOString(), registerDate.toISOString(), receivedPersonId, paymentWayId,reference,paymentAgreement,observation, false);
      }
      
    }
    this.loading=false;
    this.successCreateRegisterPaymentModal = this.modalService.show(template, {backdrop: 'static', keyboard: false});
  }

  private changeMonthsOrder(){
    const selectedMonthIndex = this.remainingPaymentMonths.indexOf(this.selectedPaymentMonth);
    let AfterMonths = this.remainingPaymentMonths.slice(0,selectedMonthIndex);
    let beforeMonths = this.remainingPaymentMonths.slice(selectedMonthIndex,this.remainingPaymentMonths.length);
    let allMonths = beforeMonths.concat(AfterMonths);
    return allMonths;
  }

  private inprovePayment(restAmount: number, quantityToPay: any, paymentDate, registerDate, receivedPersonId, paymentWayId, reference, paymentAgreement, observation) {
    this.remainingPaymentMonths = this.changeMonthsOrder();
    this.remainingPaymentMonths.forEach(month => {
      if (restAmount > 0) {
          let newAmount = restAmount;
          if (newAmount <= quantityToPay) {
            restAmount=0;
            if (newAmount === quantityToPay) {
              this.addPaymentStudentConceptDues(newAmount, month.id, paymentDate, registerDate, receivedPersonId, paymentWayId,reference,paymentAgreement,observation,true);
            }else{
              this.addPaymentStudentConceptDues(newAmount, month.id, paymentDate, registerDate, receivedPersonId, paymentWayId,reference,paymentAgreement,observation,false);
            }
          }else{
            restAmount = restAmount - quantityToPay;
            this.addPaymentStudentConceptDues(quantityToPay, month.id, paymentDate, registerDate, receivedPersonId, paymentWayId,reference,paymentAgreement,observation,true);
            }
        }
    });
    return restAmount;
  }
    addPaymentStudentConceptNotDues(amountToPay:number, paymentDate:string, registerDate:string, receivedPersonId:number,
                                     paymentWayId:number, reference:string, paymentAgreement:string, observation:string, isPayment:boolean){
    this.spService.addPaymentStudent(this.student.id, this.selectedPaymentConcept.id,amountToPay, this.cycle.id, paymentDate, registerDate, receivedPersonId, paymentWayId, reference, paymentAgreement, observation, isPayment).then(
      (iar:ItemAddResult)=>{
        
      },err=>{

      }
    )
  }

  addPaymentStudentConceptDues(amountToPay:number, monthId:number,  paymentDate:string, registerDate:string, receivedPersonId:number,
    paymentWayId:number, reference:string, paymentAgreement:string, observation:string, isPayment:boolean){
    this.spService.addPaymentStudentWithMont(this.student.id, this.selectedPaymentConcept.id,amountToPay,monthId, this.cycle.id, paymentDate,registerDate, receivedPersonId, paymentWayId, reference, paymentAgreement, observation, isPayment).then(
      (iar:ItemAddResult)=>{
        
      },err=>{

      }
    )
  }

  updatePaymentStudentConceptDues(amountToPay:number,paymentId:number, paymentDate:string, registerDate:string, receivedPersonId:number,
    paymentWayId:number, reference:string, paymentAgreement:string, observation:string, isPayment:boolean){
    this.spService.updatePaymentStudentConceptDues(amountToPay,paymentId, this.cycle.id, paymentDate,registerDate, receivedPersonId, paymentWayId, reference, paymentAgreement, observation, isPayment).then(
      (iar:ItemAddResult)=>{
        
      },err=>{

      }
    )
  }

}
