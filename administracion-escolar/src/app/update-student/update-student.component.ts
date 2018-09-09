import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { Sex } from '../dtos/sex';
import { StudentStatus } from '../dtos/studentStatus';
import { SchoolStatus } from '../dtos/schoolStatus';
import { StageSchool } from '../dtos/stageSchool';
import { SPService } from '../services/sp.service';
import { Student } from '../dtos/student';
import { StudentDocument } from '../dtos/studentDocument';
import { SavedStudentDocument } from '../dtos/savedStudentDocument';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { Cycle } from '../dtos/cycle';
import { Turn } from '../dtos/turn';
import { Grade } from '../dtos/grade';
import { Group } from '../dtos/group';
import { PaymentModality } from '../dtos/paymentModality';
import { PaymentConcept } from '../dtos/paymentConcept';
import { PendingStudentDocument } from '../dtos/pendingStudenDocument';

export interface RequestUniform {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'app-update-student',
  templateUrl: './update-student.component.html',
  styleUrls: ['./update-student.component.css']
})
export class UpdateStudentComponent implements OnInit {
  updateStudentForm: FormGroup;
  submitted = false;
  sexs: Sex[] = [];
  studentStatus: StudentStatus[] = [];
  schoolStatus: SchoolStatus[] = [];
  stagesSchool: StageSchool[] = [];
  cycles: Cycle[] = [];
  turns: Turn[] = [];
  grades: Grade[] = [];
  groups: Group[] = [];
  studentName: string;
  studentKey: string;
  selectedSex: Sex;
  selectedStudentStatus: StudentStatus;
  selectedSchoolStatus: SchoolStatus;
  selectedStageSchool: StageSchool;
  selectedCycleSchool: Cycle;
  selectedTurnSchool: Turn;
  selectedGradeSchool: Grade;
  selectedGroupSchool: Group;
  savedStudentDocuments: SavedStudentDocument[] = [];
  deleteSavedStudentDocuments: SavedStudentDocument[] = [];
  paymentModalities: PaymentModality[] = [];
  paymentConcepts: PaymentConcept[] = [];
  opcionalPaymentConcepts: PaymentConcept[] = [];
  pendingStudentDocuments: PendingStudentDocument[] = [];
  deletePendingDocuments: PendingStudentDocument[] = [];
  displaySavedDocuments: string;
  displayPendingDocuments: string;
  selectedTab: number;
  requestUniform: RequestUniform[] = [
    { value: true, viewValue: 'Sí' },
    { value: false, viewValue: 'No' }
  ];
  student: Student;
  studentDocuments: StudentDocument[] = [];

  public successUpdateStudentModal: BsModalRef;

  items: FormArray;

  constructor(private formBuilder: FormBuilder, private spService: SPService, private modalService: BsModalService, private router: Router) { }

  ngOnInit() {
    this.InitializeDocumentstables();
    this.registerControlsForm();
    this.getStudent();
    this.getActiveCycleList();
    this.getTurnsList();
    this.getGradeList();
    this.getPaymentModalityList();
  }

  InitializeDocumentstables() {
    this.displaySavedDocuments = "none";
    this.displayPendingDocuments = "none";
  }

  getActiveCycleList() {
    this.spService.getActiveCycle().subscribe(
      (Response) => {
        this.cycles = Cycle.fromJsonList(Response);
      }
    )
  }

  getPaymentModalityList() {
    this.spService.getPaymentModalityList().subscribe(
      (Response) => {
        this.paymentModalities = PaymentModality.fromJsonList(Response);
      }
    )
  }

  selectStage() {
    this.spService.getPaymentConceptList(this.selectedStageSchool.id).subscribe(
      (Response) => {
        this.paymentConcepts = PaymentConcept.fromJsonList(Response);
        this.opcionalPaymentConcepts = this.paymentConcepts.filter(p => p.isOption);
      }
    )
  }

  getTurnsList() {
    this.spService.getTurnList().subscribe(
      (Response) => {
        this.turns = Turn.fromJsonList(Response);
      }
    )
  }

  getGradeList() {
    this.spService.getGradeList().subscribe(
      (Response) => {
        this.grades = Grade.fromJsonList(Response);
      }
    )
  }

  getGruopList() {
    this.spService.getGroupByGradeId(this.selectedGradeSchool.id).subscribe(
      (Response) => {
        this.groups = Group.fromJsonList(Response);
      }
    )
  }

  getStudent() {
    this.student = JSON.parse(sessionStorage.getItem('student'));
    this.getAllStudentDocuments();
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
        this.getStageStatus();
      }
    )
  }

  getAllStudentDocuments() {
    this.spService.getAllStudentDocuments(this.student.id).then(
      (Response) => {
        this.savedStudentDocuments = SavedStudentDocument.fromJsonList(Response);
        //this.loadDocumentsControls();
        //this.updateDocumentsValues();
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

  getStageStatus() {
    this.spService.getStageShoolList().subscribe(
      (Response) => {
        this.stagesSchool = StageSchool.fromJsonList(Response);
        this.selectedStageSchool = this.stagesSchool.find(s => s.id === this.student.stageSchoolId);
        this.selectStage();
        this.updateValues();
      }
    )
  }

  selectConcept(concept: PaymentConcept) {
    concept.checked = !concept.checked;
  }

  selectGrade() {
    this.getGruopList();
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
      studentStatus: this.selectedStudentStatus,
      schoolStatus: this.selectedSchoolStatus,
      parentJob: this.student.parentJob,
      stageSchool: this.selectedStageSchool,
      originSchool: this.student.originSchool,
      observations: this.student.observations,
      cycleSchoolControl: '',
      turnSchoolControl: '',
      gradeSchoolControl: '',
      groupSchoolControl: '',
      paymentModalityControl: ''
    });
  }

  updateDocumentsValues() {
    this.savedStudentDocuments.forEach(element => {
      this.updateStudentForm.controls['documentDate' + element.id].setValue(element.validity);
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
          this.pendingStudentDocuments.push(new PendingStudentDocument(index, file));
        } else {
          console.log("Este nombre de documento ya existe: " + file.name);
        }
      }
    } else {
      for (let index = 0; index < attachedDocuments.length; index++) {
        const file = attachedDocuments[index];
        this.pendingStudentDocuments.push(new PendingStudentDocument(index, file));
      }
    }
    // Clear the input
    event.srcElement.value = null;
  }

  get f() { return this.updateStudentForm.controls }

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
      stageSchool: ['', Validators.required],
      originSchool: [''],
      observations: [''],
      cycleSchoolControl: ['', Validators.required],
      turnSchoolControl: ['', Validators.required],
      gradeSchoolControl: ['', Validators.required],
      groupSchoolControl: ['', Validators.required],
      paymentModalityControl: ['', Validators.required],
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

  getPaymentConceptIds() {
    let paymentConceptIdsToSave = this.paymentConcepts;
    for (let i = 0; i < this.opcionalPaymentConcepts.length; i++) {
      const op = this.opcionalPaymentConcepts[i];
      for (let j = 0; j < paymentConceptIdsToSave.length; j++) {
        const o = paymentConceptIdsToSave[j];
        if (op.id == o.id) {
          if (!op.checked) {
            paymentConceptIdsToSave.splice(j, 1);
          }
        }
      }
    }
    return paymentConceptIdsToSave.map(obj => obj.id);
  }

  onSubmit(template: TemplateRef<any>) {
    this.submitted = true;
    if (this.updateStudentForm.invalid) {
      return;
    }
    let enrollDate = new Date(this.updateStudentForm.controls.enrollDate.value);
    let birthDate = new Date(this.updateStudentForm.controls.birthDate.value);
    let entryDate = new Date(this.updateStudentForm.controls.entryDate.value);

    this.student.name = this.updateStudentForm.controls.firstName.value;
    this.student.birthDate = birthDate.toISOString();
    this.student.sexId = this.updateStudentForm.controls.sexControl.value.id;
    this.student.parentName = this.updateStudentForm.controls.parentName.value;
    this.student.studentStatusId = this.updateStudentForm.controls.studentStatus.value.id;
    this.student.schoolStatusId = this.updateStudentForm.controls.schoolStatus.value.id;
    this.student.stageSchoolId = this.updateStudentForm.controls.stageSchool.value.id;
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
    this.student.cycleId = this.updateStudentForm.controls.cycleSchoolControl.value.id;
    this.student.turnId = this.updateStudentForm.controls.turnSchoolControl.value.id;
    this.student.gradeId = this.updateStudentForm.controls.gradeSchoolControl.value.id;
    this.student.groupId = this.updateStudentForm.controls.groupSchoolControl.value.id;
    this.student.paymentConceptIds = this.getPaymentConceptIds();
    this.student.paymentMadalityId = this.updateStudentForm.controls.paymentModalityControl.value.id;

    this.spService.updateStudent(this.student, this.student.id).then(
      (Response) => {
        this.spService.addStudentDocuments(this.student.id, this.studentDocuments).then(
          (response) => {
            sessionStorage.setItem('student', JSON.stringify(this.student));
            this.successUpdateStudentModal = this.modalService.show(template);
            this.router.navigate(['/menu']);
          }, err => {
            alert('no actulizo');
          }
        );
      }, err => {
        alert('No actualizo');
      }
    )
  }

}
