import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-custom-control',
  templateUrl: './custom-control.component.html',
  styleUrls: ['./custom-control.component.css']
})
export class CustomControlComponent implements OnInit {
  @Input() uid;
  condiments = ['ketchup', 'mustard', 'mayo', 'worcestershire', 'horseradish'];
  constructor() { }

  ngOnInit() {
  }

}
