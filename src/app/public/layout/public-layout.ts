import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PublicLayoutHeader } from './components';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'public-layout',
  imports: [RouterOutlet,PublicLayoutHeader],
  templateUrl: './public-layout.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayout {}
export default PublicLayout;
