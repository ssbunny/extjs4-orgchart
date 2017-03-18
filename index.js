Ext.onReady(function () {

    Ext.create('Ext.orgchart.OrgChart', {
        renderTo: Ext.getBody(),

        width: 650,
        height: 600,

        style: {
            backgroundColor: '#EEE',
            marginBottom: '10px'
        },

        root: {
            nameText: '0',
            valueText: '0',
            expanded: true,
            children: [
                {
                    nameText: '0-0',
                    valueText: '1',
                    color: 'red',
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
                            valueText: '7'
                        },
                        {
                            nameText: '0-0-3',
                            valueText: '8'
                        }
                    ]
                },
                {
                    nameText: '0-1',
                    valueText: '8900',
                    children: [
                        {
                            id: '0-1-0',
                            nameText: '排烟损失(%)0-1-0',
                            valueText: '91.2',
                            color: 'red'
                        },
                        {
                            id: '0-1-1',
                            nameText: '排烟损失(%)0-1-1',
                            valueText: '91.2',
                            color: 'red'
                        }
                    ]
                },
                {
                    id: '0-2',
                    nameText: '厂用电率(%)0-2',
                    valueText: '5.7',
                    expanded: true,
                    color: 'green',
                    children: [
                        {
                            id: '0-2-0',
                            nameText: '排烟损失(%)0-2-0',
                            valueText: '91.2',
                            color: 'red'
                        },
                        {
                            id: '0-2-1',
                            nameText: '排烟损失(%)0-2-1',
                            valueText: '91.2',
                            color: 'red'
                        }
                    ]
                }
            ]
        }
    });
});
