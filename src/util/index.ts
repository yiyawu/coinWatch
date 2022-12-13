import * as vscode from 'vscode';
//获取用户设置的监听币种
const getConfigFileCoin = () => {
  const config = vscode.workspace.getConfiguration();
  return config.get('coin-price-watch') as string;
};
//获取用户设置的更新时间
const getConfigFileTime = () => {
  const config = vscode.workspace.getConfiguration();
  return config.get('coin-price-updateTime') as number;
};
const getOKECoinInfo = (coinInfo:string) => {
  let trading;
  if (coinInfo.substr(0,3) === 'ETH' ||
  coinInfo.substr(0,3) === 'BTC'||
  coinInfo.substr(0,4) === 'USDT'||
  coinInfo.substr(0,3) === 'LTC'||
  coinInfo.substr(0,4) === 'YFII'||
  coinInfo.substr(0,5) === 'WAVES' ||
  coinInfo.substr(0,4) === 'USTC' ||
  coinInfo.substr(0,3) === 'BSV') 
  {
    let strArr = coinInfo.split('-');
    if(strArr[1] === 'USDT') {trading = coinInfo;}
  }
  return trading;
};

export {
  getConfigFileCoin,
  getConfigFileTime,
  getOKECoinInfo
};