/*
 * angular directive ng-icheck
 *
 * @description icheck is a plugin of jquery for beautifying checkbox & radio, now I complied it with angular directive
 * @require jquery, icheck
 * @example <input type="radio" ng-model="paomian" value="kangshifu" ng-icheck>
 *          <input type="checkbox" class="icheckbox" name="mantou" ng-model="mantou" ng-icheck checked>
 */
app.directive('ngIcheck', function ($compile) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function ($scope, $element, $attrs, $ngModel) {
            if (!$ngModel) {
                return;
            }
            //using iCheck
            $($element).iCheck({
                labelHover: false,
                cursor: true,
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue',
                increaseArea: '20%'
            }).on('ifClicked', function (event) {
                if ($attrs.type == "checkbox") {
                    //checkbox, $ViewValue = true/false/undefined
                    $scope.$apply(function () {
                        $ngModel.$setViewValue(!($ngModel.$modelValue == undefined ? false : $ngModel.$modelValue));
                    });
                } else {
                    // radio, $ViewValue = $attrs.value
                    $scope.$apply(function () {
                        $ngModel.$setViewValue($attrs.value);
                    });
                }
            });
        },
    };
});
app.directive('myAlert', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        template: "<div class='alert alert-danger alert-dismissible' ng-show='showMessage'><button type='button' class='close' data-dismiss='alert' aria-hidden='true' ng-click='closeMessage()'>×</button><h4><i class='icon fa fa-ban'></i>Error</h4>{{message}}</div>",
        link: function (scope) {
            scope.showMessage = false;
            scope.closeMessage = function () {
                scope.showMessage = false;
            };
        }
    };
});