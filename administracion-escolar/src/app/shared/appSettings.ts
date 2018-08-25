export class AppSettings{

    public static generateStudentKey(idStudent:number, month:number, year:number, abbreviationStage:string){
        return abbreviationStage+year+("0" + (month + 1)).slice(-2)+'-'+this.generateID(idStudent);
    }

    static generateID(number) {
        if (number < 10) {
            return '00' + number;
        } else {
            return (number < 99 ? '0' : '') + number;
        }
     }
}