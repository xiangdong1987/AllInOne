//主控制器
var app = angular.module("myApp", ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when('/index', {
        templateUrl: './build/template/shop/index.html',
        controller: 'indexController'
    });
    $routeProvider.when('/home', {
        templateUrl: './build/template/admin/home.html',
        controller: 'HomeController'
    });
    $routeProvider.otherwise({redirectTo: '/index'});
});

app.controller("indexController", function ($scope, $location, $http, $sce) {
    var url = "/api/getGood";
    $scope.goodsList = '';
    $http.post(url, {cate_id: '', is_recommend: 1, is_font: 1}).success(function (data) {
        $scope.goodsList = data.data;
    }).error(function (data) {
        console.log(data)
    });
    $scope.bread = "首页";
    $scope.chapter = "介绍";
    $scope.sidebar = '';
    $scope.statsTab = '';
    $scope.tmplateUrl = "./build/template/shop/page.html?" + Date.parse(new Date());
    //获取分类
    $scope.menu='';
    //获取分类
    $http.post(config.home_url + "api/getCategory").success(function(data){
        if(data.code==1){
            $scope.menu=data.data;
        }else{
            $scope.showMessage=true;
        }
    });
    $scope.sidebarToggle = function () {
        if (window.innerWidth > config.screenSizes.sm - 1) {
            if ($scope.sidebar) {
                $scope.sidebar = '';
            } else {
                $scope.sidebar = 'sidebar-collapse';
            }
        } else {
            if ($scope.sidebar) {
                $scope.sidebar = '';
            } else {
                $scope.sidebar = 'sidebar-open';
            }
        }
    };
    $scope.transformPage = function (id) {
        var url = "/api/getGood";
        $http.post(url, {cate_id: id, is_recommend: 0, is_font: 1}).success(function (data) {
            $scope.goodsList = data.data;
        }).error(function (data) {
            console.log(data)
        });
        $scope.sidebar = '';
        $scope.tmplateUrl = "./build/template/shop/page.html?" + Date.parse(new Date());
    };
}).filter(
    'to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    }]
);
