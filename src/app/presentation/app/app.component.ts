import { Component, OnInit, inject } from '@angular/core';
import { CashMovementsSubscriberService } from '@app/application/cash-movements/cash-movements-subscriber.service';
import { InvoiceSubscriberService } from '@app/application/invoice/invoice-subscriber.service';
import { SuppliersSubscriberService } from '@app/application/suppliers/suppliers-subscriber.service';

/**
 * Root Presentation Component that registers all domain event subscribers on init.
 */
@Component({
  selector: 'app-root-presentation',
  standalone: true,
  template: '',
})
export class AppComponent implements OnInit {
  private cashSubscriber = inject(CashMovementsSubscriberService);
  private invoiceSubscriber = inject(InvoiceSubscriberService);
  private suppliersSubscriber = inject(SuppliersSubscriberService);

  ngOnInit(): void {
    this.cashSubscriber.init();
    this.invoiceSubscriber.init();
    this.suppliersSubscriber.init();
  }
}
