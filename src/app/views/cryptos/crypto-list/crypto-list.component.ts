import { Component, OnInit } from '@angular/core';
import { Coin } from '@app/core/models';
import { CryptoService } from '@app/core/services/crypto.service';

@Component({
  selector: 'app-crypto-list',
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.css']
})
export class CryptoListComponent implements OnInit {

  private cryptos : Coin[];
  isLoading = false;
  constructor(private cryptoService: CryptoService) { }

  ngOnInit(): void {
  }

  getTopMarketCapCoins() {
    this.isLoading = true;
    this.cryptoService.getTopMarketCoins().subscribe(data=> {this.cryptos = data;}, () => this.isLoading = false, () => this.isLoading = false);
  }

}
