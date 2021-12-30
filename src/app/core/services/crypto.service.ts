import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { Coin } from "../models";

const cryptoUrl = `${environment.apiUrl}/CoinMarketCap`;
@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  constructor(private http: HttpClient) {

  }

  getTopMarketCoins() : Observable<Coin[]>{
    return this.http.get<Coin[]>(`${cryptoUrl}/list-coins`);
  }
}
