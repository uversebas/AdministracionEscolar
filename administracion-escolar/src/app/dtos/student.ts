export class Student{
    constructor(public name:string, public birthDate:string, public sexId:number, public parentName:string, 
                public studentStatusId:number, public schoolStatusId:number, public stageSchoolId:number,
                public enrollDate?:string, public entryDate?:string, public motherName?:string, public birthPlace?:string,
                public address?:string, public phoneNumber?:string, public movilNumber?:string, public parentsPhoneNumber?:string,
                public parentJob?:string, public originSchool?:string, public observations?:string,public password?:string){}
}