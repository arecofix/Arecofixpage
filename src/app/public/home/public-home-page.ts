import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-public-home-page',
  imports: [],
  templateUrl: './public-home-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHomePage {
  title: string = '¡Bienvenido a Arecofix!';

  message: string =
    'Descubre nuestra increíble colección de productos y categorías. Explora todo lo que tenemos para ofrecerte en nuestra tienda online.';
}
