import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Student } from '../dtos/student';
import { SPService } from '../services/sp.service';
import { Cycle } from '../dtos/cycle';
import { StageSchool } from '../dtos/stageSchool';
import { SchoolStatus } from '../dtos/schoolStatus';
import { StudentStatus } from '../dtos/studentStatus';
import { ConceptStudent } from '../dtos/conceptStudent';
import { PaymentConcept } from '../dtos/paymentConcept';
import { Alert } from 'selenium-webdriver';

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

  conceptsByStudent:ConceptStudent[]=[];
  paymentConcepts:PaymentConcept[]=[];
  paymentConceptsStudent:PaymentConcept[]=[];
  isPercentage=false;

  constructor(private formBuilder: FormBuilder, private spService: SPService) { }

  ngOnInit() {
    this.getStudent();
    this.getscholarshipConfiguration();
  }

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

  private registerControlsForm() {
    this.assingScholarshipForm = this.formBuilder.group({
    });

    this.paymentConceptsStudent.forEach(element => {
      this.assingScholarshipForm.addControl('conceptValue'+element.id,new FormControl());
      this.assingScholarshipForm.addControl('conceptScholarship'+element.id,new FormControl());
      this.assingScholarshipForm.addControl('conceptPercentage'+element.id,new FormControl());
    });
    this.setValues();
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
        this.getConceptsByStudent();
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
            this.paymentConceptsStudent.push(pc);
        }
      });
    });
    this.registerControlsForm();
  }

  setValues(){
    if (this.isPercentage) {
        this.paymentConceptsStudent.forEach(element => {
        this.assingScholarshipForm.controls['conceptValue'+element.id].disable();
        this.assingScholarshipForm.controls['conceptValue'+element.id].setValue(element.amount);
        this.assingScholarshipForm.controls['conceptScholarship'+element.id].disable();
      });
    }else{
      this.paymentConceptsStudent.forEach(element => {
        this.assingScholarshipForm.controls['conceptValue'+element.id].disable();
        this.assingScholarshipForm.controls['conceptValue'+element.id].setValue(element.amount);
        this.assingScholarshipForm.controls['conceptPercentage'+element.id].disable();
      });
    }
  }

  calculateScholarshipByValue(conceptId:number){
    let value = this.assingScholarshipForm.controls['conceptValue'+conceptId].value;
    let newValue = this.assingScholarshipForm.controls['conceptScholarship'+conceptId].value;
    let porcentage = 100-(((newValue) * 100)/value);
    this.assingScholarshipForm.controls['conceptPercentage'+conceptId].setValue(porcentage);
  }

  calculateScholarshipByPorcentage(conceptId:number){
    let value = this.assingScholarshipForm.controls['conceptValue'+conceptId].value;
    let porcentage = this.assingScholarshipForm.controls['conceptPercentage'+conceptId].value;
    let newValue = value - ((value*porcentage)/100)
    this.assingScholarshipForm.controls['conceptScholarship'+conceptId].setValue(newValue);
  }

  onSubmit(){
    this.submitted=true;
    if (this.assingScholarshipForm.invalid) {
      return;
    }
    console.log(this.assingScholarshipForm.controls.conceptValue13.value);
  }

}
