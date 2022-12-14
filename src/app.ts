import * as vscode from 'vscode';
import axios from 'axios'; 
import { getConfigFileCoin, getConfigFileTime, getOKECoinInfo,getConfigFileAllData,getConfigFileCoinPair } from './util';
import { BASIC_URL, TOTAL_COIN } from './config/index';
import TreeProvider from "./TreeProvider";

class Index {
  private activateContext;
  //更新时间
  private updateTime: number | undefined;
  //用户喜好币种
  private userCoins;
  //是否展示全部数据
  private isAll;
  //对照币种
  private coinPair;
  //循环定时器
  private timer: any;
  private statusBarItems: {
    [propName: string]: any
  };
  
  public constructor(context: any){
    this.activateContext = context;
    this.statusBarItems = {};
    this.userCoins = getConfigFileCoin();
    this.isAll = getConfigFileAllData();
    this.updateTime = getConfigFileTime();
    this.coinPair = getConfigFileCoinPair();
    this.timer = null;
    this.init();
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e)=> this.configChange(e)));
  }

  public configChange (e:any) {
    this.timer && clearInterval(this.timer);
    this.userCoins = getConfigFileCoin();
    this.isAll = getConfigFileAllData();
    this.updateTime = getConfigFileTime();
    this.coinPair = getConfigFileCoinPair();
    // Object.keys(this.statusBarItems).forEach((item) => {
    //   if (codes.indexOf(item) === -1) {
    //       this.statusBarItems[item].hide();
    //       this.statusBarItems[item].dispose();
    //       delete this.statusBarItems[item];
    //   }
    // });
    this.init();
  }

  public getAllData () {
    axios(TOTAL_COIN,{
      baseURL: BASIC_URL
    }).then((res)=>{
      const result = res.data;
      if(res.status === 200 && result.data.length) {
        // this.setStatusBar(result.data);
        this.setActivityBar(result.data);
      }
    });
  }

  // public setStatusBar (data: any) {
  //   data.forEach((item:any) => {
  //     const { instId } = item;
  //     const coinInfo = getOKECoinInfo(instId);
  //     if(!coinInfo) {return;} 
  //     if (this.userCoins.indexOf(instId) !== -1) {
  //         const statusBarItemsText = `「${coinInfo}」${item.bidPx} ${coinInfo} ${item.bidPx > item.sodUtc0 ? '📈' : '📉'} ${((item.bidPx - item.sodUtc0) / item.sodUtc0 * 100).toFixed(2)}%`;
  //         if (this.statusBarItems[instId]) {
  //             this.statusBarItems[instId].text = statusBarItemsText;
  //         } else {
  //             this.statusBarItems[instId] = this.createStatusBarItem(statusBarItemsText);
  //         }
  //     }
  //   });
  // }

  public createStatusBarItem(text = '') {
    const barItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    barItem.text = text;
    barItem.show();
    return barItem;
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
      let trading = instId.split('-');
      //只展示用户设置的币种数据
      if(!this.isAll){
        // 没匹配到对应币种就返回
        if(this.userCoins.findIndex(i=> i.toUpperCase() === trading[0]) < 0) {return;}
      }
      if(trading[1] !== this.coinPair.toUpperCase()) {return;}
      const isFavourite = getOKECoinInfo(instId);
      const isFocus = isFavourite ? 1: 0;
      const newItem = {
          label: `「${instId}」${item.bidPx} ${item.bidPx > item.sodUtc0 ? '📈' : '📉'} ${((item.bidPx - item.sodUtc0) / item.sodUtc0 * 100).toFixed(2)}%`,
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