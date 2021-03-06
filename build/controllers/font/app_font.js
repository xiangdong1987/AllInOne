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

app.controller("indexController", function ($scope, $location, $http,$sce) {
    var url = "/api/getHomePage";
    var info=""
    $http.post(url).success(function (data) {
        info=data.data;
        $scope.title = info.title;
        $scope.content = $sce.trustAsHtml(info.content);
        console.log(info);
    }).error(function (data) {
        console.log(data);
    });
    //获取菜单
    $http.post(config.home_url + "api/getMenu").success(function(data){
        if(data.code==1){
            console.log(data.data);
            $scope.menu=data.data;
        }else{
            $scope.articleList=data.message;
            $scope.showMessage=true;
        }
    });

    $scope.bread = "首页";
    $scope.chapter = "介绍";
    $scope.sidebar = '';
    $scope.statsTab = '';
    $scope.tmplateUrl = "./build/template/font/page.html?" + Date.parse(new Date());

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
    $scope.transformPage = function (id){
        $http.post(config.home_url + "/api/getArticleById",{id:id}).success(function(data){
            if(data.code==1){
                $scope.title = data.data.title;
                $scope.content = $sce.trustAsHtml(data.data.content);
            }else{
                $scope.articleList=data.message;
                $scope.showMessage=true;
            }
        });
        $scope.tmplateUrl="./build/template/font/page.html?"+Date.parse(new Date());
    };
});

