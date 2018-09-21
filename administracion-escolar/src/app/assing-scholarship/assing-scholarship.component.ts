import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Student } from '../dtos/student';
import { SPService } from '../services/sp.service';
import { Cycle } from '../dtos/cycle';
import { StageSchool } from '../dtos/stageSchool';
import { SchoolStatus } from '../dtos/schoolStatus';
import { StudentStatus } from '../dtos/studentStatus';
import { ConceptStudent } from '../dtos/conceptStudent';
import { PaymentConcept } from '../dtos/paymentConcept';
import { Scholarship } from '../dtos/scholarship';
import { bloomAdd } from '@angular/core/src/render3/di';
import { StatusScholarship } from '../dtos/statusScholarship';
import { PaymentModality } from '../dtos/paymentModality';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assing-scholarship',
  templateUrl: './assing-scholarship.component.html',
  styleUrls: ['./assing-scholarship.component.css']
})
export class AssingScholarshipComponent implements OnInit {

  assingScholarshipForm: FormGroup;
  submitted = false;
  student:Student;
  cycles:Cycle[]=[];
  cycle:Cycle;
  stagesSchool:StageSchool[]=[];
  stageSchool:StageSchool;
  schoolStatus:SchoolStatus[]=[];
  studentStatus: StudentStatus[]=[];
  selectedStudentStatus:StudentStatus;
  selectedSchoolStatus:SchoolStatus;

  paymentModalities:PaymentModality[]=[];
  paymentModality:PaymentModality;

  conceptsByStudent:ConceptStudent[]=[];
  paymentConcepts:PaymentConcept[]=[];
  paymentConceptsStudent:PaymentConcept[]=[];
  scholarshipListToSave:Scholarship[]=[];
  scholarshipList:Scholarship[]=[];
  statusScholarshipList:StatusScholarship[]=[];
  selectedStatus;
  selectedDay;
  isPercentage=false;
  public successAssingScholarshipModal:BsModalRef;
  public loading:boolean;

  constructor(private formBuilder: FormBuilder, private spService: SPService, private modalService: BsModalService, private router: Router) {
    this.loading=true;
   }

  ngOnInit() {
    this.getStudent();
    this.getscholarshipConfiguration();
  }

  get f(){return this.assingScholarshipForm.controls}

  getStudent(){
    this.student = JSON.parse(sessionStorage.getItem('student'));
    this.getActiveCycleList();
    this.getStageSchool();
    this.getSchoolStatus();
    this.getStuddentStatus();
  }

  getscholarshipConfiguration(){
    this.spService.getscholarshipConfiguration().subscribe(
      (Response)=>{
        this.isPercentage = Response[0].CalculoPorcentaje;
      }
    )
  }

  getPaymentModalityList(){
    this.spService.getPaymentModalityList().subscribe(
      (Response)=>{
        this.paymentModalities = PaymentModality.fromJsonList(Response);
        this.getConceptsByStudent();
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

  getStageSchool(){
    this.spService.getStageShoolList().subscribe(
      (Response)=>{
        this.stagesSchool = StageSchool.fromJsonList(Response);
        this.stageSchool = this.stagesSchool.find(s => s.id===this.student.stageSchoolId);
        this.getPaymentConcepts();
      }
    )
  }

  getSchoolStatus(){
    this.spService.getSchoolStatusList().subscribe(
      (Response)=>{
        this.schoolStatus= SchoolStatus.fromJsonList(Response);
        this.selectedSchoolStatus = this.schoolStatus.find(s=>s.id === this.student.schoolStatusId);
      }
    )
  }

  getStuddentStatus(){
    this.spService.getStudentStatusList().subscribe(
      (Response)=>{
        this.studentStatus=StudentStatus.fromJsonList(Response);
        this.selectedStudentStatus = this.studentStatus.find(s => s.id === this.student.studentStatusId);
      }
    )
  }

  getPaymentConcepts(){
    this.spService.getPaymentConceptList(this.stageSchool.id).subscribe(
      (Response)=>{
        this.paymentConcepts= PaymentConcept.fromJsonList(Response);
        this.getPaymentModalityList();
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
            let monthCounter = this.paymentModalities.find(p=> p.id === spc.paymentModalityId).monthCounter;
            pc.duesCounter=monthCounter;
          }
          this.paymentConceptsStudent.push(pc);
        }
      });
    });
    this.getScholarshipList();
    
  }

  getScholarshipList(){
    this.spService.getScholarshipList(this.student.id).subscribe(
      (Response)=>{
        this.scholarshipList = Scholarship.fromJsonList(Response);
        this.getScholarshipStatus()
        
      }
    )
  }

  getScholarshipStatus(){
    this.spService.getScholarshipStatus().subscribe(
      (Response)=>{
        this.statusScholarshipList = StatusScholarship.fromJsonList(Response);
        if (this.scholarshipList.length>0) {
          this.selectedStatus = this.statusScholarshipList.find(s => s.id === this.scholarshipList[0].statusId).id.toString();
          this.selectedDay = this.scholarshipList[0].paymentDay.toString();
        }else{
          this.selectedStatus = this.statusScholarshipList[0].id.toString();
          this.selectedDay = '5';
        }
        this.getScholarshipToSave();
      }
    )
  }

  getScholarshipToSave(){
    this.scholarshipListToSave = new Array();
    if (this.scholarshipList.length>0) {
      this.paymentConceptsStudent.forEach(concept => {
        let equal=false;
        this.scholarshipList.forEach(ship => {
          if (concept.id === ship.conceptId) {
            if (concept.dues) {
              this.scholarshipListToSave.push(new Scholarship(this.student.id,concept.id,ship.amount,ship.porcentage,ship.statusId,ship.paymentDay,ship.id,concept.title,this.getAmountFee(concept)));
            }else{
              this.scholarshipListToSave.push(new Scholarship(this.student.id,concept.id,ship.amount,ship.porcentage,ship.statusId,ship.paymentDay,ship.id,concept.title,concept.amount));
            }
            equal=true;
          }
        });
        if(!equal){
          if (concept.dues) {
            this.scholarshipListToSave.push(new Scholarship(this.student.id,concept.id,0,0,0,0,0,concept.title,this.getAmountFee(concept)));
          }else{
            this.scholarshipListToSave.push(new Scholarship(this.student.id,concept.id,0,0,0,0,0,concept.title,concept.amount));
          }
        }
      });
    }else{
      this.paymentConceptsStudent.forEach(concept => {
        if (concept.dues) {
          this.scholarshipListToSave.push(new Scholarship(this.student.id,concept.id,0,0,0,0,0,concept.title,this.getAmountFee(concept)));
        }else{
          this.scholarshipListToSave.push(new Scholarship(this.student.id,concept.id,0,0,0,0,0,concept.title,concept.amount));
        }
      });
    }
    this.loading=false;
    this.registerControlsForm();
  }

  getAmountFee(concept:PaymentConcept){
    return concept.amount/concept.duesCounter;
  }

  private registerControlsForm() {
    this.assingScholarshipForm = this.formBuilder.group({
      paymentDay:[''],
      statusControl:[''],
    });
    this.paymentConceptsStudent.forEach(element => {
      this.assingScholarshipForm.addControl('conceptValue'+element.id,new FormControl());
      this.assingScholarshipForm.addControl('conceptScholarship'+element.id,new FormControl());
      this.assingScholarshipForm.addControl('conceptPercentage'+element.id,new FormControl());
    });
    this.setValues();
  }
  setValues(){
    this.assingScholarshipForm.controls['paymentDay'].setValue(this.selectedDay);
    this.assingScholarshipForm.controls['statusControl'].setValue(this.selectedStatus);
    if (this.isPercentage) {
        this.scholarshipListToSave.forEach(element => {
        this.assingScholarshipForm.controls['conceptValue'+element.conceptId].disable();
        this.assingScholarshipForm.controls['conceptValue'+element.conceptId].setValue(element.conceptAmount);
        this.assingScholarshipForm.controls['conceptScholarship'+element.conceptId].setValue(element.amount);
        this.assingScholarshipForm.controls['conceptPercentage'+element.conceptId].setValue(element.porcentage);
        this.assingScholarshipForm.controls['conceptScholarship'+element.conceptId].disable();
      });
    }else{
      this.scholarshipListToSave.forEach(element => {
        this.assingScholarshipForm.controls['conceptValue'+element.conceptId].disable();
        this.assingScholarshipForm.controls['conceptValue'+element.conceptId].setValue(element.conceptAmount);
        this.assingScholarshipForm.controls['conceptScholarship'+element.conceptId].setValue(element.amount);
        this.assingScholarshipForm.controls['conceptPercentage'+element.conceptId].setValue(element.porcentage);
        this.assingScholarshipForm.controls['conceptPercentage'+element.conceptId].disable();
      });
    }
  }

  calculateScholarshipByValue(conceptId:number){
    let value = this.assingScholarshipForm.controls['conceptValue'+conceptId].value;
    let newValue = this.assingScholarshipForm.controls['conceptScholarship'+conceptId].value;
    let porcentage = 0
    if (newValue) {
      porcentage = 100-(((newValue) * 100)/value);
    }
    this.assingScholarshipForm.controls['conceptPercentage'+conceptId].setValue(porcentage);
  }

  calculateScholarshipByPorcentage(conceptId:number){
    let value = this.assingScholarshipForm.controls['conceptValue'+conceptId].value;
    let porcentage = this.assingScholarshipForm.controls['conceptPercentage'+conceptId].value;
    let newValue=0;
    if (porcentage) {
      newValue = value - ((value*porcentage)/100)
    }
    this.assingScholarshipForm.controls['conceptScholarship'+conceptId].setValue(newValue);
  }

  closeSuccessAssingScholarshipModal(){
    this.successAssingScholarshipModal.hide();
    this.router.navigate(['/menu']);
  }

  backMenu(){
    this.router.navigate(['/menu']);
  }

  onSubmit(template:TemplateRef<any>){
    this.submitted=true;
    if (this.assingScholarshipForm.invalid) {
      return;
    }
    this.loading=true;
    this.scholarshipListToSave.forEach(element => {
      element.amount = this.assingScholarshipForm.controls['conceptScholarship'+element.conceptId].value;
      element.porcentage = this.assingScholarshipForm.controls['conceptPercentage'+element.conceptId].value;
      if (element.amount && element.amount>0) {
        if (element.id>0) {
          this.spService.updateScholarship(element,parseInt(this.selectedStatus),parseInt(this.selectedDay)).then();
        }
        else{
          this.spService.createScholarship(element, parseInt(this.selectedStatus),parseInt(this.selectedDay)).then();
        }
      }
      else{
        if (element.id>0) {
          this.spService.deleteScholarship(element).then();
        }
      }
    });
    this.loading=false;
    this.successAssingScholarshipModal = this.modalService.show(template,{backdrop: 'static', keyboard: false});
  }

}
