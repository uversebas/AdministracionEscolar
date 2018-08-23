import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sex } from '../dtos/sex';
import { SPService } from '../services/sp.service';
import { StudentStatus } from '../dtos/studentStatus';
import { SchoolStatus } from '../dtos/schoolStatus';
import { StageSchool } from '../dtos/stageSchool';
import { Student } from '../dtos/student';
import { ItemAddResult } from 'sp-pnp-js';

@Component({
  selector: 'app-enroll-student',
  templateUrl: './enroll-student.component.html',
  styleUrls: ['./enroll-student.component.css']
})
export class EnrollStudentComponent implements OnInit {

    registerForm: FormGroup;
    submitted = false;
    selectedSex:string;
    sexs:Sex[] = [];
    studentStatus:StudentStatus[]=[];
    schoolStatus:SchoolStatus[]=[];
    stagesSchool:StageSchool[]=[];


  constructor(private formBuilder: FormBuilder, private spService: SPService) { }

  ngOnInit() {
    this.registerControlsForm();
    this.getSexList();
    this.getStudentStatus();
    this.getSchoolStatus();
    this.getStageStatus();

  }

  private registerControlsForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      birthDate: ['', Validators.required],
      password: ['', Validators.required],
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

  getSexList(){
    this.spService.getSexsList().subscribe(
      (Response)=>{
        Response.forEach(element => {
          this.sexs.push(new Sex(element.Title,element.Id));
        });
      }
    )
  }

  getStudentStatus(){
    this.spService.getStudentStatusList().subscribe(
      (Response)=>{
        Response.forEach(element => {
          this.studentStatus.push(new StudentStatus(element.Title,element.Id));
        });
      }
    )
  }

  getSchoolStatus(){
    this.spService.getSchoolStatusList().subscribe(
      (Response)=>{
        Response.forEach(element => {
          this.schoolStatus.push(new SchoolStatus(element.Title,element.Id));
        });
      }
    )
  }

  getStageStatus(){
    this.spService.getStageShoolList().subscribe(
      (Response)=>{
        Response.forEach(element => {
          this.stagesSchool.push(new StageSchool(element.Title,element.Abreviatura,element.Id));
        });
      }
    )
  }

  get f(){return this.registerForm.controls}

  onSubmit(){
    if (this.registerForm.invalid) {
      return;
    }
    let newStudent = new Student(
      this.registerForm.controls.firstName.value,
      new Date(this.registerForm.controls.birthDate.value).toISOString(),
      this.registerForm.controls.sexControl.value.Id,
      this.registerForm.controls.parentName.value,
      this.registerForm.controls.studentStatus.value.Id,
      this.registerForm.controls.schoolStatus.value.Id,
      this.registerForm.controls.stageSchool.value.Id,
      new Date(this.registerForm.controls.enrollDate.value).toISOString()
    );
    this.spService.addStudent(newStudent,this.registerForm.controls.stageSchool.value.Abreviatura).then(
      (iar: ItemAddResult)=>{
        console.log(iar);
        alert('SUCCESS!!');
      },err=>{
        alert('EROOR!!');
      }
    )
    
  }

}
