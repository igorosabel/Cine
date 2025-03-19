import { Component, InputSignal, input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  imports: [],
})
export default class LoadingComponent {
  big: InputSignal<boolean> = input<boolean>(false);
  button: InputSignal<boolean> = input<boolean>(false);
}
