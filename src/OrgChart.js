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