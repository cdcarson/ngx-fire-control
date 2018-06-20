import { Directive, Input, OnInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { NgControl, AbstractControl } from '@angular/forms';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Reference, DataSnapshot } from '@firebase/database';
import { NGX_FIRE_CONTROL_DEBOUNCE_DEFAULT } from './ngx-fire-control-debounce-default';
import { NgxFireControlStatus } from './ngx-fire-control-status';



@Directive({
  selector: '[ngxFireControl]',
  exportAs: 'ngxFireControl'
})
export class NgxFireControlDirective implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private control: AbstractControl;
  private status$$: BehaviorSubject<NgxFireControlStatus> = new BehaviorSubject(NgxFireControlStatus.INITIALIZING);
  private object: AngularFireObject<any>;
  get status$(): Observable<NgxFireControlStatus> {
    return this.status$$.asObservable();
  }
  get status(): NgxFireControlStatus {
    return this.status$$.value;
  }
  private error$$: BehaviorSubject<Error> = new BehaviorSubject(null);
  get error$(): Observable<Error> {
    return this.error$$.asObservable();
  }
  get error(): Error {
    return this.error$$.value;
  }

  @Input() ngxFireControl: Reference | string;
  @Input() debounce: any;
  @Input() trim: any;

  constructor(
    private model: NgControl,
    private afDb: AngularFireDatabase,
    private elementRef: ElementRef,
    @Inject(NGX_FIRE_CONTROL_DEBOUNCE_DEFAULT) private debounceDefault: number
  ) {}

  ngOnInit() {
    this.debounce = parseInt(this.debounce, 10);
    if (isNaN(this.debounce) || this.debounce < 0) {
      this.debounce = this.getDefaultDebounceForElement(this.elementRef.nativeElement);
    }
    this.control = this.model.control;
    this.object = this.afDb.object(this.ngxFireControl);

    this.control.valueChanges
      .pipe(debounceTime(this.debounce))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => {
        if ( undefined === val ) {
          return;
        }
        this.error$$.next(null);
        if (this.control.invalid) {
          this.status$$.next(NgxFireControlStatus.INVALID);
          return;
        }
        this.status$$.next(NgxFireControlStatus.SAVING);
        const trimmed = typeof val === 'string' && this.trim !== false ? val.trim() : val;
        this.object.set(trimmed)
          .then(() => {
            this.status$$.next(NgxFireControlStatus.SAVED);
          })
          .catch(error => {
            this.error$$.next(error);
            this.status$$.next(NgxFireControlStatus.ERROR);
          });
      });

      this.object
        .valueChanges()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((val) => {
          this.control.setValue(val, {emitEvent: false});
          this.status$$.next(NgxFireControlStatus.SYNCED);
        }, (error) => {
          this.error$$.next(error);
          this.status$$.next(NgxFireControlStatus.ERROR);
        });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  getDefaultDebounceForElement(element: HTMLElement): number {
    const nodeName = element.nodeName.toUpperCase();
    if ('INPUT'  === nodeName) {
      const inputType = element.attributes.getNamedItem('type');
      if (! inputType) {
        return this.debounceDefault;
      }
      if (['checkbox', 'radio', 'hidden'].indexOf(inputType.value.toLowerCase()) > -1) {
        return 0;
      }
      return this.debounceDefault;
    }
    if ('TEXTAREA'  === nodeName) {
      return this.debounceDefault;
    }
    return 0;
  }



}
