import { Component, OnInit, OnDestroy } from '@angular/core';
import { SPService } from '../services/sp.service';
import { Subject } from 'rxjs';
import { StudentWithDebt } from '../dtos/StudentWithDebt';

@Component({
  selector: 'app-students-with-debt',
  templateUrl: './students-with-debt.component.html',
  styleUrls: ['./students-with-debt.component.css']
})
export class StudentsWithDebtComponent implements OnDestroy, OnInit  {
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  studentswithdebt: StudentWithDebt[]= [];

  constructor(private spService: SPService) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
