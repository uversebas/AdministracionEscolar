import { Injectable } from '@angular/core';
import {default as pnp, ItemAddResult } from 'sp-pnp-js';
import { environment } from '../../environments/environment';
import { from } from 'rxjs';
import { Student } from '../dtos/student';
import { StageSchool } from '../dtos/stageSchool';

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
            'Authorization':'Bearer 0x5FD65B5961253326E13E60F10458FB10B95B9B8F117ADD6E322EFA7110C70E636AE4F274AEFEEA2BDEE8F3009D2784350028B5BF4CBDA3563AA875AF9D40EFD7,25 Aug 2018 02:04:36 -0000'
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

  getMenu(){
      let data = from(this.getConfig().web.lists.getByTitle(environment.menuList).items.getAll());
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
        Title:student.name
      });
  }

  assignStudentKey(password:string, id:number){
    return this.getConfigPost().web.lists.getByTitle(environment.studentList).items.getById(id).update({
        ClaveAlumno:password
      });
  }
}