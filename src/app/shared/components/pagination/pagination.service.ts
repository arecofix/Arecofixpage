import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  currentPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((params)=>(params.get('_page')?+params.get('_page')! : 1)),
      map((page)=>(isNaN(page) ? 1 : page))
    ),{
      initialValue:1
    }
  );
}
