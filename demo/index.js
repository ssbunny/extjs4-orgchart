Ext.onReady(function () {

    var height = 500;
    var width = 800;

    var root = {
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
    };


    var d1 = Ext.create('Ext.orgchart.OrgChart', {
        title: 'Demo 1',
        width: width,
        height: height,
        settings: Ext.create('Ext.orgchart.Settings', {
            nodeHeight: 45
        }),
        root: root
    });

    var d2 = Ext.create('Ext.orgchart.OrgChart', {
        title: 'Demo 2',

        width: width,
        height: height,

        root: {
            nameText: '0',
            valueText: '0',
            expanded: true,
            children: [
                {
                    nameText: '0-0',
                    valueText: '1',
                    expanded: true,
                    color: '#dd0000',
                    children: [
                        {
                            nameText: '0-0-0',
                            valueText: '2',
                            children: [
                                {
                                    nameText: '0-0-1-0',
                                    valueText: '3'
                                },
                                {
                                    nameText: '0-0-1-1',
                                    valueText: '4'
                                },
                                {
                                    nameText: '0-0-1-2',
                                    valueText: '5'
                                }
                            ]
                        },
                        {
                            nameText: '0-0-1',
                            valueText: '6'
                        },
                        {
                            nameText: '0-0-2',
                            valueText: '7',
                            color: '#8c2d7f'
                        },
                        {
                            nameText: '0-0-3',
                            valueText: '8'
                        }
                    ]
                },
                {
                    nameText: '0-1',
                    valueText: '9',
                    children: [
                        {
                            nameText: '0-1-0',
                            valueText: '10'
                        },
                        {
                            nameText: '0-1-1',
                            valueText: '11'
                        }
                    ]
                },
                {
                    nameText: '0-2',
                    valueText: '12',
                    expanded: true,
                    children: [
                        {
                            nameText: '0-2-0',
                            valueText: '13',
                            color: '#269652'
                        },
                        {
                            nameText: '0-2-1',
                            valueText: '14'
                        }
                    ]
                }
            ]
        }
    });

    var d3 = Ext.create('Ext.orgchart.OrgChart', {
        title: 'Demo 3',
        width: width,
        height: height,
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
        }),
        root: root
    });


    var tab = Ext.create('Ext.tab.Panel', {
        width: width,
        height: height,
        renderTo: document.body,
        items: [d1, d2, d3]
    });
    tab.center();
});