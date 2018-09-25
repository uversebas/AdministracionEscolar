import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { Sex } from '../dtos/sex';
import { SPService } from '../services/sp.service';
import { StudentStatus } from '../dtos/studentStatus';
import { SchoolStatus } from '../dtos/schoolStatus';
import { StageSchool } from '../dtos/stageSchool';
import { Student } from '../dtos/student';
import { ItemAddResult } from 'sp-pnp-js';
import { AppSettings } from '../shared/appSettings';
import {Router} from '@angular/router';
import { States } from '../dtos/states';

@Component({
  selector: 'app-enroll-student',
  templateUrl: './enroll-student.component.html',
  styleUrls: ['./enroll-student.component.css']
})
export class EnrollStudentComponent implements OnInit {

    registerForm: FormGroup;
    submitted = false;
    sexs:Sex[] = [];
    states: States[]=[];
    studentStatus:StudentStatus[]=[];
    schoolStatus:SchoolStatus[]=[];
    stagesSchool:StageSchool[]=[];
    studentName:string;
    studentKey:string;
    public loading:boolean;

    public successCreateStudentModal:BsModalRef;


  constructor(private formBuilder: FormBuilder, private spService: SPService, private modalService: BsModalService, private router: Router) {
    this.loading=true;
   }

  ngOnInit() {
    this.registerControlsForm();
    this.getSexList();
    this.getStudentStatus();
    this.getStageStatus();
  }

  updateValues(){
    this.registerForm.setValue({
      firstName:'',
      birthDate: '',
      enrollDate: new Date().toISOString(),
      entryDate: '',
      sexControl: '',
      parentName: '',
      motherName: '',
      birthPlace: '',
      address: '',
      phoneNumber: '',
      movilNumber: '',
      parentsPhoneNumber: '',
      studentStatus:this.studentStatus.find(s=>s.loadDefault),
      schoolStatus:this.schoolStatus.find(s => s.loadDefault),
      parentJob:'',
      stageSchool:'',
      originSchool:'',
      observations:''
    });
  }

  private registerControlsForm() {
    this.registerForm = this.formBuilder.group({
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

  getSexList(){
    this.spService.getSexsList().subscribe(
      (Response)=>{
        this.sexs = Sex.fromJsonList(Response);
      }
    )
  }

  getStudentStatus(){
    this.spService.getStudentStatusList().subscribe(
      (Response)=>{
        this.studentStatus = StudentStatus.fromJsonList(Response);
        this.getSchoolStatus();
      }
    )
  }

  getSchoolStatus(){
    this.spService.getSchoolStatusList().subscribe(
      (Response)=>{
        this.schoolStatus = SchoolStatus.fromJsonList(Response);
        this.updateValues();
      }
    )
  }

  getCountryStates(){
    this.spService.getCountryStates().subscribe(
      (Response)=>{
        this.states = States.fromJsonList(Response);
        this.loading=false;
      }
    )
  }

  getStageStatus(){
    this.spService.getStageShoolList().subscribe(
      (Response)=>{
        this.stagesSchool = StageSchool.fromJsonList(Response);
        this.getCountryStates();
      }
    )
  }

  get f(){return this.registerForm.controls}

  closeSuccessCreateStudentModal(){
    this.successCreateStudentModal.hide();
  }

  backMenu(){
    this.router.navigate(['/menu']);
  }

  onSubmit(template:TemplateRef<any>){
    this.submitted=true;
    if (this.registerForm.invalid) {
      return;
    }
    this.loading=true;
    let enrollDate = new Date(this.registerForm.controls.enrollDate.value);
    let birthDate = new Date(this.registerForm.controls.birthDate.value);
    let entryDate = new Date(this.registerForm.controls.entryDate.value);
    let newStudent = new Student(
      this.registerForm.controls.firstName.value,
      birthDate.toISOString(),
      this.registerForm.controls.sexControl.value.id,
      this.registerForm.controls.parentName.value,
      this.registerForm.controls.studentStatus.value.id,
      this.registerForm.controls.schoolStatus.value.id,
      this.registerForm.controls.stageSchool.value.id,
      enrollDate.toISOString(),
      entryDate.toISOString(),
      this.registerForm.controls.motherName.value,
      this.registerForm.controls.birthPlace.value.id,
      this.registerForm.controls.address.value,
      this.registerForm.controls.phoneNumber.value,
      this.registerForm.controls.movilNumber.value,
      this.registerForm.controls.parentsPhoneNumber.value,
      this.registerForm.controls.parentJob.value,
      this.registerForm.controls.originSchool.value,
      this.registerForm.controls.observations.value
    );
    this.spService.addStudent(newStudent,this.registerForm.controls.stageSchool.value.Abreviatura).then(
      (iar: ItemAddResult)=>{
        let studentKey = AppSettings.generateStudentKey(iar.data.Id,enrollDate.getMonth(),enrollDate.getFullYear(),this.registerForm.controls.stageSchool.value.Abreviatura);
        this.spService.assignStudentKey(studentKey,iar.data.Id).then(
          (update: ItemAddResult)=>{
            this.studentName=newStudent.name;
            this.studentKey = studentKey;
            newStudent.key = studentKey;
            newStudent.id= iar.data.Id;
            this.successCreateStudentModal = this.modalService.show(template);
            sessionStorage.setItem('student',JSON.stringify(newStudent));
            this.loading=false;
            this.router.navigate(['/registrar-datos-alumno']);
          },err=>{
            alert('Fail update!!');
          }
        )
      },err=>{
        alert('Fail create!!');
      }
    )
    
  }

}
