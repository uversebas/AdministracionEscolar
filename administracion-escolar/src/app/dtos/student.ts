export class Student {
    constructor(public name: string, public birthDate: string, public sexId: number, public parentName: string,
        public studentStatusId: number, public schoolStatusId: number, public stageSchoolId: number,
        public enrollDate?: string, public entryDate?: string, public motherName?: string, public stateId?: number,
        public address?: string, public phoneNumber?: string, public movilNumber?: string, public parentsPhoneNumber?: string,
        public parentJob?: string, public originSchool?: string, public observations?: string, public key?: string, public cycleId?: number,
        public turnId?: number, public gradeId?: number, public groupId?: number, public paymentConceptIds?: number[], public paymentMadalityId?: number, public id?: number) { }

    public static fromJson(element: any) {
        return new Student(element.Title, element.FechaNacimiento, element.SexoId, element.NombrePadre,
            element.EstatusAlumnoId, element.EstatusEscolarId, element.DivisionId, element.FechaRegistro,
            element.FechaIngreso, element.NombreMadre, element.LugarNacimientoId, element.DomicilioParticular,
            element.Telefono, element.Celular, element.CelularTutor, element.OcupacionTutor, element.EscuelaOrigen,
            element.Observaciones, element.ClaveAlumno, element.CicloEscolarId, element.TurnoId, element.GradoId, element.GrupoId, element.ConceptosId, element.ModalidadPagoId, element.Id);
    }
    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}