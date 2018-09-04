export class StudentPayment{
    constructor(public studentId:number, public conceptId:number, public amount:number, public monthId?:number, public id?:number){}

    public static fromJson(element: any){
        return new StudentPayment(element.AlumnoId,element.ConceptoId,element.Monto,element.MesId, element.Id);
    }
    public static fromJsonList(elements:any){
        var list=[];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}