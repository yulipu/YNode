/**
 * @author yu
 * @license http://www.apache.org/licenses/LICENSE-2.0
 */
'use strict';

const Behavior = require('./Behavior');
const Controller = require('./Controller');

/**
 * 动作过滤器
 *
 * 过滤器会在控制器的动作执行之前执行并且只支持同步操作
 */
class ActionFilter extends Behavior {

    constructor() {
        super();

        this.beforeFilter = (actionEvent) => {
            if(!actionEvent.valid) {
                this.unListen();
                return;
            }

            this.beforeAction(actionEvent);
        };

        /**
         * afterFilter() will not execute when false === actionEvent.valid
         */
        this.afterFilter = (actionEvent) => {
            this.unListen();

            this.afterAction(actionEvent);
        };
    }

    /**
     * @inheritdoc
     */
    events() {
        return [
            [Controller.EVENT_BEFORE_ACTION, this.beforeFilter],
            [Controller.EVENT_AFTER_ACTION, this.afterFilter]
        ];
    }

    /**
     * 前置过滤
     */
    beforeAction(actionEvent) {}

    /**
     * 后置过滤
     */
    afterAction(actionEvent) {}

}

module.exports = ActionFilter;
