import { ConceptStudent } from "./conceptStudent";
import { StudentPayment } from "./studentPayment";

export class SummaryPayment{
    static paymentStatus:boolean=false;
    constructor(public conceptName:string, public amount:number, public isPayment:boolean){
    }
    public static getSummaryPaymentList(conceptList:ConceptStudent[], paymentStudentList:StudentPayment[]){
        var list=[];
        conceptList.forEach(concept => {
             let amount = this.getPaymentUntilNow(concept,paymentStudentList);
             list.push(new SummaryPayment(concept.conceptName,amount,this.paymentStatus))
        });
        return list;
    }

     private static getPaymentUntilNow(concept: ConceptStudent, paymentStudentList:StudentPayment[]) {
        let totalAmount = 0;
        this.paymentStatus=false;
        for (let j = 0; j < paymentStudentList.length; j++) {
          const payment = paymentStudentList[j];
          if (concept.conceptId === payment.conceptId) {
            totalAmount += payment.amount;
            this.paymentStatus = payment.isPayment;
          }
        }
        return totalAmount;
      }
}