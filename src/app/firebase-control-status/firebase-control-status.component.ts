import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxFireControlStatus } from '@nowzoo/ngx-fire-control';
@Component({
  selector: 'app-firebase-control-status',
  templateUrl: './firebase-control-status.component.html',
  styleUrls: ['./firebase-control-status.component.css']
})
export class FirebaseControlStatusComponent implements OnInit {
  @Input() status$: Observable<NgxFireControlStatus>;
  status: NgxFireControlStatus = null;
  recentlySavedTimeout = null;
  constructor() { }

  ngOnInit() {
    this.status$.subscribe(val => {
      this.status = val;
      if (this.recentlySavedTimeout) {
        clearTimeout(this.recentlySavedTimeout);
        this.recentlySavedTimeout = null;
      }
      switch (val) {
        case NgxFireControlStatus.SAVED:
          this.recentlySavedTimeout = setTimeout(() => {
            this.status = null;
          }, 3000);
          break;
      }
    });
  }

}
