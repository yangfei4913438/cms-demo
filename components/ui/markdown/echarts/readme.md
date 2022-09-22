# 使用说明

因为字符串解析，目前没有什么比较好的办法，所以需要手动将js对象序列化为JSON字符串，然后再填到文章里面。
如果直接写的js对象在markdown中，那么渲染的时候，因为无法执行JSON对象的parse方法，所以会直接在页面提示错误信息。


#### 操作方法

随便创建一个js文件，然后像下面一样序列化选项即可。

```javascript
const option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
};

// 复制输出的json字符串
console.log(JSON.stringify(option));
```


**写在 markdown 中的格式**

```
```echarts
  {
    "xAxis": {
      "type": "category",
      "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    "yAxis": {
      "type": "value"
    },
    "series": [
      {
        "data": [150, 230, 224, 218, 135, 147, 260],
        "type": "line"
      }
    ]
  }
```
```

