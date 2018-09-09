import { Injectable } from '@angular/core';
import {default as pnp, ItemAddResult } from 'sp-pnp-js';
import { environment } from '../../environments/environment';
import { from } from 'rxjs';
import { Student } from '../dtos/student';
import { StageSchool } from '../dtos/stageSchool';
import { StudentDocument } from '../dtos/studentDocument';

@Injectable()
export class SPService {
  
  constructor() {}

  private getConfig(){
      const mySp = pnp.sp.configure({
          headers:{
              "Accept":"application/json; odata=verbose"
          }
      },environment.web);

      return mySp;
  }

  private getConfigPost(){
    const mySp = pnp.sp.configure({
        headers:{
            "Accept":"application/json; odata=verbose",
            'Content-Type':'application/json;odata=verbose',
            'Authorization':'Bearer 0x3C3C422CC9C3A97CDE3B46AF5C6CAF0DDD5B159174D94DEE35C78EA2701ACEA67C23E1A0CC83511569BFDBC721714B13B7B0C15B67A8EE2DA28B8B00C9EDFEC0,03 Sep 2018 19:28:54 -0000'
        }
    },environment.web);

    return mySp;
  }

  getSiteInfo(){
      let data = from(this.getConfig().web.get());
      return data;
  }

  getCurrentUser(){
      let data = from(this.getConfig().web.currentUser.get());
      return data;
  }

  getActiveCycle(){
    let data = from(this.getConfig().web.lists.getByTitle(environment.cycleList).items.filter("Estado eq 'Activo'").get());
    return data;
  }

  getMonthsList(){
      let data = from(this.getConfig().web.lists.getByTitle(environment.monthList).items.getAll());
      return data;
  }

  getReceivedPersonList(){
      let data = from(this.getConfig().web.lists.getByTitle(environment.receivedPersonList).items.getAll());
      return data;
  }

  getPaymentWaysList(){
      let data = from(this.getConfig().web.lists.getByTitle(environment.paymentWayList).items.getAll());
      return data;
  }

  getMenu(){
      let data = from(this.getConfig().web.lists.getByTitle(environment.menuList).items.getAll());
      return data;
  }

  getCyclesList(){
      let data = from(this.getConfig().web.lists.getByTitle(environment.cycleList).items.filter("Estado eq 'Activo'").get());
      return data;
  }

  getTurnList(){
      let data = from(this.getConfig().web.lists.getByTitle(environment.turnList).items.getAll());
      return data;
  }

  getGradeList(){
      let data = from(this.getConfig().web.lists.getByTitle(environment.gradeList).items.getAll());
      return data;
  }

  getGroupByGradeId(gradeId:number){
      let data = from(this.getConfig().web.lists.getByTitle(environment.groupList).items.filter("GradoId eq "+ gradeId).get());
      return data;
  }

  getSexsList(){
      let data = from(this.getConfig().web.lists.getByTitle(environment.sexList).items.getAll());
      return data;
  }

  getStudentStatusList(){
      let data = from(this.getConfig().web.lists.getByTitle(environment.studentStatusList).items.getAll());
      return data;
  }

  getSchoolStatusList(){
    let data = from(this.getConfig().web.lists.getByTitle(environment.schoolStatusList).items.getAll());
    return data;
  }

  getStageShoolList(){
    let data = from(this.getConfig().web.lists.getByTitle(environment.stageSchoolList).items.getAll());
    return data;
  }

  getStudentList(){
      let data = from(this.getConfig().web.lists.getByTitle(environment.studentList).items.getAll());
      return data;
  }

getPaymentModalityList(){
    let data =from(this.getConfig().web.lists.getByTitle(environment.paymentModality).items.getAll());
    return data;
}

getPaymentConceptList(stageSchoolId:number){
    let data = from(this.getConfig().web.lists.getByTitle(environment.paymentConcept).items.filter("DivisionId eq "+ stageSchoolId+" and Estado eq 'Activo'").get());
    return data;
}

getStudentPaymentList(studentId:number){
    let data = from(this.getConfig().web.lists.getByTitle(environment.studentPaymentList).items.filter("AlumnoId eq " + studentId).get());
    return data;
}

  addStudent(student:Student, abbreviationStage:string){
    return this.getConfigPost().web.lists.getByTitle(environment.studentList).items.add({
        Title:student.name,
        FechaNacimiento:student.birthDate,
        SexoId:student.sexId,
        NombrePadre:student.parentName,
        EstatusAlumnoId:student.studentStatusId,
        EstatusEscolarId:student.schoolStatusId,
        DivisionId:student.stageSchoolId,
        FechaRegistro:student.enrollDate,
        FechaIngreso:student.entryDate,
        NombreMadre:student.motherName,
        LugarNacimiento:student.birthPlace,
        Telefono:student.phoneNumber,
        DomicilioParticular:student.address,
        CelularTutor:student.parentsPhoneNumber,
        Celular:student.movilNumber,
        OcupacionTutor:student.parentJob,
        Observaciones:student.observations,
        EscuelaOrigen:student.originSchool
    });
  }

  updateStudent(student:Student, id:number){
      return this.getConfigPost().web.lists.getByTitle(environment.studentList).items.getById(id).update({
        Title:student.name,
        FechaNacimiento:student.birthDate,
        SexoId:student.sexId,
        NombrePadre:student.parentName,
        EstatusAlumnoId:student.studentStatusId,
        EstatusEscolarId:student.schoolStatusId,
        DivisionId:student.stageSchoolId,
        FechaRegistro:student.enrollDate,
        FechaIngreso:student.entryDate,
        NombreMadre:student.motherName,
        LugarNacimiento:student.birthPlace,
        Telefono:student.phoneNumber,
        DomicilioParticular:student.address,
        CelularTutor:student.parentsPhoneNumber,
        Celular:student.movilNumber,
        OcupacionTutor:student.parentJob,
        Observaciones:student.observations,
        EscuelaOrigen:student.originSchool,
        CicloEscolarId:student.cycleId,
        TurnoId:student.turnId,
        GradoId:student.gradeId,
        GrupoId:student.groupId,
        ConceptosId:{results:student.paymentConceptIds},
        ModalidadPagoId:student.paymentMadalityId
      });
  }

  addStudentDocuments(studentId:number, studentDocuments: StudentDocument[]){
    return this.getConfig().web.lists.getByTitle(environment.studentList).items.getById(studentId).attachmentFiles.addMultiple(studentDocuments);
  }

  getAllStudentDocuments(studentId:number){
    return this.getConfig().web.lists.getByTitle(environment.documentStudentList).items.filter("IdAlumno eq "+ studentId).get();
}

  assignStudentKey(password:string, id:number){
    return this.getConfigPost().web.lists.getByTitle(environment.studentList).items.getById(id).update({
        ClaveAlumno:password
      });
  }
}