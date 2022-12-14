import * as vscode from 'vscode';
//获取用户设置的监听币种
const getConfigFileCoin = () => {
  const config = vscode.workspace.getConfiguration();
  return config.get('coin-price-watch') as string[];
};
//获取用户设置的更新时间
const getConfigFileTime = () => {
  const config = vscode.workspace.getConfiguration();
  return config.get('coin-price-updateTime') as number;
};
//获取用户设置的是否请求全部数据
const getConfigFileAllData = () => {
  const config = vscode.workspace.getConfiguration();
  return config.get('coin-price-isShowAll') as boolean;
};
//获取用户设置的比对币种
const getConfigFileCoinPair = () => {
  const config = vscode.workspace.getConfiguration();
  return config.get('coin-price-coinPair') as string;
};
//匹配用户设为最爱的币种
const getOKECoinInfo = (coinInfo:string) => {
  let strArr = coinInfo.split('-');
  let userCoin = getConfigFileCoin();
  let isFavourite = false;
  if(userCoin.findIndex(i=> i.toUpperCase()===strArr[0]) >= 0) {isFavourite = true;}
  return isFavourite;
};

export {
  getConfigFileCoin,
  getConfigFileTime,
  getConfigFileAllData,
  getOKECoinInfo,
  getConfigFileCoinPair
};