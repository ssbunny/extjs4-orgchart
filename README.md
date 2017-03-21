# OrgChart

OrgChart 是基于 ExtJS4 实现的组织机构图。它不仅可以用来绘制组织机构图，
也可以扩展实现各种树型结构图。

[演示效果](demo/index.html)

它会根据传入的数据自动展开相应状态，使用时只需要指定 `width` `height` 及 `root` 属性即可：

```javascript
Ext.create('Ext.orgchart.OrgChart', {
    width: width,
    height: height,
    root: {
        nameText: '网页流量',
        valueText: '',
        expanded: true,
        children: [
            {
                nameText: '浏览器市场份额',
                expanded: true,
                children: [
                    {
                        nameText: 'Chrome',
                        valueText: '40.35%'
                    },
                    {
                        nameText: 'IE 8.0',
                        valueText: '14.01%'
                    },
                    {
                        nameText: 'IE 9.0',
                        valueText: '7.05%'
                    },
                    {
                        nameText: 'QQ',
                        valueText: '5.94%'
                    },
                    {
                        nameText: '其他',
                        valueText: '32.66%'
                    }
                ]
            },
            {
                nameText: '屏幕分辨率',
                children: [
                    {
                        nameText: '360x640',
                        valueText: '23.03%'
                    },
                    {
                        nameText: '1920x1080',
                        valueText: '11.93%'
                    },
                    {
                        nameText: '1366x768',
                        valueText: '7.09%'
                    }
                ]
            }
        ]
    }
});
```

也可以根据需要自定义，创建自己的 `settings` 实例即可：

```javascript
Ext.create('Ext.orgchart.OrgChart', {
    ...
    settings: Ext.create('Ext.orgchart.Settings', {
        horizontalSpace: 5,
        verticalSpace: 50,
        nodeHeight: 40,
        nodeWidth: 150,
        nodeBorderRadius: 20,
        expanderType: 'circle',
        nodeBackgroundColor: '#ff662a',
        connectorColor: '#e7e7e7',
        connectorWidth: 2,
        connectorMargin: 0,
        nodeBorderColor: '#e7e7e7',
        nodeBorderWidth: 2
    })
});
```