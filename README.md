# coinWatch

watch okx market coin price

在线查看欧易市场上的币种交易信息

## 如何使用

1.插件市场搜索 coinWatch 即可

![image-20230315142016591](.\img\image-20230315142016591.png)

2.需要翻墙！需要翻墙！需要翻墙！才能获取数据

### coin-price-watch

 设置想要查看的币种只要输入币种名即可如'btc','eth'

```
  "coin-price-watch": [
    "eth",
    "btc"
  ],
```

### coin-price-coinPair

 设置所请求数据的币种对，默认为 USDT

### coin-price-isShowAll

 是否加载欧易市场里的全部数据，为是即加载，为否仅会加载自选（五星明亮）的币种，

### coin-price-updateTime

数据请求刷新的时间间隔，默认为 1000ms
