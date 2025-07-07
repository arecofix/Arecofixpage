import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'is-empty',
  imports: [],
  template: `
    <div
      role="alert"
      class="alert alert-warning alert-outline text-center p-10 m-10"
    >
      <span> No Hay Datos Para Mostrar </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsEmptyComponent {}
