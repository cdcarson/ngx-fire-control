import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-array-of-strings-control',
  templateUrl: './array-of-strings-control.component.html',
  styleUrls: ['./array-of-strings-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArrayOfStringsControlComponent),
      multi: true,
    }
  ]
})
export class ArrayOfStringsControlComponent implements OnInit, ControlValueAccessor {
  @Input() options: string[];
  model: any = [];
  fg: FormGroup;
  onChange: (currentVal?) => any = () => {};
  onTouched: (currentVal?) => any = () => {};

  constructor() {}

  ngOnInit() {
    this.fg = new FormGroup({});
    this.options.forEach(str => {
      this.fg.addControl(str, new FormControl(false));
    });
    this.fg.valueChanges.subscribe((val) => {
      const dbVal = [];
      this.options.forEach(str => {
        if (val[str]) {
          dbVal.push(str);
        }
      });
      this.onChange(dbVal);
      this.onTouched(dbVal);
    });
  }

  writeValue(val: any) {
    this.model = val || [];
    this.model.forEach(str => {
      this.fg.get(str).setValue(true, {emitEvent: false});
    });
  }

  registerOnChange(fn: ((currentVal?) => any)): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: ((currentVal?) => any)): void {
    this.onTouched = fn;
  }

  toggleSelected(value: string) {
    // const o = this.selectedOptions.find((t) => t.value === value);
    // if (o) {
    //   o.selected = ! o.selected;
    //   const realValue = [];
    //   this.selectedOptions.forEach(entry => {
    //     if (entry.selected) {
    //       realValue.push(entry.value);
    //     }
    //   });
    //   this.onChange(realValue);
    //   this.onTouched(realValue);
    // }
  }

}
