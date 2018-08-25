export class Student{
    constructor(public name:string, public birthDate:string, public sexId:number, public parentName:string, 
                public studentStatusId:number, public schoolStatusId:number, public stageSchoolId:number,
                public enrollDate?:string, public entryDate?:string, public motherName?:string, public birthPlace?:string,
                public address?:string, public phoneNumber?:string, public movilNumber?:string, public parentsPhoneNumber?:string,
                public parentJob?:string, public originSchool?:string, public observations?:string,public key?:string, public id?:number){}

                public static fromJson(element: any){
                    return new Student(element.Title,element.FechaNacimiento,element.SexoId,element.NombrePadre,
                                        element.EstatusAlumnoId,element.EstatusEscolarId,element.DivisionId,element.FechaRegistro,
                                        element.FechaIngreso,element.NombreMadre,element.LugarNacimiento,element.DomicilioParticular,
                                        element.Telefono,element.Celular,element.CelularTutor,element.OcupacionTutor,element.EscuelaOrigen,
                                        element.Observaciones,element.ClaveAlumno,element.Id);
            }
            public static fromJsonList(elements:any){
                var list=[];
                for (var i = 0; i < elements.length; i++) {
                    list.push(this.fromJson(elements[i]));
                }
                return list;
            }
}