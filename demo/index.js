Ext.onReady(function () {

    var height = 500;
    var width = 800;

    var root = {
        nameText: 'Br',
        valueText: '',
        expanded: true,
        children: [
            {
                nameText: 'Google Chrome',
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
        root: root
    });


    var tab = Ext.create('Ext.tab.Panel', {
        width: width,
        height: height,
        renderTo: document.body,
        items: [d2, d3]
    });
    tab.center();
});
