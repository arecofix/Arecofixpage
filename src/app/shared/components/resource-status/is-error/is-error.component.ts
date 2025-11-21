import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'is-error',
  imports: [],
  template: `
    <div
      role="alert"
      class="alert alert-error alert-outline text-center p-10 m-10"
    >
      <span> Ups! Ocurrio Un Error Al Cargar Los Datos </span>
    </div>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsErrorComponent {}
