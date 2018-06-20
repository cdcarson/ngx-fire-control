import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Reference } from '@firebase/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  uid: string = null;
  ref: Reference;
  constructor(
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      this.uid = user ? user.uid : null;
      this.ref = this.uid ? this.afDb.database.ref(`ngx-fire-control-demo/${this.uid}`) as Reference : null;
    });
    this.afAuth.auth.signInAnonymously();
  }

}
