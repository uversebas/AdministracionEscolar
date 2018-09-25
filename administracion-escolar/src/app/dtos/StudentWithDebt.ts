import { SummaryPayment } from "./summaryPayment";

export class StudentWithDebt{
    public sumaryPayments:SummaryPayment[]=[];
    public colegiatura:number = 0;
    public inscripcion:number = 0;
    public credencial:number = 0;
    constructor(public name: string,public key:string ,public status:string, public division:string, public divisionId:number,  public grade:string, public group:string, public id:number) { }

    public static fromJson(element: any) {
        return new StudentWithDebt(element.Title, element.ClaveAlumno, element.EstatusAlumno.Title,element.Division.Title,element.Division.ID,element.Grado.Title,element.Grupo.Title, element.Id);
    }
    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }

    public static getConcepts(summaryPayment:SummaryPayment[]){
        summaryPayment.forEach(element => {
            if (element.conceptName === 'Colegiatura') {
                
            }
        });
    }
}