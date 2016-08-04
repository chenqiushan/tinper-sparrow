'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseComponent = undefined;

var _class = require('./class');

var _util = require('./util');

var _event = require('./event');

var _compMgr = require('./compMgr');

/**
 * Module : Sparrow base component
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-07-28 18:45:08
 */

var BaseComponent = _class.Class.create({
    initialize: function initialize(element) {
        if ((0, _util.isDomElement)(element)) {
            this.element = element;
            this.options = {};
        } else {
            this.element = element['el'];
            this.options = element;
        }
        this.element = typeof this.element === 'string' ? document.querySelector(this.element) : this.element;

        this.compType = this.compType || this.constructor.compType;
        this.element[this.compType] = this;
        this.element['init'] = true;
        this.init();
    },
    /**
     * 绑定事件
     * @param {String} name
     * @param {Function} callback
     */
    on: function on(name, callback) {
        name = name.toLowerCase();
        this._events || (this._events = {});
        var events = this._events[name] || (this._events[name] = []);
        events.push({
            callback: callback
        });
        return this;
    },
    /**
     * 触发事件
     * @param {String} name
     */
    trigger: function trigger(name) {
        name = name.toLowerCase();
        if (!this._events || !this._events[name]) return this;
        var args = Array.prototype.slice.call(arguments, 1);
        var events = this._events[name];
        for (var i = 0, count = events.length; i < count; i++) {
            events[i].callback.apply(this, args);
        }
        return this;
    },
    /**
     * 初始化
     */
    init: function init() {},
    /**
     * 渲染控件
     */
    render: function render() {},
    /**
     * 销毁控件
     */
    destroy: function destroy() {
        delete this.element['comp'];
        this.element.innerHTML = '';
    },
    /**
     * 增加dom事件
     * @param {String} name
     * @param {Function} callback
     */
    addDomEvent: function addDomEvent(name, callback) {
        (0, _event.on)(this.element, name, callback);
        return this;
    },
    /**
     * 移除dom事件
     * @param {String} name
     */
    removeDomEvent: function removeDomEvent(name, callback) {
        (0, _event.off)(this.element, name, callback);
        return this;
    },
    setEnable: function setEnable(enable) {
        return this;
    },
    /**
     * 判断是否为DOM事件
     */
    isDomEvent: function isDomEvent(eventName) {
        if (this.element['on' + eventName] === undefined) return false;else return true;
    },
    createDateAdapter: function createDateAdapter(options) {
        var opt = options['options'],
            model = options['model'];
        var Adapter = _compMgr.compMgr.getDataAdapter(this.compType, opt['dataType']);
        if (Adapter) {
            this.dataAdapter = new Adapter(this, options);
        }
    },
    Statics: {
        compName: '',
        EVENT_VALUE_CHANGE: 'valueChange',
        getName: function getName() {
            return this.compName;
        }
    }
});

function adjustDataType(options) {
    var types = ['integer', 'float', 'currency', 'percent', 'string', 'textarea'];
    var _type = options['type'],
        _dataType = options['dataType'];
    if (types.indexOf(_type) != -1) {
        options['dataType'] = _type;
        options['type'] = 'originText';
    }
}

var BaseComponent = BaseComponent;

exports.BaseComponent = BaseComponent;