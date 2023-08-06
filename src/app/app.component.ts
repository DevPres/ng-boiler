import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ngb-root',
  standalone:true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-boiler';
}
