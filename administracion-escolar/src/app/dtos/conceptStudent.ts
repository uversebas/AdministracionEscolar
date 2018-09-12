export class ConceptStudent{
    constructor(public studentId:number, public conceptId:number, public id:number, public paymentModalityId?:number, public conceptName?:string){

    }

    public static fromJson(element: any){
        return new ConceptStudent(element.AlumnoId, element.ConceptoId, element.Id, element.ModalidadId);
    }
    public static fromJsonList(elements:any){
        var list=[];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}