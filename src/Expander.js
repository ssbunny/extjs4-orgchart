/**
 * Expander
 *
 * @class Ext.orgchart.Expander
 * @author zhangqiang
 * @date 2017.03.10
 */
Ext.define('Ext.orgchart.Expander', {

    /**
     * @private
     */
    isOrgchartExpander: true,

    /**
     * expander 所属的节点
     */
    node: undefined,


    constructor: function (config) {
        Ext.apply(this, config);

        if (!this.node) {
            Ext.Error.raise('必须指定 node 属性');
        }

        this.node.expander = this;

        this.initialConfig = config;
        this.id = config.id || Ext.id([]._, 'orgchart-expander-');
        this._initSpritesConfig();
        this.createSprite(this.node.container.surface);

        return this;
    },


    _initSpritesConfig: function () {
        var t = this.node.container.settings;
        var outer = {};

        if (t.expanderType === 'square') {
            outer.type = 'rect';
            outer.width = t.expanderSize;
            outer.height = t.expanderSize;
        } else {
            outer.type = 'circle';
            outer.radius = t.expanderSize * .5;
        }

        this._outerConfig = Ext.apply(outer, {
            id: this.id + '-outer',
            stroke: t.connectorColor,
            'stroke-width': t.connectorWidth,
            fill: '#FFF'
        });

        this._innerConfig = Ext.apply({}, {
            id: this.id + '-inner',
            type: 'path',
            stroke: t.connectorColor,
            'stroke-width': t.connectorWidth
        });
    },

    _initInnerPath: function (start, half, radius, slight) {
        var path = [
            'M', start - radius + slight, ' ', half,
            'H', start + radius - slight
        ];
        this._minusPath = path.join('');

        path = path.concat([
            'M', start, ' ', half - radius + slight,
            'V', half + radius - slight
        ]);
        this._plusPath = path.join('');
    },


    /**
     * 绘制
     */
    drawIt: function (animite) {
        var t = this.node.container.settings;
        var type = this.node.expanded ? '-' : '+';

        var radius = t.expanderSize * .5;
        var slight = t.expanderPadding;

        var start = this.node.x + t.nodeWidth + radius + t.nodeBorderWidth * .5 + t.expanderMargin;
        var half = this.node.y + t.nodeHeight * .5;

        var revise = this._outerConfig.type === 'rect' ? -(radius) : 0;

        this._initInnerPath(start, half, radius, slight);

        if (animite === 'move') {
            this._drawItWithAnimiteMove(type, start, half, revise);
        } else {
            this._drawItWithoutAnimite(type, start, half, revise);
        }

        this.sprite.get('outer').setStyle('cursor', 'pointer');
        this.sprite.get('inner').setStyle('cursor', 'pointer');
    },

    _drawItWithAnimiteMove: function (type, start, half, revise) {
        var me = this;
        var duration = 200;
        this.sprite.get('outer').animate({
            duration: duration,
            to: {
                x: start + revise,
                y: half + revise
            }
        });
        this.sprite.get('inner').animate({
            duration: duration,
            to: {
                path: type === '+' ? me._plusPath : me._minusPath
            }
        });
    },

    _drawItWithoutAnimite: function (type, start, half, revise) {
        this.sprite.get('outer').setAttributes({
            x: start + revise,
            y: half + revise
        }, true);
        this.redrawType(type);
    },

    redrawType: function (type) {
        this.sprite.get('inner').setAttributes({
            path: type === '+' ? this._plusPath : this._minusPath
        }, true);
    },


    createSprite: function (surface) {
        this.surface = surface;

        var outerSprite = Ext.create('Ext.draw.Sprite', this._outerConfig);
        var innerSprite = Ext.create('Ext.draw.Sprite', this._innerConfig);

        this.sprite = Ext.create('Ext.draw.CompositeSprite', {
            surface: surface,
            id: this.id + '-expandergroup'
        });

        this.sprite.add('outer', outerSprite);
        this.sprite.add('inner', innerSprite);

        this.sprite.on('click', this.handler, this);

        surface.add(outerSprite);
        surface.add(innerSprite);

        return this.sprite;
    },


    destroyIt: function () {
        this.sprite.get('outer').destroy();
        this.sprite.get('inner').destroy();
        this.sprite.destroy();

        delete this.sprite;
        delete this.node.expander;
    },


    handler: function () {
        var me = this;

        if (!this.node.children) {
            return;
        }

        if (this.isExpanding) {
            return;
        }

        this.isExpanding = true;

        setTimeout(function () { // 动画
            me.isExpanding = false;
        }, 300);

        if (this.node.expanded) {
            this.node.collapseIt();
            this.redrawType('+');
        } else {
            this.node.expandIt();
            this.redrawType('-');
        }
    }

});