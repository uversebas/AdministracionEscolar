import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Sex } from '../dtos/sex';
import { StudentStatus } from '../dtos/studentStatus';
import { SchoolStatus } from '../dtos/schoolStatus';
import { StageSchool } from '../dtos/stageSchool';
import { SPService } from '../services/sp.service';
import { Student } from '../dtos/student';
import { StudentDocument } from '../dtos/studentDocument';
import { Alert } from 'selenium-webdriver';
import { SavedStudentDocument } from '../dtos/savedStudentDocument';

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
  savedStudentDocuments:SavedStudentDocument[]=[];
  deleteSavedStudentDocuments:SavedStudentDocument[]=[];

  student:Student;

  studentDocuments:StudentDocument[]=[];


  constructor(private formBuilder: FormBuilder, private spService: SPService) { }

  ngOnInit() {
    this.registerControlsForm();
    this.getStudent();
  }


  getStudent(){
    this.student = JSON.parse(sessionStorage.getItem('student'));
    this.getAllStudentDocuments();
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

  getAllStudentDocuments(){
    this.spService.getAllStudentDocuments(this.student.id).then(
      (Response)=>{
        this.savedStudentDocuments = SavedStudentDocument.fromJsonList(Response);
      },err=>{
        alert('Error Obteniendo')
      }
    )
  }

  deleteSavedDocument(document){
    let index = this.savedStudentDocuments.findIndex(d => d.name === document.name);
    if (index > -1) {
     this.savedStudentDocuments.splice(index,1);
     this.deleteSavedStudentDocuments.push(document);
    }
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

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      for (let index = 0; index < event.target.files.length; index++) {
        const file = event.target.files[index];
        this.studentDocuments.push(new StudentDocument(file.name,file));
      }
      
    }else {
  }
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
    if (this.updateStudentForm.invalid) {
      return;
    }
    let enrollDate = new Date(this.updateStudentForm.controls.enrollDate.value);
    let birthDate = new Date(this.updateStudentForm.controls.birthDate.value);
    let entryDate = new Date(this.updateStudentForm.controls.entryDate.value);

    this.student.name= this.updateStudentForm.controls.firstName.value;
    this.student.birthDate = birthDate.toISOString();
    this.student.sexId = this.updateStudentForm.controls.sexControl.value.Id;
    this.student.parentName = this.updateStudentForm.controls.parentName.value;
    this.student.studentStatusId = this.updateStudentForm.controls.studentStatus.value.Id;
    this.student.schoolStatusId = this.updateStudentForm.controls.schoolStatus.value.Id;
    this.student.stageSchoolId=this.updateStudentForm.controls.stageSchool.value.Id;
    this.student.enrollDate = enrollDate.toISOString();
    this.student.entryDate = entryDate.toISOString();
    this.student.motherName = this.updateStudentForm.controls.motherName.value;
    this.student.birthPlace = this.updateStudentForm.controls.birthPlace.value;
    this.student.address = this.updateStudentForm.controls.address.value;
    this.student.phoneNumber = this.updateStudentForm.controls.phoneNumber.value;
    this.student.movilNumber = this.updateStudentForm.controls.movilNumber.value;
    this.student.parentsPhoneNumber = this.updateStudentForm.controls.parentsPhoneNumber.value;
    this.student.parentJob = this.updateStudentForm.controls.parentJob.value;
    this.student.originSchool = this.updateStudentForm.controls.originSchool.value;
    this.student.observations = this.updateStudentForm.controls.observations.value;

    this.spService.updateStudent(this.student, this.student.id).then(
      (Response)=>{
        this.spService.addStudentDocuments(this.student.id, this.studentDocuments).then(
          (response)=>{
            sessionStorage.setItem('student',JSON.stringify(this.student));
            alert('Actualizo');
          },err=>{
            alert('no actulizo');
          }
        );
      },err=>{
        alert('No actualizo');
      }
    )
  }

}
