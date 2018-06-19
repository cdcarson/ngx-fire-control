import { fakeAsync, tick } from '@angular/core/testing';

import { NgxFireControlDirective } from './ngx-fire-control.directive';
import { NgxFireControlStatus } from './ngx-fire-control-status';

import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
describe('NgxFireControlDirective', () => {
  let control: FormControl;
  let model: any;
  let afDb: any;
  let afDbObject;
  let dbVal$: BehaviorSubject<any>;
  let elementRef: any;
  let nativeElement;

  beforeEach(() => {
    nativeElement = document.createElement('textarea');
    elementRef = {nativeElement: nativeElement};
    dbVal$ = new BehaviorSubject('foo');
      afDbObject = {
      valueChanges: jasmine.createSpy().and.returnValue(dbVal$.asObservable()),
      set: jasmine.createSpy().and.returnValue(Promise.resolve()),
    };
    afDb = {
      object: jasmine.createSpy().and.returnValue(afDbObject)
    };
    control = new FormControl(null);
    model = {control: control};
  });
  it('should create an instance', () => {
    const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
    expect(directive).toBeTruthy();
  });
  it('should have an error$ observable property', () => {
    const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
    expect(directive.error$).toBeTruthy();
  });
  it('should have an error property that is originally null', () => {
    const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
    expect(directive.error).toBe(null);
  });
  it('should have an status$ observable property', () => {
    const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
    expect(directive.status$).toBeTruthy();
  });
  it('should have an error property that is originally INITIALIZING', () => {
    const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
    expect(directive.status).toBe(NgxFireControlStatus.INITIALIZING);
  });
  it('should subscribe and unsubscribe from the database value', () => {
    const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
    directive.ngOnInit();
    expect(dbVal$.observers.length).toBe(1);
    directive.ngOnDestroy();
    expect(dbVal$.observers.length).toBe(0);
  });

  describe('database changes', () => {
    it('should set the value', () => {
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      directive.ngOnInit();
      expect(control.value).toBe(dbVal$.value);
      dbVal$.next('bar');
      expect(control.value).toBe(dbVal$.value);
    });
    it('should set an error if there is an access error', () => {
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      directive.ngOnInit();
      expect(control.value).toBe(dbVal$.value);
      const e = new Error('foo');
      dbVal$.error(e);
      expect(directive.error).toBe(e);
      expect(directive.status).toBe(NgxFireControlStatus.ERROR);
    });
  });

  describe('control changes', () => {
    it('should update the database when the control changes', fakeAsync(() => {
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      directive.ngOnInit();
      control.setValue('abc');
      tick(500);
      expect((directive as any).control).toBe(control);
      expect(afDbObject.set).toHaveBeenCalledWith('abc');
    }));
    it('should not update the database when the control changes if it is invalid', fakeAsync(() => {
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      directive.ngOnInit();
      control.setValue('abc');
      control.setErrors({invalid: true});
      tick(500);
      expect((directive as any).control).toBe(control);
      expect(afDbObject.set).not.toHaveBeenCalledWith('abc');
      expect(directive.status).toBe(NgxFireControlStatus.INVALID);
    }));
    it('should update the database with the trimmed version if the val is a string and trim !== false', fakeAsync(() => {
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      directive.ngOnInit();
      control.setValue('   abc    ');
      tick(500);
      expect((directive as any).control).toBe(control);
      expect(afDbObject.set).toHaveBeenCalledWith('abc');
    }));
    it('should not trim if the val is a string and trim === false', fakeAsync(() => {
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      directive.trim = false;
      directive.ngOnInit();
      control.setValue('   abc    ');
      tick(500);
      expect((directive as any).control).toBe(control);
      expect(afDbObject.set).toHaveBeenCalledWith('   abc    ');
    }));
    it('should not trim if the val is not a string and trim !== false', fakeAsync(() => {
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      directive.trim = true;
      directive.ngOnInit();
      control.setValue(7);
      tick(500);
      expect((directive as any).control).toBe(control);
      expect(afDbObject.set).toHaveBeenCalledWith(7);
    }));

    it('should set an error if set returns an error', fakeAsync(() => {
      const e = new Error('foo');
      afDbObject.set.and.callFake(() => Promise.reject(e));
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      directive.ngOnInit();
      control.setValue('shghgshg');
      tick(501);
      expect(directive.error).toBe(e);
      expect(directive.status).toBe(NgxFireControlStatus.ERROR);
    }));

  });

  describe('setting debounce', () => {
    it('it should set the default debounce if the element is a textarea and debounce is not set as an input', () => {
      nativeElement = document.createElement('textarea');
      elementRef = {nativeElement: nativeElement};
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      expect(directive.debounce).toBeUndefined();
      directive.ngOnInit();
      expect(directive.debounce).toBe(500);
    });
    it('it should set the debounce to a value that is passed in', () => {
      nativeElement = document.createElement('textarea');
      elementRef = {nativeElement: nativeElement};
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      directive.debounce = 200;
      directive.ngOnInit();
      expect(directive.debounce).toBe(200);
    });
    it('it should set the debounce to the default if the value that is passed in is less than 0', () => {
      nativeElement = document.createElement('textarea');
      elementRef = {nativeElement: nativeElement};
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      directive.debounce = -200;
      directive.ngOnInit();
      expect(directive.debounce).toBe(500);
    });
    it('it should be able to deal with debounce as a string', () => {
      nativeElement = document.createElement('textarea');
      elementRef = {nativeElement: nativeElement};
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      directive.debounce = '200';
      directive.ngOnInit();
      expect(directive.debounce).toBe(200);
    });

    it('it should set the debounce to 0 if the element is a input type checkbox and debounce is not set as an input', () => {
      nativeElement = document.createElement('input');
      nativeElement.setAttribute('type', 'checkbox');
      elementRef = {nativeElement: nativeElement};
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      expect(directive.debounce).toBeUndefined();
      directive.ngOnInit();
      expect(directive.debounce).toBe(0);
    });
    it('it should set the debounce to the value if the element is a input type checkbox and debounce is set as an input', () => {
      nativeElement = document.createElement('input');
      nativeElement.setAttribute('type', 'checkbox');
      elementRef = {nativeElement: nativeElement};
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      directive.debounce = 4;
      directive.ngOnInit();
      expect(directive.debounce).toBe(4);
    });
    it('it should set the debounce to 0 if the element is a input type radio and debounce is not set as an input', () => {
      nativeElement = document.createElement('input');
      nativeElement.setAttribute('type', 'radio');
      elementRef = {nativeElement: nativeElement};
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      expect(directive.debounce).toBeUndefined();
      directive.ngOnInit();
      expect(directive.debounce).toBe(0);
    });
    it('it should set the debounce to the value if the element is a input type radio and debounce is set as an input', () => {
      nativeElement = document.createElement('input');
      nativeElement.setAttribute('type', 'radio');
      elementRef = {nativeElement: nativeElement};
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      directive.debounce = 4;
      directive.ngOnInit();
      expect(directive.debounce).toBe(4);
    });
    it('it should set the default debounce if the element is an input and debounce is not set as an input', () => {
      nativeElement = document.createElement('input');
      elementRef = {nativeElement: nativeElement};
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      expect(directive.debounce).toBeUndefined();
      directive.ngOnInit();
      expect(directive.debounce).toBe(500);
    });
    it('it should set the debounce to the default if the element is a input type text and debounce is not set as an input', () => {
      nativeElement = document.createElement('input');
      nativeElement.setAttribute('type', 'text');
      elementRef = {nativeElement: nativeElement};
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      expect(directive.debounce).toBeUndefined();
      directive.ngOnInit();
      expect(directive.debounce).toBe(500);
    });
    it('it should set the debounce to the passed value if the element is a input type text and debounce is set as an input', () => {
      nativeElement = document.createElement('input');
      nativeElement.setAttribute('type', 'text');
      elementRef = {nativeElement: nativeElement};
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      directive.debounce = 600;
      directive.ngOnInit();
      expect(directive.debounce).toBe(600);
    });
    it('it should set the debounce to 0 if the element is a select and debounce is not set as an input', () => {
      nativeElement = document.createElement('select');
      elementRef = {nativeElement: nativeElement};
      const directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      expect(directive.debounce).toBeUndefined();
      directive.ngOnInit();
      expect(directive.debounce).toBe(0);
    });
  });

  describe('properties', () => {
    let errorValues: any[];
    let statusValues: any[];
    let directive;
    beforeEach(() => {
      errorValues = [];
      statusValues = [];
      directive = new NgxFireControlDirective(model, afDb, elementRef, 500);
      directive.error$.subscribe(val => errorValues.push(val));
      directive.status$.subscribe(val => statusValues.push(val));
      directive.ngOnInit();
    });
    it('should have originally set status to INITIALIZING, then SYNCED', () => {
      expect(statusValues).toEqual([NgxFireControlStatus.INITIALIZING, NgxFireControlStatus.SYNCED]);
    });
    it('should set the status to saving then saved when the control is saved', fakeAsync(() => {
      control.setValue('gsfhgshgf');
      tick(500);
      expect(statusValues).toEqual([
        NgxFireControlStatus.INITIALIZING,
        NgxFireControlStatus.SYNCED,
        NgxFireControlStatus.SAVING,
        NgxFireControlStatus.SAVED
      ]);
      control.setValue('hgdkjhfjgkjgd');
      tick(500);
      expect(statusValues).toEqual([
        NgxFireControlStatus.INITIALIZING,
        NgxFireControlStatus.SYNCED,
        NgxFireControlStatus.SAVING,
        NgxFireControlStatus.SAVED,
        NgxFireControlStatus.SAVING,
        NgxFireControlStatus.SAVED
      ]);
    }));

  });
});
