import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-enroll-student',
  templateUrl: './enroll-student.component.html',
  styleUrls: ['./enroll-student.component.css']
})
export class EnrollStudentComponent implements OnInit {

    registerForm: FormGroup;
    submitted = false;
    sexs = ['M', 'F'];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName:['',Validators.required],
      birthDate:['',Validators.required],
      password:['',Validators.required],
      enrollDate:['',Validators.required],
      entryDate:['',Validators.required],
      sexControl:['', Validators.required]
    });
  }

  get f(){return this.registerForm.controls}

  onSubmit(){
    this.submitted=true;

    if (this.registerForm.invalid) {
      return;
    }
    alert('SUCCESS!!');
  }

}
