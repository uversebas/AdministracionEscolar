import { SummaryPayment } from "./summaryPayment";
import { PaymentConcept } from "./paymentConcept";
import { Month } from "./month";
import { StudentPayment } from "./studentPayment";

export class StudentWithDebt{
    public sumaryPayments:SummaryPayment[]=[];
    public colegiatura:number = 0;
    public inscripcion:number = 0;
    public credencial:number = 0;
    constructor(public name: string,public key:string ,public status:string, public division:string, public divisionId:number,  public grade:string, public group:string, public id:number, public concept?:string, public amount?:number, public paymentStatus?:string) { }

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

    public static getStudentDebtFilter(students:StudentWithDebt[], paymentConcepts:PaymentConcept[],
        selectedMonth:Month, selectedStatus:string[], studentPayments:StudentPayment[]) {
        let studentsFilter: StudentWithDebt[] = new Array();
        paymentConcepts.forEach(concept => {
            if (concept.dues) {
                if (selectedMonth) {
                    students.forEach(student => {
                        let amount = 0;
                        let paymentComplete = false;
                        let notPayment = false;
                        studentPayments.forEach(payment => {
                            if (student.id === payment.studentId && concept.id === payment.conceptId && payment.monthId === selectedMonth.id) {
                                amount += concept.amount;
                                notPayment = true;
                                paymentComplete = payment.isPayment;
                            }
                        });
                        if (!notPayment) {
                            studentsFilter.push(new StudentWithDebt(student.name,student.key,student.status,student.division,student.divisionId,student.grade,student.group,student.id,concept.title + '-' + selectedMonth.title,amount,'No ha pagado'));
                        }else {
                            if (paymentComplete) {
                                studentsFilter.push(new StudentWithDebt(student.name,student.key,student.status,student.division,student.divisionId,student.grade,student.group,student.id,concept.title + '-' + selectedMonth.title,amount,'Pagado'));
                            }else {
                                studentsFilter.push(new StudentWithDebt(student.name,student.key,student.status,student.division,student.divisionId,student.grade,student.group,student.id,concept.title + '-' + selectedMonth.title,amount,'Pago parcial'));
                            }
                        }
        
                    });
                }
            }else {
                students.forEach(student => {
                    let amount = 0;
                    let paymentComplete = false;
                    let notPayment = false;
                    studentPayments.forEach(payment => {
                        if (student.id === payment.studentId && concept.id === payment.conceptId) {
                            amount += concept.amount;
                            notPayment = true;
                            paymentComplete = payment.isPayment;
                        }
                    });
                    if (!notPayment) {
                        studentsFilter.push(new StudentWithDebt(student.name,student.key,student.status,student.division,student.divisionId,student.grade,student.group,student.id,concept.title,amount,'No ha pagado'));
                    }else {
                        if (paymentComplete) {
                            studentsFilter.push(new StudentWithDebt(student.name,student.key,student.status,student.division,student.divisionId,student.grade,student.group,student.id,concept.title,amount,'Pagado'));
                        }else {
                            studentsFilter.push(new StudentWithDebt(student.name,student.key,student.status,student.division,student.divisionId,student.grade,student.group,student.id,concept.title,amount,'Pago parcial'));
                        }
                    }
    
                });
            }
        });
        return studentsFilter;

    }
}