import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {
  WalletActionTypes,
  WalletBalanceUpdated,
  WalletCleanup,
  WalletGenerated,
  WalletSetup,
  WalletSetupFailed
} from './wallet.actions';
import {WalletService} from '../services/wallet.service';
import {LoginSuccessResponse, SignupSuccessResponse} from '../../auth/models/authentication';
import {LocalStorageToken} from '../../../core/shared/helpers/local-storage.helper';
import {UserCleanup} from '../../user/store/user.actions';
import {ISimpleWallet} from '../models/simple-wallet';

@Injectable()
export class WalletEffects {

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(LocalStorageToken) private localStorage: Storage,
    private actions: Actions,
    private walletService: WalletService,
  ) {
  }

  /**
   * If the wallet is defined during the log in, it will set it locally.
   * If the wallet is not defined during the log in, it will create, save and set a new one.
   *
   * This needs to be booletproof code! @todo 100% tests coverage.
   */
  @Effect()
  public WalletSetup: Observable<any> = this.actions.pipe(
    ofType(WalletActionTypes.WALLET_SETUP),
    map((action: WalletSetup) => action.payload),
    switchMap((payload?: LoginSuccessResponse) => this.walletService.loadWallet(payload)
      .pipe(
        map((wallet: ISimpleWallet) => new WalletGenerated({wallet})),
        catchError(() => of(new WalletSetupFailed()))
      )
    ),
  );

  @Effect()
  public WalletSetupFailed: Observable<any> = this.actions.pipe(
    ofType(WalletActionTypes.WALLET_SETUP_FAILED),
    switchMap(() => [new UserCleanup(), new WalletCleanup()]),
  );

  @Effect({dispatch: false})
  public WalletCleanup: Observable<any> = this.actions.pipe(
    ofType(WalletActionTypes.WALLET_CLEANUP),
    tap(() => {
      this.walletService.unsetWallet();
    }),
  );
}
