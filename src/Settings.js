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
    nodeHeight: 40,

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
    expanderType: 'square', // circle | square

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