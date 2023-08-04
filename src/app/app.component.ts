import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone:true,
  template: `
    <div>
      <h1> Test {{ title }} </h1>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-boiler';
}
