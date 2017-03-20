/**
 * 节点
 *
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
     */
    nameText: '',

    /**
     * 节点值
     */
    valueText: 0,

    /**
     * 节点填充色，使用 HEX 格式，
     * 默认为 Ext.orgchart.Theme 的 nodeBackgroundColor 值
     */
    color: undefined,

    /**
     * 节点展开状态
     */
    expanded: false,

    /**
     * 节点深度，根节点为 0
     */
    depth: undefined,

    /**
     * 节点在其所有兄弟节点中的排序，从 0 开始
     */
    order: undefined,

    /**
     * 节点对应的父节点
     */
    parent: undefined,

    /**
     * 节点的所有子节点
     */
    children: undefined,

    /**
     * 节点绘制后所在的容器（Ext.orgchart.OrgChart）实例
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