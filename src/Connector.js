/**
 * 连接器
 *
 * @class Ext.orgchart.Connector
 * @author zhangqiang
 * @date 2017.03.10
 */
Ext.define('Ext.orgchart.Connector', {

    isOrgchartConnector: true,

    /**
     * Connector 所属的节点
     */
    node: undefined,

    constructor: function (config) {
        var s;

        Ext.apply(this, config);

        if (!this.node) {
            Ext.Error.raise('必须指定 node 属性');
        }

        this.node.connector = this;
        this.id = config.id || Ext.id([]._, 'orgchart-connector-');

        s = this.node.container.settings;

        this._pathConfig = Ext.apply({}, {
            id: this.id + '-path',
            type: 'path',
            stroke: s.connectorColor,
            'stroke-width': s.connectorWidth
        });

        this.createSprite(this.node.container.surface);
        return this;
    },


    createSprite: function (surface) {
        this.surface = surface;
        this.sprite = Ext.create('Ext.draw.Sprite', this._pathConfig);
        surface.add(this.sprite);
        return this.sprite;
    },


    drawIt: function (stretching) {
        var node1 = this.node.parent;
        var node2 = this.node;

        var source = node1.getSourceAnchor();
        var target = node2.getTargetAnchor();

        var half = (target.x - source.x) *.5;
        var path = [
            'M', source.x, ' ', source.y,
            'H', source.x + half,
            'V', target.y,
            'H', target.x
        ].join('');

        if (stretching) {
            this.sprite.animate({
                duration: 200,
                to: {
                    path: path
                }
            });
        } else {
            this.sprite.setAttributes({
                path: path
            }, true);
        }
    },

    destroyIt: function () {
        this.sprite.destroy();
        delete this.node.connector;
    }

});