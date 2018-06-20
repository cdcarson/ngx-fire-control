import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-radios',
  templateUrl: './radios.component.html',
  styleUrls: ['./radios.component.css']
})
export class RadiosComponent implements OnInit {
  @Input() uid;
  colors = ['black', 'pink', 'green'];
  fc: FormControl;
  constructor() { }

  ngOnInit() {
    this.fc = new FormControl(null);
  }

}
