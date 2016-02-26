//主控制器
var app = angular.module("myApp", ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider.when('/index', {
        templateUrl: './build/template/font/index.html',
        controller: 'indexController'
    });
    $routeProvider.when('/home', {
        templateUrl: './build/template/admin/home.html',
        controller: 'HomeController'
    });
    $routeProvider.otherwise({redirectTo: '/index'});
});

app.controller("indexController", function ($scope, $location, $http) {
    $scope.credentials = {UserName: "", Password: "", RememberMe: false};
    $scope.sidebar='';
    $scope.userMenu='';
    $scope.notify='';
    $scope.homeTab='';
    $scope.settingTab='active';
    $scope.statsTab='';
    $scope.tmplateUrl="./build/template/admin/index.html?"+Date.parse(new Date());
    $scope.headerUrl="./build/template/common/header.html?"+Date.parse(new Date());
    $scope.controlSidebarUrl="./build/template/common/control_sidebar.html?"+Date.parse(new Date());

    $scope.expiry = function () {
        var url = "/api/values";
        $http.post(url).success(function (data) {
                console.log(data);
            })
            .error(function (data) {
                console.log(data);
            });
    };
    $scope.sidebarToggle = function () {
        if(window.innerWidth>config.screenSizes.sm-1){
            if($scope.sidebar){
                $scope.sidebar='';
            }else{
                $scope.sidebar='sidebar-collapse';
            }
        }else{
            if($scope.sidebar){
                $scope.sidebar='';
            }else{
                $scope.sidebar='sidebar-open';
            }
        }
    };
    $scope.controlSidebarToggle = function () {
        if($scope.controlSidebar){
            $scope.controlSidebar='';
        }else{
            $scope.controlSidebar='control-sidebar-open';
        }
    };
    $scope.userMenuToggle = function (){
        if($scope.userMenu){
            $scope.userMenu='';
            $scope.ariaExpanded='false';
        }else{
            $scope.userMenu='open';
            $scope.ariaExpanded='true';
        }
    };
    $scope.homeTabToggle = function(){
        $scope.homeTab='active';
        $scope.settingTab='';
        $scope.statsTab='';
    };
    $scope.settingTabToggle = function(){
        $scope.homeTab='';
        $scope.settingTab='active';
        $scope.statsTab='';
    };
    $scope.statsTabToggle = function(){
        $scope.homeTab='';
        $scope.settingTab='';
        $scope.statsTab='active';
    };

});

