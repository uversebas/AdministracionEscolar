import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { PaymentConcept } from '../dtos/paymentConcept';
import { StudentPayment } from '../dtos/studentPayment';
import { ConceptStudent } from '../dtos/conceptStudent';

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
  paymentConcepts: PaymentConcept[] = [];
  studentPayments:StudentPayment[]=[];
  opcionalPaymentConcepts: PaymentConcept[] = [];
  opcionalPaymentConceptsToPrint : PaymentConcept[] = [];
  conceptsByStudent:ConceptStudent[]=[];
  public loading:boolean;

  public successUpdateStudentModal: BsModalRef;
  
  constructor(private formBuilder: FormBuilder, private spService: SPService, private modalService: BsModalService, private router: Router) {
    this.loading=true;
   }

  ngOnInit() {
    this.getStudent();
    this.registerControlsForm();
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
    this.getPaymentConceptsByStage();
    this.getSexList();
  }

  getConceptsByStudent(){
    this.spService.getConceptsByStudent(this.student.id).subscribe(
      (Response)=>{
        this.conceptsByStudent = ConceptStudent.fromJsonList(Response);
        this.opcionalPaymentConcepts.forEach(pc => {
          let stay = false;
          this.conceptsByStudent.forEach(spc => {
            if (pc.id === spc.conceptId) {
              stay=true;
            }
          });
          if (!stay) {
            this.opcionalPaymentConceptsToPrint.push(pc);
          }
        });
      }
    )
  }


  getPaymentConceptsByStage(){
    this.spService.getPaymentConceptList(this.student.stageSchoolId).subscribe(
      (Response) => {
        this.paymentConcepts = PaymentConcept.fromJsonList(Response);
        this.opcionalPaymentConcepts = this.paymentConcepts.filter(p => p.isOption);
        this.getConceptsByStudent();
      }
    )
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

  closeSuccessUpdateStudentModal() {
    this.successUpdateStudentModal.hide();
  }

  backMenu(){
    this.router.navigate(['/menu']);
  }

  getPaymentConcept() {
    let paymentConceptIdsToSave = this.opcionalPaymentConceptsToPrint;
    for (let i = 0; i < this.opcionalPaymentConceptsToPrint.length; i++) {
      const op = this.opcionalPaymentConceptsToPrint[i];
      for (let j = 0; j < paymentConceptIdsToSave.length; j++) {
          if (!op.checked) {
            paymentConceptIdsToSave.splice(j, 1);
          }
      }
    }
    return paymentConceptIdsToSave;
  }
  selectConcept(concept: PaymentConcept) {
    concept.checked = !concept.checked;
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

  AddConcepts() {
    this.getPaymentConcept().forEach(element => {
      let studentId = this.student.id;
      let conceptId = element.id;
      switch (element.title) {
        default:
          this.addConcepts(studentId, conceptId, null);
          break;
        case "Transporte":
          this.addConcepts(studentId, conceptId, 2);
      }
    });
  }

  addConcepts(studentId: number, conceptId: number, modalityId: any) {
    this.spService.addconceptsStudent(studentId, conceptId,modalityId).then(
      (response) => {
        console.log("Agrega conceptos");
      }, err => {
        alert('Falla en el método Conceptos');
      }
    );
  }

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
    this.AddConcepts();
    this.spService.updateStudentInfo(this.student).then(
      (response) => {
        this.loading=false;
        this.successUpdateStudentModal = this.modalService.show(template);
        this.router.navigate(['/menu']);
      }, err => {
        alert('Falla en el método updateDocuments');
      }
    );
  }

  

}
