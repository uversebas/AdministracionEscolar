import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SPService } from '../services/sp.service';
import { Observable } from 'rxjs';
import { Student } from '../dtos/student';
import { FormControl } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import { AppSettings } from '../shared/appSettings';

@Component({
  selector: 'app-search-student',
  templateUrl: './search-student.component.html',
  styleUrls: ['./search-student.component.css']
})
export class SearchStudentComponent implements OnInit {
  studentControl = new FormControl();
  students: Student[]= [];
  filteredStudents: Observable<Student[]>;
  selectedStudent:Student;
  studentKey:String='';

  constructor(private spService: SPService, private modalService: BsModalService, private router: Router) { }

  ngOnInit() {
    this.getStudentList();
  }

  getStudentList(){
    this.spService.getStudentList().subscribe(
      (Response)=>{
        this.students= Student.fromJsonList(Response);
          this.filteredStudents = this.studentControl.valueChanges.pipe(
          startWith(''),
          map(value=> this._filter(value))
        );

      }
    )
  }

  private _filter(value: string): Student[] {
    const filterValue = value.toLowerCase();
    let filter = this.students.filter(student => student.name.toLowerCase().includes(filterValue) || student.key.toLowerCase().includes(filterValue));
    if (filter.length===1) {
      this.selectedStudent = filter[0];
    }else {
      this.selectedStudent=null;
    }
    return filter;
  }

  redirectSelectedMenuItem(){

  }

  searchStudent(){
    sessionStorage.setItem('student',JSON.stringify(this.selectedStudent));
    let url = sessionStorage.getItem('routerFinal');
    if (url) {
      this.router.navigate([url]);
    }else{
      this.router.navigate(['/actualizar-alumno']);
    }
  }

}
