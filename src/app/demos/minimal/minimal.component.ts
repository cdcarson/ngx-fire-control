import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Reference } from '@firebase/database';

@Component({
  selector: 'app-minimal',
  templateUrl: './minimal.component.html',
  styleUrls: ['./minimal.component.css']
})
export class MinimalComponent implements OnInit {
  @Input() baseRef: Reference;
  fc: FormControl;
  constructor() { }
  ngOnInit() {
    this.fc = new FormControl(null, {validators: [Validators.required]});
  }
}
