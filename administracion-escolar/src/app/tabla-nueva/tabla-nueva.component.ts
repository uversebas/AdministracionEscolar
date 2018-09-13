import { Component, OnInit, OnDestroy } from '@angular/core';
import { Student } from '../dtos/student';
import { SPService } from '../services/sp.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-tabla-nueva',
  templateUrl: './tabla-nueva.component.html',
  styleUrls: ['./tabla-nueva.component.css']
})
export class TablaNuevaComponent implements OnDestroy, OnInit {
  dtOptions: any = {};
  students: Student[]= [];
  dtTrigger: Subject<any> = new Subject();
  constructor(private spService: SPService) { }

  ngOnInit() {
    this.configDataTable();
    this.getStudentList();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  private configDataTable() {
    this.dtOptions = {
      // Declare the use of the extension in the dom parameter
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
        'columnsToggle',
        'colvis',
        'copy',
        'print',
        'pdf',
        'excel'
      ],
      pagingType: 'full_numbers',
      pageLength: 5
    };
  }

  getStudentList(){
    this.spService.getStudentList().subscribe(
      (Response)=>{
        this.students= Student.fromJsonList(Response);
        this.dtTrigger.next();
      }
    )
  }

}
