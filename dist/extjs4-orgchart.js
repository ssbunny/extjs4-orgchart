/**
 * 配置
 *
 * @class Ext.orgchart.Settings
 * @author zhangqiang
 * @date 2017.03.10
 */
Ext.define('Ext.orgchart.Settings', {

    // TODO 水平方向
    horizontal: true,

    // 内边距
    insetPadding: 10,

    // 各节点间的水平间距
    horizontalSpace: 10,

    // 各节点间的最小垂直间距
    verticalSpace: 40,

    // 节点宽度
    nodeWidth: 170,

    // 节点高度
    nodeHeight: 33,

    // 节点边框半径（圆角）
    nodeBorderRadius: 3,

    // 节点边框颜色
    nodeBorderColor: '#EEE',

    // 节点边框宽度
    nodeBorderWidth: 0,

    // 节点背景色
    nodeBackgroundColor: '#2073CC',

    // 节点名文本颜色
    nodeNameColor: '#FFF',

    // 节点名文本字号
    nodeNameFontSize: '11px',

    // 节点名文本Weight
    nodeNameFontWeight: 'normal',

    // 节点名文本字体
    nodeNameFontFamily: 'monospace',

    // 节点值文本颜色
    nodeValueColor: '#FFE847',

    // 节点值文本字号
    nodeValueFontSize: '12px',

    // 节点值文本Weight
    nodeValueFontWeight: 'bold',

    // 节点值文本字体
    nodeValueFontFamily: 'monospace',

    // 节点与其文本内间距
    nodeInsetPadding: 10,

    // TODO 连线类型
    connectorLine: 'Orthogonal', // Straight | Curved | Bezier | Orthogonal

    // 连线的颜色
    connectorColor: '#E88B41',

    // 连线的宽度
    connectorWidth: 1,

    connectorMargin: 2,

    // 折叠按钮的类型
    expanderType: 'circle', // circle | square

    // 折叠按钮的大小
    expanderSize: 14,  // expanderType 为 circle 时表示直径，square 时表示边长

    // 折叠按钮内边距
    expanderPadding: 2,

    expanderMargin: 4,

    constructor: function (config) {
        Ext.apply(this, config);
    }

}, function () {
    this.defaults = new this();
});
/**
 * 节点
 *
 * @class Ext.orgchart.Node
 * @author zhangqiang
 * @date 2017.03.10
 */
Ext.define('Ext.orgchart.Node', {

    /**
     * @private
     */
    isOrgchartNode: true,

    /**
     * 节点名
     * @memberof Ext.orgchart.Node#
     * @member {string}
     * @default
     */
    nameText: '',

    /**
     * 节点值
     * @memberof Ext.orgchart.Node#
     * @member {string|undefined}
     */
    valueText: '',

    /**
     * 节点填充色，使用 HEX 格式
     * @memberof Ext.orgchart.Node#
     * @member {string|undefined}
     * @default Ext.orgchart.Theme 的 nodeBackgroundColor 值
     */
    color: undefined,

    /**
     * 节点展开状态
     * @memberof Ext.orgchart.Node#
     * @member {boolean}
     */
    expanded: false,

    /**
     * 节点深度，根节点为 0
     * @memberof Ext.orgchart.Node#
     * @member {number|undefined}
     */
    depth: undefined,

    /**
     * 节点在其所有兄弟节点中的排序，从 0 开始
     * @memberof Ext.orgchart.Node#
     * @member {number|undefined}
     */
    order: undefined,

    /**
     * 节点对应的父节点
     * @memberof Ext.orgchart.Node#
     * @member {Ext.orgchart.Node|undefined}
     */
    parent: undefined,

    /**
     * 节点的所有子节点
     * @memberof Ext.orgchart.Node#
     * @member {Array|undefined}
     */
    children: undefined,

    /**
     * 节点绘制后所在的容器实例
     * @memberof Ext.orgchart.Node#
     * @member {Ext.orgchart.OrgChart|undefined}
     */
    container: undefined,

    /*
     * 关于 ExtJS getBBox() 存在的问题:
     *    y = 246.5;
     *    sprite.setAttributes({
     *      y: y
     *    }, true);
     *    console.log(y);                          // 246.5
     *    console.log(sprite.el.dom.getBBox().y);  // 246.5
     *    console.log(sprite.getBBox().y);         // 247
     * 推测此问题是计算 matrix 变换时造成的
     */
    x: 0,

    y: 0,

    constructor: function (config) {

        Ext.apply(this, config);

        if (!this.container) {
            Ext.Error.raise('必须指定 container 属性');
        }

        this.initialConfig = config;
        this.id = config.id || Ext.id(undefined, 'orgchart-node-');
        this._initSpritesConfig();

        try {
            this._darkRectColor = Ext.draw.Color.fromString(this._rectConfig.fill).getDarker(.1).toString();
        } catch (e) {
            this._darkRectColor = this._rectConfig.fill;
        }

        if (this.container.surface) {
            this.createSprite(this.container.surface);
        }

        return this;
    },


    _initSpritesConfig: function () {
        var s = this.container.settings;
        this._rectConfig = Ext.apply({}, {
            id: this.id + '-rect',
            type: 'rect',
            fill: this.color || s.nodeBackgroundColor,
            width: s.nodeWidth,
            height: s.nodeHeight,
            radius: s.nodeBorderRadius,
            stroke: s.nodeBorderColor,
            'stroke-width': s.nodeBorderWidth
        });

        this._nameTextConfig = Ext.apply({}, {
            id: this.id + '-text-name',
            type: 'text',
            text: this.nameText,
            fill: s.nodeNameColor,
            'font-weight': s.nodeNameFontWeight,
            'font-size': s.nodeNameFontSize,
            'font-family': s.nodeNameFontFamily
        });

        this._valueTextConfig = Ext.apply({}, {
            id: this.id + '-text-value',
            type: 'text',
            text: this.valueText,
            fill: s.nodeValueColor,
            'font-weight': s.nodeValueFontWeight,
            'font-size': s.nodeValueFontSize,
            'font-family': s.nodeValueFontFamily
        });
    },


    /**
     * 创建所有的 sprite
     * @param surface - 渲染 sprite 所需的 surface
     * @returns {Ext.draw.CompositeSprite} 该节点所有 sprite 所在的 group
     */
    createSprite: function (surface) {
        this.surface = surface;

        this._rectSprite = Ext.create('Ext.draw.Sprite', this._rectConfig);
        this._nameTextSprite = Ext.create('Ext.draw.Sprite', this._nameTextConfig);
        this._valueTextSprite = Ext.create('Ext.draw.Sprite', this._valueTextConfig);

        this.sprite = Ext.create('Ext.draw.CompositeSprite', {
            surface: surface,
            id: this.id + '-nodegroup'
        });

        this._bindEvents();

        this.sprite.add('rect', this._rectSprite);
        this.sprite.add('nameText', this._nameTextSprite);
        this.sprite.add('valueText', this._valueTextSprite);

        surface.add(this._rectSprite);
        surface.add(this._nameTextSprite);
        surface.add(this._valueTextSprite);

        return this.sprite;
    },

    getSourceAnchor: function () {
        return {
            x: this.getSourceAnchorX(),
            y: this.getSourceAnchorY()
        };
    },

    getSourceAnchorX: function () {
        var s = this.container.settings;
        return this.x + s.expanderSize + s.expanderMargin + s.connectorMargin + s.nodeWidth;
    },

    getSourceAnchorY: function () {
        var s = this.container.settings;
        return this.y + s.nodeHeight * .5;
    },

    getTargetAnchor: function () {
        return {
            x: this.getTargetAnchorX(),
            y: this.getTargetAnchorY()
        };
    },

    getTargetAnchorX: function () {
        return this.x - this.container.settings.connectorMargin;
    },

    getTargetAnchorY: function () {
        var s = this.container.settings;
        return this.y + s.nodeHeight * .5;
    },

    /**
     * 先序遍历子树
     * @param {function} callback - 回调函数
     * @param scope
     */
    preorderTraversal: function (callback, scope) {
        (function self(node) {
            var i, len;

            callback.call(scope || node, node);
            if (node.children && node.expanded) {
                for (i = 0, len = node.children.length; i < len; ++i) {
                    self(node.children[i]);
                }
            }
        }(this));
    },


    /**
     * 后序遍历子树
     * @param callback
     * @param scope
     */
    postorderTraversal: function (callback, scope) {
        (function self(node) {
            var i, len;

            if (node.children && node.expanded) {
                for (i = 0, len = node.children.length; i < len; ++i) {
                    self(node.children[i]);
                }
            }
            callback.call(scope || node, node);
        }(this));
    },


    _bindEvents: function () {
        var me = this;

        this._rectSprite.on('mouseover', this.onNodeMouseOver, this);
        this._rectSprite.on('mouseout', this.onNodeMouseOut, this);

        // debug
        this._rectSprite.on('click', function () {
            console.log(this)
        }, this);

        // Ext.draw.CompositeSprite 未提供 mouseleave 事件
        this._nameTextSprite.on('mouseover', function () {
            me._rectSprite.stopAnimation();
        });
        this._valueTextSprite.on('mouseover', function () {
            me._rectSprite.stopAnimation();
        });
    },

    /**
     * 判断当前节点是否为叶子节点，
     * 注意：仅针对已绘制的节点
     * @returns {boolean}
     */
    isLeaf: function () {
        return !!((!this.expanded && this.children) // 有子节点但没展开
        || !this.children); // 没有子节点
    },


    /**
     * 所有节点在 container 中管理，不单独销毁只隐藏
     */
    destroyIt: function () {
        this.sprite.hide(true);
    },


    /**
     * 绘制节点
     * @param animite
     */
    drawIt: function (animite) {
        var P = this.container.settings.insetPadding;
        var NH = this.container.settings.nodeHeight;
        var NW = this.container.settings.nodeWidth;
        var cls = Ext.orgchart.OrgChart.NODE_CLASS_PREFIX + this.container.id;

        var vt;
        var nameX = P + this.x;
        var nameY = NH * .5 + this.y;
        var valueX, valueY;

        try {
            vt = this._valueTextSprite.getBBox();
        } catch (e) {
            this._valueTextSprite.hide(true);
            vt = this._valueTextSprite.getBBox();
        }

        valueX = this.x + (NW - vt.width - P);
        valueY = NH * .5 + this.y;

        if (animite === 'move') {
            this._drawItWithAnimiteMove(this.x, this.y, nameX, nameY, valueX, valueY);
        } else {
            this._drawItWithoutAnimite(this.x, this.y, nameX, nameY, valueX, valueY);
        }

        this._nameTextSprite.addCls(cls);
        this._valueTextSprite.addCls(cls);
        this._rectSprite.addCls(cls);
    },

    _drawItWithoutAnimite: function (x, y, nameX, nameY, valueX, valueY) {
        this._rectSprite.setAttributes({
            x: x,
            y: y,
            hidden: false
        }, true);
        this._nameTextSprite.setAttributes({
            x: nameX,
            y: nameY,
            hidden: false
        }, true);
        this._valueTextSprite.setAttributes({
            x: valueX,
            y: valueY,
            hidden: false
        }, true);
    },

    _drawItWithAnimiteMove: function (x, y, nameX, nameY, valueX, valueY) {
        var duration = 200;
        this._rectSprite.animate({
            duration: duration,
            to: {
                x: x,
                y: y
            }
        });
        this._nameTextSprite.animate({
            duration: duration,
            to: {
                x: nameX,
                y: nameY
            }
        });
        this._valueTextSprite.animate({
            duration: duration,
            to: {
                x: valueX,
                y: valueY
            }
        });
    },

    /**
     * 遍历左兄弟
     * @param fn
     */
    iterateLeftSiblings: function (fn) {
        var i, len;
        if (!this.parent) {
            return;
        }
        for (i = this.order + 1, len = this.parent.children.length; i < len; ++i) {
            fn(this.parent.children[i]);
        }
    },

    /**
     * 遍历右兄弟
     * @param fn
     */
    iterateRightSiblings: function (fn) {
        var i, len;
        if (!this.parent) {
            return;
        }
        for (i = 0, len = this.order; i < len; ++i) {
            fn(this.parent.children[i]);
        }
    },


    findFirstLeaf: function () {
        var firstChild;
        if (this.children && this.children.length) {
            firstChild = this.children[0];
            if (firstChild.isLeaf()) {
                return firstChild;
            }
            return firstChild.findFirstLeaf();
        }
    },


    /**
     * 折叠节点
     */
    collapseIt: function () {
        var me = this;
        var NH = me.container.settings.nodeHeight;
        var giveWay = me.calculateGiveWay();

        if (giveWay) { // 需要移开一定空间时
            this.giveWay((giveWay - NH ) * .5, true);
        }

        me.preorderTraversal(function (node) {
            if (node.id !== me.id) {
                node.expander && node.expander.destroyIt();
                node.destroyIt();
                node.connector && node.connector.destroyIt();
            }
        });

        me.expanded = false;

        this.updateExpandedLeaves();
    },

    /**
     * 展开节点
     */
    expandIt: function () {
        var me = this;
        var settings = me.container.settings;
        var NH = settings.nodeHeight;
        var NW = settings.nodeWidth;
        var VS = settings.verticalSpace;
        var HS = settings.horizontalSpace;
        var giveWay;

        this._expandedLeaves = me._expandedLeaves || me.children.length;
        this.expanded = true;

        giveWay = this.calculateGiveWay();

        if (giveWay) { // 需要移开一定空间时
            this.giveWay((giveWay - NH) * .5);
        }

        this.updateExpandedLeaves();

        // 计算位置
        var leave = 0;

        me.postorderTraversal(function (node) {
            if (me.id !== node.id) {
                node.x = node.depth * (NW + VS);
                if (node.isLeaf()) {
                    node.y = me.y - giveWay * .5 + NH * .5 + leave * (NH + HS);
                    leave++;
                } else {
                    node.y = node.findFirstLeaf().y + node.calculateGiveWay() * .5 - NH * .5
                }
            }
        });

        // 绘制
        this.preorderTraversal(function (node) {
            if (me.id !== node.id) {
                node.drawExpander();
                node.drawIt();
                node.drawConnector();
            }
        });
    },


    /**
     * 计算展开或折叠时需要腾出的空间
     * @returns {number}
     */
    calculateGiveWay: function () {
        var s = this.container.settings;
        var HS = s.horizontalSpace;
        var NH = s.nodeHeight;
        var L = this._expandedLeaves;
        var giveWay = 0;

        if (L > 1) {
            giveWay = (L * NH + (L - 1) * HS);
        }
        return giveWay;
    },


    /**
     * 更新 _expandedLeaves 相关状态
     * @private
     */
    updateExpandedLeaves: function () {
        var p = this.parent;
        if (p) {
            p.markExpandedLeaves();
            p.updateExpandedLeaves();
        }
    },


    /**
     * 移动由各兄弟节点构成的子树，腾出空间用来展开节点
     * @param {number} translateY
     * @param {boolean} [opposite=false]
     */
    giveWay: function (translateY, opposite) {
        var fixed = opposite ? -1 : 1;
        if (!this.isRoot()) {
            this._moveDistance('iterateLeftSiblings', translateY * fixed);
            this._moveDistance('iterateRightSiblings', -translateY * fixed);
        }
    },


    _moveDistance: function (method, translateY) {
        this[method](function (sibling) {
            sibling.preorderTraversal(function (node) {
                node.y += translateY;
                node.drawIt('move');
                node.expander && node.expander.drawIt('move');
                node.connector && node.connector.drawIt(true);
            });
        });

        if (this.parent && !this.parent.isRoot()) {
            this.parent._moveDistance(method, translateY);
        }
    },


    /**
     * 判断当前节点是否为根节点
     * @returns {boolean}
     */
    isRoot: function () {
        return this.container.findRootNode().id === this.id;
    },


    /**
     * 绘制当前节点的 Expander
     */
    drawExpander: function () {
        var expander;
        if (this.children && !this.expander) {
            expander = Ext.create('Ext.orgchart.Expander', {
                node: this
            });
            expander.drawIt();
        }
    },


    /**
     * 以当前节点作为 target 来绘制 Connector
     */
    drawConnector: function () {
        var connector;
        if (this.parent && !this.connector) {
            connector = Ext.create('Ext.orgchart.Connector', {
                node: this
            });
            connector.drawIt();
        }
    },


    /**
     * 遍历子树，标记当前节点待展开的子孙节点。
     * 标记后的 _expandedLeaves 值形如：
     *
     *                                         +---------+
     *                                    +----+    0    |
     *                     +---------+    |    +---------+
     *                +----+    2    +----+
     *                |    +---------+    |    +---------+
     *                |                   +----+    0    |
     * +---------+    |                        +---------+
     * |    4    +----+
     * +---------+    |    +---------+
     *                +----+    0    |
     *                |    +---------+
     *                |
     *                |    +---------+         +---------+
     *                +----+    1    +---------+    0    |
     *                     +---------+         +---------+
     *
     */
    markExpandedLeaves: function () {
        var node = this;
        node._expandedLeaves = 0;
        node.preorderTraversal(function (n) {
            if (node.id !== n.id && n.isLeaf()) {
                node._expandedLeaves++;
            }
        });
    },


    onNodeMouseOver: function () {
        this._rectSprite.animate({
            to: {
                'fill': this._darkRectColor
            }
        });
    },

    onNodeMouseOut: function () {
        this._rectSprite.animate({
            to: {
                'fill': this._rectConfig.fill
            }
        });
    }

});
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
/**
 * 组织机构树
 *
 * @class Ext.orgchart.OrgChart
 * @extends Ext.draw.Component
 * @author zhangqiang
 * @date 2017.03.10
 */
Ext.define('Ext.orgchart.OrgChart', {

    extend: 'Ext.draw.Component',

    requires: [
        'Ext.orgchart.Settings',
        'Ext.orgchart.Node',
        'Ext.orgchart.Connector'
    ],

    // @private
    viewBox: false,

    /**
     * 当前 OrgChart 实例使用的设置
     *
     * @memberof Ext.orgchart.OrgChart#
     * @member {Ext.orgchart.Settings}
     * @default Ext.orgchart.Settings.defaults
     */
    settings: Ext.orgchart.Settings.defaults,

    /**
     * 当前 viewBox 的 x 坐标
     *
     * @memberof Ext.orgchart.OrgChart#
     * @member {number}
     */
    x: 0,

    /**
     * 当前 viewBox 的 y 坐标
     *
     * @memberof Ext.orgchart.OrgChart#
     * @member {number}
     */
    y: 0,

    statics: {

        /**
         * 节点样式名前缀
         * @memberof Ext.orgchart.OrgChart
         * @member {string}
         * @default
         */
        NODE_CLASS_PREFIX: 'orgchart-node-'
    },


    // onRender 之后才能获得 surface
    // @private
    onRender: function () {
        this.callParent(arguments);

        this.viewBox = false;

        this._assertDefine('root');
        this._assertDefine('height');
        this._assertDefine('width');

        this.surface.setViewBox(0, 0, this.width, this.height);

        this._initStyleSheet();
        this._initDraggable();

        /**
         * 节点管理器，保留所有节点实例的引用
         * @memberof Ext.orgchart.OrgChart#
         * @member {Ext.util.HashMap}
         */
        this.nodeManager = this.createNodeManager();
        this._initExpandedLeaves();
        this.drawIt();
    },


    /**
     * 开始绘制
     * @memberof Ext.orgchart.OrgChart#
     * @function
     */
    drawIt: function () {
        var root = this.drawRoot();
        root.expandIt();
        this.moveToCenter();
    },


    /**
     * 绘制根节点
     * @memberof Ext.orgchart.OrgChart#
     * @function
     * @returns {Ext.orgchart.Node}
     */
    drawRoot: function () {
        var root = this.findRootNode();
        root.x = root.y = 0;
        root.drawIt();
        root.drawExpander();
        return root;
    },


    /**
     * 创建节点管理器，初始化所有节点并为其创建层级关联、增加附加属性。
     * @returns {Ext.util.HashMap}
     * @private
     */
    createNodeManager: function () {
        var me = this;
        var hashMap = Ext.create('Ext.util.HashMap');

        (function self(n, parent, depth, order) {
            var i, len;

            var node = Ext.create('Ext.orgchart.Node', {
                id: n.id,
                nameText: n.nameText || '',
                valueText: n.valueText || '',
                color: n.color,
                expanded: !!n.expanded,
                depth: depth,
                order: order,
                parent: parent,
                container: me
            });

            if (depth === 0 && order === 0) {
                hashMap.root = node; // 保留引用，以便快速找到根节点
            }
            if (parent) { // 关联到子节点
                if (!Ext.isArray(parent.children)) {
                    parent.children = [];
                }
                parent.children.push(node);
            }

            hashMap.add(node);
            depth++;

            if (n.children && Ext.isArray(n.children)) {
                for (i = 0, len = n.children.length; i < len; ++i) {
                    self(n.children[i], node, depth, i);
                }
            }
        }(me.root, undefined, 0, 0));

        return hashMap;
    },


    /**
     * 获取根节点
     * @memberof Ext.orgchart.OrgChart#
     * @function
     * @returns {Ext.orgchart.Node}
     */
    findRootNode: function () {
        return this.nodeManager.root;
    },


    /**
     * 平移至垂直居中
     * @memberof Ext.orgchart.OrgChart#
     * @function
     */
    moveToCenter: function () {
        var s = this.settings;
        this.x = -s.insetPadding;
        this.y = s.nodeHeight - this.height * .5;
        this.surface.setViewBox(this.x, this.y, this.width, this.height);
    },


    /*
     * @private
     */
    _initExpandedLeaves: function () {
        this.findRootNode().preorderTraversal(function (node) {
            node.markExpandedLeaves();
        });
    },


    _initStyleSheet: function () {
        var className = Ext.orgchart.OrgChart.NODE_CLASS_PREFIX + this.id;
        var clazz = [
            '.', className, ', .', className, ' tspan{',
            'cursor:move;',
            '}'
        ].join('');
        Ext.util.CSS.createStyleSheet(clazz);
    },


    /**
     * 初始化鼠标拖拽效果
     * TODO VML 兼容性测试
     * @private
     */
    _initDraggable: function () {
        var me = this;
        var s = this.surface;
        var className = Ext.orgchart.OrgChart.NODE_CLASS_PREFIX + this.id;

        this.x = s.viewBox.x;
        this.y = s.viewBox.y;

        s.on('mousedown', function (e) {
            var t = e.getTarget(null, 2);
            var isNodeRect = false;
            var downX = e.getX();
            var downY = e.getY();

            var moveFunction = function (moveEvent) {
                s.setViewBox(
                    downX - moveEvent.getX() + me.x,
                    downY - moveEvent.getY() + me.y,
                    me.width,
                    me.height
                );
            };

            if (Ext.supports.ClassList) {
                isNodeRect = t.classList.contains(className);
            } else {
                isNodeRect = t.id && ~t.id.indexOf('-rect');
            }

            if (t.tagName === 'tspan' || (isNodeRect && t.tagName === 'rect')) {
                s.on('mousemove', moveFunction, me);
                s.on('mouseup', function () {
                    s.un('mousemove', moveFunction, me);
                    me.x = me.surface.viewBox.x;
                    me.y = me.surface.viewBox.y;
                }, me, {single: true});
            }
        });
    },


    _assertDefine: function (prop) {
        if (typeof this[prop] === 'undefined') {
            Ext.Error.raise('必须为 Ext.orgchart.OrgChart 实例指定 ' + prop + ' 属性');
        }
    }

});