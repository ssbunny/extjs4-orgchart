Ext.onReady(function () {

    Ext.create('Ext.orgchart.OrgChart', {
        renderTo: Ext.getBody(),

        width: 650,
        height: 600,

        root: {
            nameText: '0',
            valueText: '0',
            expanded: true,
            color: 'red',
            children: [
                {
                    nameText: '0-0',
                    valueText: '1',
                    expanded: true,
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
                            nameText: '0-1-0',
                            valueText: '91.2',
                            color: 'red'
                        },
                        {
                            nameText: '0-1-1',
                            valueText: '91.2',
                            color: 'red'
                        }
                    ]
                },
                {
                    nameText: '0-2',
                    valueText: '5.7',
                    expanded: true,
                    color: 'green',
                    children: [
                        {
                            nameText: '0-2-0',
                            valueText: '91.2',
                            color: 'red'
                        },
                        {
                            nameText: '0-2-1',
                            valueText: '91.2',
                            color: 'red'
                        }
                    ]
                }
            ]
        }
    });
});
