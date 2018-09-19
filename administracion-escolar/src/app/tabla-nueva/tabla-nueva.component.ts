import { Component, OnInit, OnDestroy } from '@angular/core';
import { Student } from '../dtos/student';
import { SPService } from '../services/sp.service';
import { Subject } from 'rxjs';
import { StudentByDivision } from '../dtos/studentByDivision';
import { AppSettings } from '../shared/appSettings';


@Component({
  selector: 'app-tabla-nueva',
  templateUrl: './tabla-nueva.component.html',
  styleUrls: ['./tabla-nueva.component.css']
})
export class TablaNuevaComponent implements OnDestroy, OnInit {
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  students: StudentByDivision[]= [];
  divisionId: string;
  constructor(private spService: SPService) { }

  ngOnInit() {
    this.configDataTable();
    this.getDivisionId();
  }

  getDivisionId(){
    this.divisionId = sessionStorage.getItem('filtroDivision');
    if (this.divisionId) {
      this.getStudentList();
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  private configDataTable() {
    this.dtOptions = AppSettings.getDataTableConfiguration();
  }

  getStudentList(){
    this.spService.getStudentsByDivisionList(parseInt(this.divisionId)).subscribe(
      (Response)=>{
        this.students= StudentByDivision.fromJsonList(Response);
        this.dtTrigger.next();
      }
    )
  }

}
