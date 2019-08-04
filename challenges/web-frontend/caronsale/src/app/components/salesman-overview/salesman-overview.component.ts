import { Component, OnInit, OnDestroy } from '@angular/core';
import { SalesmanUserService } from 'src/app/services/salesman/salesman-user.service';
import { Auction } from 'src/app/models/auction';
import { Observable, timer, Subject, of } from 'rxjs';
import { takeUntil, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-salesman-overview',
  templateUrl: './salesman-overview.component.html',
  styleUrls: ['./salesman-overview.component.scss']
})

export class SalesmanOverviewComponent implements OnInit, OnDestroy {
  // Kill subject to stop all requests for component
  private killTrigger: Subject<void> = new Subject();

  private fetchData$: Observable<Auction[]> = this.salesmanUserService.getAuctions();
  private refreshInterval$: Observable<string | Auction[]> = timer(0, 20000)
    .pipe(
      takeUntil(this.killTrigger),
      switchMap(() => this.fetchData$),
      catchError(error => of('Error'))
  );

  auctions$: Subject<Auction[]> = new Subject<Auction[]>();
  didLoadData = false;

  constructor(private salesmanUserService: SalesmanUserService) { }

  ngOnInit() {
    this.refreshInterval$.subscribe((auctions: Auction[]) => {
      this.auctions$.next(auctions);
      this.didLoadData = true;
    });
  }

  ngOnDestroy() {
    this.killTrigger.next();
  }

  trackById(index: number, auction: Auction): number {
    return auction.id;
  }
}
