<?php
/**
 * Created by PhpStorm.
 * User: xiangdong
 * Date: 16/3/2
 * Time: 上午11:38
 */
//每2秒执行一次
swoole_timer_tick(2000, function ($timer_id) {
    echo "tick-2000ms\n";
});
//3秒后执行一次
swoole_timer_after(3000, function () {
    echo "after 3000ms.\n";
});