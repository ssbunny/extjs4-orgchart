/**
 * Utils
 *
 * @author zhangqiang
 * @date 2017.03.10
 */
Ext.define('Ext.orgchart.Utils', {

    singleton: true,

    NODE_CLASS_NAME: 'orgchart-node',

    constructor: function () {
        var clazz = [
            '.', this.NODE_CLASS_NAME, ', .', this.NODE_CLASS_NAME, ' tspan{',
            'cursor:move;',
            '}'
        ].join('');
        Ext.util.CSS.createStyleSheet(clazz);
    },

    /**
     * 颜色加深
     *
     * @param {string} color - 待加深的颜色值 (hex 格式)
     * @param {number} level - 加深程度, level 值取 0 - 1 之间的数
     * @returns {string} 加深后的颜色 (hex 格式)
     */
    deepenIt: function (color, level) {
        var rgbc = this.hexToRgb(color);
        for (var i = 0; i < 3; i++) {
            rgbc[i] = Math.floor(rgbc[i] * (1 - level));
        }
        return this.rgbToHex(rgbc[0], rgbc[1], rgbc[2]);
    },

    /**
     * hex 格式转 rgb
     *
     * @param str
     * @returns {Array|{index: number, input: string}}
     */
    hexToRgb: function (str) {
        str = str.replace('#', '');
        var hxs = str.match(/../g);
        for (var i = 0; i < 3; i++) {
            hxs[i] = parseInt(hxs[i], 16);
        }
        return hxs;
    },

    /**
     * rgb 格式转 hex
     *
     * @param r
     * @param g
     * @param b
     * @returns {string}
     */
    rgbToHex: function (r, g, b) {
        var hexs = [r.toString(16), g.toString(16), b.toString(16)];
        for (var i = 0; i < 3; i++) {
            if (hexs[i].length == 1) {
                hexs[i] = '0' + hexs[i];
            }
        }
        return '#' + hexs.join('');
    }

});