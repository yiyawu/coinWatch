import * as vscode from 'vscode';
import axios from 'axios'; 
import { getConfigFileCoin, getConfigFileTime, getOKECoinInfo } from './util';
import { BASIC_URL, TOTAL_COIN } from './config/index';
import TreeProvider from "./TreeProvider";

class Index {
  private activateContext;
  private updateTime: number | undefined;
  private userCoins;
  private timer: any;
  private statusBarItems;
  public constructor(context: any){
    this.activateContext = context;
    this.statusBarItems = {};
    this.userCoins = getConfigFileCoin();
    this.updateTime = getConfigFileTime();
    this.timer = null;
    this.init();
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(()=> this.configChange()));
  }

  public configChange () {
    this.timer && clearInterval(this.timer);
    this.init();
  }
  public getAllData () {
    axios(TOTAL_COIN,{
      baseURL: BASIC_URL
    }).then((res)=>{
      console.log(res);
      const result = res.data;
      if(res.status === 200 && result.data.length) {
        // this.setStatusBar(result.data);
        this.setActivityBar(result.data);
      }
    });
  }
  public setStatusBar (data: any) {

  }
  public setActivityBar (data: any) {
    const coinData = this.formatCoinData(data);
    let provider = new TreeProvider(vscode.workspace.rootPath, coinData, this.activateContext);
    vscode.window.registerTreeDataProvider("USDT", provider);
  }
  public formatCoinData (data: any[]) {
    let coinArr: {
      [propName: string]: unknown
    } = {};
    data.map((item: any)=>{
      const { instId } = item;
      const coinInfo = getOKECoinInfo(instId);
      if(!coinInfo) {return;} 
      const trading = coinInfo;
      const isFocus = this.userCoins.indexOf(instId) === -1 ? 0 : 1;
      const newItem = {
          label: `「${coinInfo}」${item.bidPx} ${item.bidPx > item.sodUtc0 ? '📈' : '📉'} ${((item.bidPx - item.sodUtc0) / item.sodUtc0 * 100).toFixed(2)}%`,
          icon: `star${isFocus}.png`,
          symbol: instId,
          extension: "coin.focus"
      };
      coinArr[trading] = newItem; 
    });
    return coinArr;
  }
  public init () {
    this.getAllData();
    this.timer = setInterval(()=> {
      this.getAllData();
    }, this.updateTime);
  }

}
export default Index;