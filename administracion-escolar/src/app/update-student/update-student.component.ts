import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Sex } from '../dtos/sex';
import { StudentStatus } from '../dtos/studentStatus';
import { SchoolStatus } from '../dtos/schoolStatus';
import { StageSchool } from '../dtos/stageSchool';
import { SPService } from '../services/sp.service';
import { Student } from '../dtos/student';

@Component({
  selector: 'app-update-student',
  templateUrl: './update-student.component.html',
  styleUrls: ['./update-student.component.css']
})
export class UpdateStudentComponent implements OnInit {

  updateStudentForm: FormGroup;
  submitted = false;
  sexs:Sex[] = [];
  studentStatus:StudentStatus[]=[];
  schoolStatus:SchoolStatus[]=[];
  stagesSchool:StageSchool[]=[];
  studentName:string;
  studentKey:string;
  selectedSex:Sex;
  selectedStudentStatus:StudentStatus;
  selectedSchoolStatus:SchoolStatus;
  selectedStageSchool:StageSchool;

  student:Student;


  constructor(private formBuilder: FormBuilder, private spService: SPService) { }

  ngOnInit() {
    this.registerControlsForm();
    this.getStudent();
  }


  getStudent(){
    this.student = JSON.parse(sessionStorage.getItem('student'));
    this.getSexList();
    
  }

  getSexList(){
    this.spService.getSexsList().subscribe(
      (Response)=>{
        this.sexs = Sex.fromJsonList(Response);
        this.selectedSex=this.sexs.find(s=>s.Id===this.student.sexId);
        this.getStudentStatus();
      }
    )
  }

  getStudentStatus(){
    this.spService.getStudentStatusList().subscribe(
      (Response)=>{
        this.studentStatus = StudentStatus.fromJsonList(Response);
        this.selectedStudentStatus = this.studentStatus.find(s=>s.Id===this.student.studentStatusId);
        this.getSchoolStatus();
      }
    )
  }

  getSchoolStatus(){
    this.spService.getSchoolStatusList().subscribe(
      (Response)=>{
        this.schoolStatus = SchoolStatus.fromJsonList(Response);
        this.selectedSchoolStatus = this.schoolStatus.find(s=>s.Id===this.student.schoolStatusId);
        this.getStageStatus();
      }
    )
  }

  getStageStatus(){
    this.spService.getStageShoolList().subscribe(
      (Response)=>{
        this.stagesSchool = StageSchool.fromJsonList(Response);
        this.selectedStageSchool = this.stagesSchool.find(s=>s.Id===this.student.stageSchoolId);
        this.updateValues();
      }
    )
  }

  updateValues() {
    this.updateStudentForm.setValue({
      firstName: this.student.name,
      birthDate: this.student.birthDate,
      enrollDate: this.student.enrollDate,
      entryDate: this.student.entryDate,
      sexControl: this.selectedSex,
      parentName: this.student.parentName,
      motherName: this.student.motherName,
      birthPlace: this.student.birthPlace,
      address: this.student.address,
      phoneNumber: this.student.phoneNumber,
      movilNumber: this.student.movilNumber,
      parentsPhoneNumber: this.student.parentsPhoneNumber,
      studentStatus:this.selectedStudentStatus,
      schoolStatus:this.selectedSchoolStatus,
      parentJob:this.student.parentJob,
      stageSchool:this.selectedStageSchool,
      originSchool:this.student.originSchool,
      observations:this.student.observations
    });
  }

  get f(){return this.updateStudentForm.controls}


  private registerControlsForm() {
    this.updateStudentForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      birthDate: ['', Validators.required],
      enrollDate: ['', Validators.required],
      entryDate: ['', Validators.required],
      sexControl: ['', Validators.required],
      parentName: ['', Validators.required],
      motherName: [''],
      birthPlace: [''],
      address: [''],
      phoneNumber: [''],
      movilNumber: [''],
      parentsPhoneNumber: [''],
      studentStatus:['', Validators.required],
      schoolStatus:['',Validators.required],
      parentJob:[''],
      stageSchool:['',Validators.required],
      originSchool:[''],
      observations:['']
    });
  }

  onSubmit(){

  }

}
