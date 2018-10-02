import { Injectable } from '@angular/core';
import { default as pnp, ItemAddResult } from 'sp-pnp-js';
import { environment } from '../../environments/environment';
import { from } from 'rxjs';
import { Student } from '../dtos/student';
import { StageSchool } from '../dtos/stageSchool';
import { StudentDocument } from '../dtos/studentDocument';
import { Scholarship } from '../dtos/scholarship';
import { StudentPayment } from '../dtos/studentPayment';

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
            'Authorization':'Bearer 0x4E893FA20DC1400F6AC62ACFBB4090F668B20ACCC1AE3DE7173DB7FCE2A862232C28BFD17C061FBBFB6920FCEBD05DD03674B7857F84DF30248395C89F6A941B,02 Oct 2018 02:37:31 -0000'
        }
    },environment.web);

    return mySp;
  }

  getSiteInfo(){
      let data = from(this.getConfig().web.get());
      return data;
  }

  getCountryStates(){
      let data = from(this.getConfig().web.lists.getByTitle(environment.countryStatesList).items.getAll());
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
      let data = from(this.getConfig().web.lists.getByTitle(environment.menuList).items.orderBy("OrdenMenu",true).get());
      return data;
  }

  getCyclesList(){
      let data = from(this.getConfig().web.lists.getByTitle(environment.cycleList).items.filter("Estado eq 'Activo'").get());
      return data;
  }

  getscholarshipConfiguration(){
    let data = from(this.getConfig().web.lists.getByTitle(environment.scholarshipConfigurationList).items.getAll());
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

  getAllStudentList(){
    let data =from(this.getConfig().web.lists.getByTitle(environment.studentList).items.select("Title","Id", "ClaveAlumno", "EstatusAlumno/Title", "Division/Title", "Division/ID", "Grado/Title", "Grupo/Title").expand("EstatusAlumno","Division","Grado","Grupo").get());
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

getStudentPaymentExpandList(studentId:number){
    let data = from(this.getConfig().web.lists.getByTitle(environment.studentPaymentList).items.select("AlumnoId", "Id", "Concepto/ID", "Concepto/ConceptoCalculado", "Mes/Id", "Mes/Title", "Monto", "Pagado", "Ciclo/Title", "FechaPago").expand("Concepto, Mes, Ciclo").filter("AlumnoId eq " + studentId).get());
    return data;
}

getStudentsByDivisionList(divisionId:number){
    let data =from(this.getConfig().web.lists.getByTitle(environment.studentList).items.select("Title", "ClaveAlumno", "EstatusAlumno/Title", "Division/Title", "Division/ID", "Grado/Title", "Grupo/Title").expand("EstatusAlumno","Division","Grado","Grupo").filter("Division/ID eq " + divisionId).get());
    return data;
}

getConceptsByStudent(studentId:number){
    let data = from(this.getConfig().web.lists.getByTitle(environment.conceptStudentList).items.select("AlumnoId", "ConceptoId", "Id", "ModalidadId", "Concepto/ConceptoCalculado", "Concepto/Monto").expand("Concepto").filter("AlumnoId eq "+ studentId).get());
    return data;
}

getAllConceptsByStudent(){
    let data = from(this.getConfig().web.lists.getByTitle(environment.conceptStudentList).items.select("AlumnoId","Alumno/Title", "ConceptoId", "Id", "ModalidadId", "Concepto/ConceptoCalculado").expand("Concepto", "Alumno").get());
    return data;
}

getScholarshipList(studentId:number){
    let data = from(this.getConfig().web.lists.getByTitle(environment.scholarshipList).items.select("AlumnoId", "Concepto/ID", "Concepto/ConceptoCalculado", "Monto", "Porcentaje", "EstatusId", "PagoOportuno", "Concepto/Monto", "Id").expand("Concepto").filter("AlumnoId eq " + studentId).get());
    return data;
}

getScholarshipStatus(){
    let data = from(this.getConfig().web.lists.getByTitle(environment.statusScholarshipList).items.getAll());
    return data;
}

updateScholarship(sc:Scholarship, statusId:number, paymentDay:number){
    return this.getConfig().web.lists.getByTitle(environment.scholarshipList).items.getById(sc.id).update({
        AlumnoId:sc.studentId, ConceptoId:sc.conceptId, Monto:sc.amount, Porcentaje:sc.porcentage, EstatusId:statusId, PagoOportuno:paymentDay 
      });
    
}

createScholarship(sc:Scholarship, statusId:number, paymentDay:number){

    return this.getConfig().web.lists.getByTitle(environment.scholarshipList).items.add({
        AlumnoId:sc.studentId, 
        ConceptoId:sc.conceptId, 
        Monto:sc.amount, 
        Porcentaje:sc.porcentage, 
        EstatusId:statusId, 
        PagoOportuno:paymentDay
    });
}

deleteScholarship(sc:Scholarship){
    return this.getConfig().web.lists.getByTitle(environment.scholarshipList).items.getById(sc.id).delete();
}

addPaymentStudent(studentId: number, conceptId: number, totalAmountToPay: number, cycleId:number, paymentDate:string, registerDate:string, receivedPersonId:number,
                  paymentWayId:number, reference:string, paymentAgreement:string, observation:string, isPayment:boolean){
    return this.getConfig().web.lists.getByTitle(environment.studentPaymentList).items.add({
        AlumnoId:studentId,
        ConceptoId:conceptId,
        Monto:totalAmountToPay,
        CicloId:cycleId,
        FechaPago:paymentDate,
        FechaRegistro:registerDate,
        MetodoDePagoId:paymentWayId,
        Referencia:reference,
        Acuerdos:paymentAgreement,
        Observaciones:observation,
        PersonaQueRecibeId:receivedPersonId,
        Pagado:isPayment
    });
  }
  
  addPaymentStudentWithMont(studentId: number, conceptId: number, totalAmountToPay: number, monthId:number, cycleId:number, paymentDate:string, registerDate:string, receivedPersonId:number,
    paymentWayId:number, reference:string, paymentAgreement:string, observation:string,isPayment:boolean){
    return this.getConfig().web.lists.getByTitle(environment.studentPaymentList).items.add({
        AlumnoId:studentId,
        ConceptoId:conceptId,
        Monto:totalAmountToPay,
        MesId:monthId,
        CicloId:cycleId,
        FechaPago:paymentDate,
        FechaRegistro:registerDate,
        MetodoDePagoId:paymentWayId,
        Referencia:reference,
        Acuerdos:paymentAgreement,
        Observaciones:observation,
        PersonaQueRecibeId:receivedPersonId,
        Pagado:isPayment
    });
  }

  updatePaymentStudentConceptDues(amountToPay: number,paymentId: number, cycleId:number, paymentDate:string, registerDate:string, receivedPersonId:number,
                                  paymentWayId:number, reference:string, paymentAgreement:string, observation:string, isPayment:boolean): any {
    return this.getConfig().web.lists.getByTitle(environment.studentPaymentList).items.getById(paymentId).update({
        Monto:amountToPay,
        FechaPago:paymentDate,
        FechaRegistro:registerDate,
        MetodoDePagoId:paymentWayId,
        Referencia:reference,
        Acuerdos:paymentAgreement,
        Observaciones:observation,
        PersonaQueRecibeId:receivedPersonId,
        Pagado:isPayment
    });
  }

  assignStudentKey(password:string, id:number){
    return this.getConfig().web.lists.getByTitle(environment.studentList).items.getById(id).update({
        ClaveAlumno:password
      });
  }





    addStudent(student: Student, abbreviationStage: string) {
        return this.getConfig().web.lists.getByTitle(environment.studentList).items.add({
            Title: student.name,
            FechaNacimiento: student.birthDate,
            SexoId: student.sexId,
            NombrePadre: student.parentName,
            EstatusAlumnoId: student.studentStatusId,
            EstatusEscolarId: student.schoolStatusId,
            DivisionId: student.stageSchoolId,
            FechaRegistro: student.enrollDate,
            FechaIngreso: student.entryDate,
            NombreMadre: student.motherName,
            LugarNacimientoId: student.stateId,
            Telefono: student.phoneNumber,
            DomicilioParticular: student.address,
            CelularTutor: student.parentsPhoneNumber,
            Celular: student.movilNumber,
            OcupacionTutor: student.parentJob,
            Observaciones: student.observations,
            EscuelaOrigen: student.originSchool
        });
    }

    updateStudent(student: Student, id: number) {
        return this.getConfig().web.lists.getByTitle(environment.studentList).items.getById(id).update({
            Title: student.name,
            FechaNacimiento: student.birthDate,
            SexoId: student.sexId,
            NombrePadre: student.parentName,
            EstatusAlumnoId: student.studentStatusId,
            EstatusEscolarId: student.schoolStatusId,
            DivisionId: student.stageSchoolId,
            FechaRegistro: student.enrollDate,
            FechaIngreso: student.entryDate,
            NombreMadre: student.motherName,
            LugarNacimientoId: student.stateId,
            Telefono: student.phoneNumber,
            DomicilioParticular: student.address,
            CelularTutor: student.parentsPhoneNumber,
            Celular: student.movilNumber,
            OcupacionTutor: student.parentJob,
            Observaciones: student.observations,
            EscuelaOrigen: student.originSchool,
            CicloEscolarId: student.cycleId,
            TurnoId: student.turnId,
            GradoId: student.gradeId,
            GrupoId: student.groupId
        });
    }

    updateStudentInfo(student: Student){
        return this.getConfig().web.lists.getByTitle(environment.studentList).items.getById(student.id).update({
            Title: student.name,
            FechaNacimiento: student.birthDate,
            SexoId: student.sexId,
            NombrePadre: student.parentName,
            EstatusAlumnoId: student.studentStatusId,
            EstatusEscolarId: student.schoolStatusId,
            FechaRegistro: student.enrollDate,
            FechaIngreso: student.entryDate,
            NombreMadre: student.motherName,
            LugarNacimientoId: student.stateId,
            Telefono: student.phoneNumber,
            DomicilioParticular: student.address,
            CelularTutor: student.parentsPhoneNumber,
            Celular: student.movilNumber,
            OcupacionTutor: student.parentJob,
            Observaciones: student.observations,
            EscuelaOrigen: student.originSchool,
            TurnoId: student.turnId,
            GradoId: student.gradeId,
            GrupoId: student.groupId
        });
    }

    addStudentDocuments(student: Student, studentDocuments: File, randomkey: string) {
        return this.getConfig().web.getFolderByServerRelativeUrl(environment.relativeweb + environment.documentStudentList).files.add(randomkey + "_" + studentDocuments.name, studentDocuments, true);
    }

    updateDocuments(student: Student, documentId: number, titleDocument: string, validityDate: string,  randomkey: string) {
        return this.getConfig().web.lists.getByTitle(environment.documentStudentList).items.getById(documentId).update({
            Title: randomkey + "_" + titleDocument,
            NombreDocumento: titleDocument,
            IdAlumnoId: student.id,
            Vigencia: validityDate
        })
    }

    deleteDocuments(documentname: string){
        return this.getConfig().web.getFileByServerRelativeUrl(environment.relativeweb + environment.documentStudentList + "/" + documentname).recycle();
    }

    getAllStudentDocuments(studentId: number) {
        return this.getConfig().web.lists.getByTitle(environment.documentStudentList).items.filter("IdAlumno eq " + studentId).get();
    }


    addconceptsStudent(studentId: number, conceptId: number, modalityId: any){
        return this.getConfig().web.lists.getByTitle(environment.conceptStudentList).items.add({
            AlumnoId: studentId,
            ConceptoId: conceptId,
            ModalidadId:modalityId
        });
    }
}