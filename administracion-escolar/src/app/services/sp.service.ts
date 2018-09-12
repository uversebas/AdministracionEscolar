import { Injectable } from '@angular/core';
import { default as pnp, ItemAddResult } from 'sp-pnp-js';
import { environment } from '../../environments/environment';
import { from } from 'rxjs';
import { Student } from '../dtos/student';
<<<<<<< HEAD
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
            'Authorization':'Bearer 0xE228028845B6287BE6280BD632852F6386A4BDA204E430B2335A2F24325740682B7B112BDF750762B9BD837D9AC1516F46CA317978EEBFEA8E080D1BE6916CD7,09 Sep 2018 23:01:31 -0000'
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
    let data = from(this.getConfig().web.lists.getByTitle(environment.studentPaymentList).items.select("AlumnoId", "Id", "Concepto/ID", "Concepto/ConceptoCalculado", "Mes/Id", "Mes/Title", "Monto").expand("Concepto, Mes").filter("AlumnoId eq " + studentId).get());
    return data;
}

getConceptsByStudent(studentId:number){
    let data = from(this.getConfig().web.lists.getByTitle(environment.conceptStudentList).items.filter("AlumnoId eq "+ studentId).get());
    return data;
}

getScholarshipList(studentId:number){
    let data = from(this.getConfig().web.lists.getByTitle(environment.scholarshipList).items.filter("AlumnoId eq " + studentId).get());
    return data;
}

getScholarshipStatus(){
    let data = from(this.getConfig().web.lists.getByTitle(environment.statusScholarshipList).items.getAll());
    return data;
}

updateScholarship(sc:Scholarship, statusId:number, paymentDay:number){
    return this.getConfigPost().web.lists.getByTitle(environment.scholarshipList).items.getById(sc.id).update({
        AlumnoId:sc.studentId, ConceptoId:sc.conceptId, Monto:sc.amount, Porcentaje:sc.porcentage, EstatusId:statusId, PagoOportuno:paymentDay 
      });
    
}

createScholarship(sc:Scholarship, statusId:number, paymentDay:number){

    return this.getConfigPost().web.lists.getByTitle(environment.scholarshipList).items.add({
        AlumnoId:sc.studentId, 
        ConceptoId:sc.conceptId, 
        Monto:sc.amount, 
        Porcentaje:sc.porcentage, 
        EstatusId:statusId, 
        PagoOportuno:paymentDay
    });
}

addPaymentStudent(studentId: number, conceptId: number, totalAmountToPay: number){
    return this.getConfigPost().web.lists.getByTitle(environment.studentPaymentList).items.add({
        AlumnoId:studentId,
        ConceptoId:conceptId,
        Monto:totalAmountToPay
    });
  }
  
  addPaymentStudentWithMont(studentId: number, conceptId: number, totalAmountToPay: number, monthId:number){
    return this.getConfigPost().web.lists.getByTitle(environment.studentPaymentList).items.add({
        AlumnoId:studentId,
        ConceptoId:conceptId,
        Monto:totalAmountToPay,
        MesId:monthId
    });
  }

  updatePaymentStudentConceptDues(amountToPay: number,paymentId: number): any {
    return this.getConfigPost().web.lists.getByTitle(environment.studentPaymentList).items.getById(paymentId).update({
        Monto:amountToPay
    });
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

  addStudentPayment(studentPayment:StudentPayment){
    return this.getConfigPost().web.lists.getByTitle(environment.studentPaymentList).items.add({
        
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
=======


@Injectable()
export class SPService {

    constructor() { }

    private getConfig() {
        const mySp = pnp.sp.configure({
            headers: {
                "Accept": "application/json; odata=verbose"
            }
        }, environment.web);

        return mySp;
    }

    private getConfigPost() {
        const mySp = pnp.sp.configure({
            headers: {
                "Accept": "application/json; odata=verbose",
                'Content-Type': 'application/json;odata=verbose',
                'Authorization': 'Bearer 0x7E1ECE80D3697D3CDF68905362E2AD3DBEFF3B43FAD1583C4D1FE168DC55404CDF96337D9D490650FB50839F714ECD4DB80A5C8E94704D88839FED079EBB84D6,09 Sep 2018 18:27:21 -0000'
            }
        }, environment.web);

        return mySp;
    }

    getSiteInfo() {
        let data = from(this.getConfig().web.get());
        return data;
    }

    getCurrentUser() {
        let data = from(this.getConfig().web.currentUser.get());
        return data;
    }

    getActiveCycle() {
        let data = from(this.getConfig().web.lists.getByTitle(environment.cycleList).items.filter("Estado eq 'Activo'").get());
        return data;
    }

    getMonthsList() {
        let data = from(this.getConfig().web.lists.getByTitle(environment.monthList).items.getAll());
        return data;
    }

    getReceivedPersonList() {
        let data = from(this.getConfig().web.lists.getByTitle(environment.receivedPersonList).items.getAll());
        return data;
    }

    getPaymentWaysList() {
        let data = from(this.getConfig().web.lists.getByTitle(environment.paymentWayList).items.getAll());
        return data;
    }

    getMenu() {
        let data = from(this.getConfig().web.lists.getByTitle(environment.menuList).items.getAll());
        return data;
    }

    getCyclesList() {
        let data = from(this.getConfig().web.lists.getByTitle(environment.cycleList).items.filter("Estado eq 'Activo'").get());
        return data;
    }

    getscholarshipConfiguration() {
        let data = from(this.getConfig().web.lists.getByTitle(environment.scholarshipConfigurationList).items.getAll());
        return data;
    }

    getTurnList() {
        let data = from(this.getConfig().web.lists.getByTitle(environment.turnList).items.getAll());
        return data;
    }

    getGradeList() {
        let data = from(this.getConfig().web.lists.getByTitle(environment.gradeList).items.getAll());
        return data;
    }

    getGroupByGradeId(gradeId: number) {
        let data = from(this.getConfig().web.lists.getByTitle(environment.groupList).items.filter("GradoId eq " + gradeId).get());
        return data;
    }

    getSexsList() {
        let data = from(this.getConfig().web.lists.getByTitle(environment.sexList).items.getAll());
        return data;
    }

    getStudentStatusList() {
        let data = from(this.getConfig().web.lists.getByTitle(environment.studentStatusList).items.getAll());
        return data;
    }

    getSchoolStatusList() {
        let data = from(this.getConfig().web.lists.getByTitle(environment.schoolStatusList).items.getAll());
        return data;
    }

    getStageShoolList() {
        let data = from(this.getConfig().web.lists.getByTitle(environment.stageSchoolList).items.getAll());
        return data;
    }

    getStudentList() {
        let data = from(this.getConfig().web.lists.getByTitle(environment.studentList).items.getAll());
        return data;
    }

    getPaymentModalityList() {
        let data = from(this.getConfig().web.lists.getByTitle(environment.paymentModality).items.getAll());
        return data;
    }

    getPaymentConceptList(stageSchoolId: number) {
        let data = from(this.getConfig().web.lists.getByTitle(environment.paymentConcept).items.filter("DivisionId eq " + stageSchoolId + " and Estado eq 'Activo'").get());
        return data;
    }

    getStudentPaymentList(studentId: number) {
        let data = from(this.getConfig().web.lists.getByTitle(environment.studentPaymentList).items.filter("AlumnoId eq " + studentId).get());
        return data;
    }

    getConceptsByStudent(studentId: number) {
        let data = from(this.getConfig().web.lists.getByTitle(environment.conceptStudentList).items.filter("AlumnoId eq " + studentId).get());
        return data;
    }

    addStudent(student: Student, abbreviationStage: string) {
        return this.getConfigPost().web.lists.getByTitle(environment.studentList).items.add({
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
            LugarNacimiento: student.birthPlace,
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
        return this.getConfigPost().web.lists.getByTitle(environment.studentList).items.getById(id).update({
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
            LugarNacimiento: student.birthPlace,
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
            GrupoId: student.groupId,
            ConceptosId: { results: student.paymentConceptIds },
            ModalidadPagoId: student.paymentMadalityId
        });
    }

    addStudentDocuments(student: Student, studentDocuments: File, randomkey: string) {
        return this.getConfigPost().web.getFolderByServerRelativeUrl(environment.relativeweb + environment.documentStudentList).files.add(randomkey + "_" + studentDocuments.name, studentDocuments, true);
    }

    updateDocuments(student: Student, documentId: number, titleDocument: string, validityDate: string,  randomkey: string) {
        return this.getConfigPost().web.lists.getByTitle(environment.documentStudentList).items.getById(documentId).update({
            Title: randomkey + "_" + titleDocument,
            NombreDocumento: titleDocument,
            IdAlumnoId: student.id,
            Vigencia: validityDate
        })
    }

    deleteDocuments(documentname: string){
        return this.getConfigPost().web.getFileByServerRelativeUrl(environment.relativeweb + environment.documentStudentList + "/" + documentname).recycle();
    }

    getAllStudentDocuments(studentId: number) {
        return this.getConfigPost().web.lists.getByTitle(environment.documentStudentList).items.filter("IdAlumno eq " + studentId).get();
    }

    assignStudentKey(password: string, id: number) {
        return this.getConfigPost().web.lists.getByTitle(environment.studentList).items.getById(id).update({
            ClaveAlumno: password
        });
    }

    addconceptsStudent(studentId: number, conceptId: number, modalityId: any){
        return this.getConfigPost().web.lists.getByTitle(environment.conceptStudentList).items.add({
            AlumnoId: studentId,
            ConceptoId: conceptId,
            ModalidadId:modalityId
        });
    }
>>>>>>> luis
}