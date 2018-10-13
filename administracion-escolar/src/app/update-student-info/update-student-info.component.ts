import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Sex } from '../dtos/sex';
import { StudentStatus } from '../dtos/studentStatus';
import { SchoolStatus } from '../dtos/schoolStatus';
import { Turn } from '../dtos/turn';
import { Grade } from '../dtos/grade';
import { Student } from '../dtos/student';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SPService } from '../services/sp.service';
import { Router } from '@angular/router';
import { Group } from '../dtos/group';
import { States } from '../dtos/states';
import { StudentDocument } from '../dtos/studentDocument';
import { SavedStudentDocument } from '../dtos/savedStudentDocument';
import { PendingStudentDocument } from '../dtos/pendingStudenDocument';


@Component({
  selector: 'app-update-student-info',
  templateUrl: './update-student-info.component.html',
  styleUrls: ['./update-student-info.component.css']
})
export class UpdateStudentInfoComponent implements OnInit {
  updateStudentForm: FormGroup;
  submitted = false;
  states: States[]=[];
  sexs: Sex[] = [];
  studentStatus: StudentStatus[] = [];
  schoolStatus: SchoolStatus[] = [];
  turns: Turn[] = [];
  grades: Grade[] = [];
  groups: Group[] = [];
  studentName: string;
  studentKey: string;
  selectedSex: Sex;
  selectedState: States;
  selectedStudentStatus: StudentStatus;
  selectedSchoolStatus: SchoolStatus;
  selectedTurnSchool: Turn;
  selectedGradeSchool: Grade;
  selectedGroupSchool: Group;
  student: Student;
  savedStudentDocuments: SavedStudentDocument[] = [];
  deleteSavedStudentDocuments: SavedStudentDocument[] = [];
  pendingStudentDocuments: PendingStudentDocument[] = [];
  deletePendingDocuments: PendingStudentDocument[] = [];
  pendingStudentDocumentsBySave: PendingStudentDocument[] = [];
  displaySavedDocuments: string;
  displayPendingDocuments: string;
  selectedTab: number;
  studentDocuments: StudentDocument[] = [];

  public loading:boolean;

  public successUpdateStudentModal: BsModalRef;
  
  constructor(private formBuilder: FormBuilder, private spService: SPService, private modalService: BsModalService, private router: Router) {
    this.loading=true;
   }

  ngOnInit() {
    this.InitializeDocumentstables();
    this.getStudent();
    this.registerControlsForm();
  }

  InitializeDocumentstables() {
    this.displaySavedDocuments = "none";
    this.displayPendingDocuments = "none";
  }

  getTurnsList() {
    this.spService.getTurnList().subscribe(
      (Response) => {
        this.turns = Turn.fromJsonList(Response);
        this.selectedTurnSchool = this.turns.find(t => t.id === this.student.turnId);
        this.getGradeList();
      }
    )
  }

  getGradeList() {
    this.spService.getGradeList().subscribe(
      (Response) => {
        this.grades = Grade.fromJsonList(Response);
        this.selectedGradeSchool = this.grades.find(g => g.id === this.student.gradeId);
        this.selectGrade();
      }
    )
  }

  getGruopList() {
    this.spService.getGroupByGradeId(this.selectedGradeSchool.id).subscribe(
      (Response) => {
        this.groups = Group.fromJsonList(Response);
        this.selectedGroupSchool = this.groups.find(g => g.id === this.student.groupId);
        this.loading=false;
        this.updateValues();
      }
    )
  }

  getStudent() {
    this.student = JSON.parse(sessionStorage.getItem('student'));
    this.getSexList();
  }

  getSexList() {
    this.spService.getSexsList().subscribe(
      (Response) => {
        this.sexs = Sex.fromJsonList(Response);
        this.selectedSex = this.sexs.find(s => s.id === this.student.sexId);
        this.getStudentStatus();
      }
    )
  }

  selectGrade() {
    this.getGruopList();
  }

  getStudentStatus() {
    this.spService.getStudentStatusList().subscribe(
      (Response) => {
        this.studentStatus = StudentStatus.fromJsonList(Response);
        this.selectedStudentStatus = this.studentStatus.find(s => s.id === this.student.studentStatusId);
        this.getSchoolStatus();
      }
    )
  }

  getSchoolStatus() {
    this.spService.getSchoolStatusList().subscribe(
      (Response) => {
        this.schoolStatus = SchoolStatus.fromJsonList(Response);
        this.selectedSchoolStatus = this.schoolStatus.find(s => s.id === this.student.schoolStatusId);
        this.getCountryStates();
      }
    )
  }

  getAllStudentDocuments() {
    this.spService.getAllStudentDocuments(this.student.id).then(
      (Response) => {
        this.savedStudentDocuments = SavedStudentDocument.fromJsonList(Response);
        this.loadDocumentsControls();
        this.updateDocumentsValues();
        if (this.savedStudentDocuments.length > 0) {
          this.displaySavedDocuments = "block";
        }
      }, err => {
        alert('Error Obteniendo')
      }
    )
  }

  deleteSavedDocument(document) {
    let index = this.savedStudentDocuments.findIndex(d => d.name === document.name);
    if (index > -1) {
      this.savedStudentDocuments.splice(index, 1);
      this.deleteSavedStudentDocuments.push(document);
      if (this.savedStudentDocuments.length == 0) {
        this.displaySavedDocuments = "none";
      }
    }
  }

  deletePendingDocument(pendingDocument) {
    let index = this.pendingStudentDocuments.findIndex(d => d.file.name === pendingDocument.file.name);
    if (index > -1) {
      this.pendingStudentDocuments.splice(index, 1);
      this.deletePendingDocuments.push(pendingDocument);
      if (this.pendingStudentDocuments.length == 0) {
        this.displayPendingDocuments = "none";
      }
    }
  }

  getCountryStates(){
    this.spService.getCountryStates().subscribe(
      (Response)=>{
        this.states = States.fromJsonList(Response);
        this.selectedState = this.states.find(s => s.id === this.student.stateId);
        this.getTurnsList();
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
      birthPlace: this.selectedState,
      address: this.student.address,
      phoneNumber: this.student.phoneNumber,
      movilNumber: this.student.movilNumber,
      parentsPhoneNumber: this.student.parentsPhoneNumber,
      studentStatus: this.selectedStudentStatus,
      schoolStatus: this.selectedSchoolStatus,
      parentJob: this.student.parentJob,
      originSchool: this.student.originSchool,
      observations: this.student.observations,
      turnSchoolControl: this.selectedTurnSchool,
      gradeSchoolControl: this.selectedGradeSchool,
      groupSchoolControl: this.selectedGroupSchool,
    });
    this.getAllStudentDocuments();
  }

  updateDocumentsValues() {
    this.savedStudentDocuments.forEach(element => {
      this.updateStudentForm.controls['documentDate' + element.id].setValue(element.validity);
      this.updateStudentForm.controls['documentDate' + element.id].disable();
    });
  }

  onFileChange(event) {
    this.selectedTab = 0;
    this.displayPendingDocuments = "block";
    let attachedDocuments = event.target.files;
    if (this.pendingStudentDocuments.length > 0) {
      for (let index = 0; index < attachedDocuments.length; index++) {
        const file = attachedDocuments[index];
        let existDocumentInList = this.pendingStudentDocuments.some(x => x.file.name === file.name);
        if (!existDocumentInList) {
          this.addControlPendingDocument(index);
          this.pendingStudentDocuments.push(new PendingStudentDocument(index, '', file));
        } else {
          console.log("Este nombre de documento ya existe: " + file.name);
        }
      }
    } else {
      for (let index = 0; index < attachedDocuments.length; index++) {
        const file = attachedDocuments[index];
        this.addControlPendingDocument(index);
        this.pendingStudentDocuments.push(new PendingStudentDocument(index, '', file));
      }
    }
    // Clear the input
    event.srcElement.value = null;
  }

  addControlPendingDocument(index) {
    this.updateStudentForm.addControl('pendingDocumentDate' + index, new FormControl());
  }


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
      studentStatus: ['', Validators.required],
      schoolStatus: ['', Validators.required],
      parentJob: [''],
      originSchool: [''],
      observations: [''],
      turnSchoolControl: ['', Validators.required],
      gradeSchoolControl: ['', Validators.required],
      groupSchoolControl: ['', Validators.required],
    });
  }

  private loadDocumentsControls() {
    this.savedStudentDocuments.forEach(element => {
      this.updateStudentForm.addControl('documentDate' + element.id, new FormControl());
    });
  }

  closeSuccessUpdateStudentModal() {
    this.successUpdateStudentModal.hide();
  }

  backMenu(){
    this.router.navigate(['/menu']);
  }

  onSubmit(template: TemplateRef<any>) {
    this.submitted = true;
    if (this.updateStudentForm.invalid) {
      return;
    }
    this.loading=true;
    this.saveStudent(template);
  }

  get f() { return this.updateStudentForm.controls }

  private saveStudent(template: TemplateRef<any>) {
    let enrollDate = new Date(this.updateStudentForm.controls.enrollDate.value);
    let birthDate = new Date(this.updateStudentForm.controls.birthDate.value);
    let entryDate = new Date(this.updateStudentForm.controls.entryDate.value);
    this.student.name = this.updateStudentForm.controls.firstName.value;
    this.student.birthDate = birthDate.toISOString();
    this.student.sexId = this.updateStudentForm.controls.sexControl.value.id;
    this.student.parentName = this.updateStudentForm.controls.parentName.value;
    this.student.studentStatusId = this.updateStudentForm.controls.studentStatus.value.id;
    this.student.schoolStatusId = this.updateStudentForm.controls.schoolStatus.value.id;
    this.student.enrollDate = enrollDate.toISOString();
    this.student.entryDate = entryDate.toISOString();
    this.student.motherName = this.updateStudentForm.controls.motherName.value;
    this.student.stateId = this.updateStudentForm.controls.birthPlace.value.id;
    this.student.address = this.updateStudentForm.controls.address.value;
    this.student.phoneNumber = this.updateStudentForm.controls.phoneNumber.value;
    this.student.movilNumber = this.updateStudentForm.controls.movilNumber.value;
    this.student.parentsPhoneNumber = this.updateStudentForm.controls.parentsPhoneNumber.value;
    this.student.parentJob = this.updateStudentForm.controls.parentJob.value;
    this.student.originSchool = this.updateStudentForm.controls.originSchool.value;
    this.student.observations = this.updateStudentForm.controls.observations.value;
    this.student.turnId = this.updateStudentForm.controls.turnSchoolControl.value.id;
    this.student.gradeId = this.updateStudentForm.controls.gradeSchoolControl.value.id;
    this.student.groupId = this.updateStudentForm.controls.groupSchoolControl.value.id;
    this.pendingStudentDocuments.forEach(element => {
      let validitySave = this.updateStudentForm.controls["pendingDocumentDate" + element.id].value;
      this.pendingStudentDocumentsBySave.push(new PendingStudentDocument(element.id, validitySave, element.file));
    });
    this.spService.updateStudentInfo(this.student).then(
      (response) => {
        this.deleteDocuments(),
        this.AgregarDocumentos();
        this.loading=false;
        this.successUpdateStudentModal = this.modalService.show(template);
        this.router.navigate(['/menu']);
      }, err => {
        alert('Falla en el método updateDocuments');
      }
    );
  }

  private deleteDocuments() {
    if (this.deleteSavedStudentDocuments.length > 0) {
      for (let i = 0; i < this.deleteSavedStudentDocuments.length; i++) {
        this.spService.deleteDocuments(this.deleteSavedStudentDocuments[i].name).then((response) => {
          delete this.pendingStudentDocuments[i];
        }, err => {
          alert('Falla en el método deleteDocuments');
        });
      }
    }
  }

  AgregarDocumentos() {
    let randomKey = this.generateRandomKeyDocument(6);
    this.pendingStudentDocumentsBySave.forEach(element => {
      this.spService.addStudentDocuments(this.student, element.file, randomKey).then(
        (response) => {
          let validityDate = (element.validity != null) ? new Date(element.validity).toISOString() : null;
          response.file.getItem("ID", "Title", "Vigencia").then(
            (item) => {
              this.spService.updateDocuments(this.student, item["ID"], element.file.name, validityDate, randomKey).then(
                (response) => {
                }, err => {
                  alert('Falla en el método updateDocuments');
                }
              );
            }, err => {
              alert('Falla en el método getItem');
            }
          );
        }, err => {
          alert('Falla en el método updateDocuments');
        }
      );
    });
  }

  generateRandomKeyDocument(length) {
    var str = "";
    for (; str.length < length; str += Math.random().toString(36).substr(2));
    return str.substr(0, length);
  }

  

}
