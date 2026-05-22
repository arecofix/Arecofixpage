import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppTitleStrategy extends TitleStrategy {
  private readonly titleService = inject(Title);

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      const finalTitle = title.includes('Arecofix') ? title : `${title} | Arecofix`;
      this.titleService.setTitle(finalTitle);
    } else {
      this.titleService.setTitle('Arecofix - Servicio Técnico y Soluciones IT');
    }
  }
}
