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
            'X-RequestDigest':'0x3B88850A98EE1E792EB33887C8296D672F9E90E255205410799E31450A51D4DFCB796937C03788380D20D279B6CE6C84E3248B5872FDA32CBE0687FB28D0DCE3,23 Aug 2018 03:11:54 -0000'
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

  addStudent(student:Student, abbreviationStage:string){
    return this.getConfigPost().web.lists.getByTitle(environment.studentList).items.add({
        Title:student.name,
        FechaNacimiento:student.birthDate,
        Sexo:student.sexId,
        NombrePadre:student.parentName,
        EstatusAlumno:student.studentStatusId,
        EstatusEscolar:student.schoolStatusId,
        Division:student.stageSchoolId,
        Abreviatura:abbreviationStage,
        FechaRegistro:student.enrollDate
    });
  }
}