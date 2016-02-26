//主控制器
var app = angular.module("myApp", ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: './build/template/login.html',
        controller: 'LoginController'
    });
    $routeProvider.when('/home', {
        templateUrl: './build/template/admin/home.html',
        controller: 'HomeController'
    });
    $routeProvider.otherwise({redirectTo: '/login'});
});

app.factory("SessionService", function () {
    return {
        get: function (key) {
            return sessionStorage.getItem(key);
        },
        set: function (key, val) {
            return sessionStorage.setItem(key, val);
        },
        unset: function (key) {
            return sessionStorage.removeItem(key);
        }
    }
});


app.factory("AuthenticationService", function ($http, $location, SessionService) {
    var cacheSession = function () {
        SessionService.set('authenicated', true);
    };
    var uncacheSession = function () {
        SessionService.unset('authenicated');
    };
    var loginError = function (response) {
        console.log(response.Message);
    };
    return {
        login: function (credentials) {
            var login = $http.post(config.home_url + "/api/Login", credentials);
            login.success(cacheSession);
            login.error(loginError);
            return login;
        },
        logout: function () {
            var logout = $http.get("/api/Login");
            logout.success(uncacheSession);
            return logout;
        },
        isLoggedIn: function () {
            return SessionService.get('authenicated');
        }
    };
});

app.controller("LoginController", function ($scope, $location, $http, AuthenticationService) {
    $scope.credentials = {UserName: "", Password: "", RememberMe: false};
    $scope.bodyClass = 'hold-transition login-page';
    if(!AuthenticationService.isLoggedIn()){
        $location.path("/login");
    }else{
        $location.path("/home");
    }
    $scope.login = function () {
        AuthenticationService.login($scope.credentials).success(function (data) {
            console.log(data);
            if(data.code==1){
                $location.path("/home");
            }else{
                $scope.message=data.message;
                $scope.showMessage=true;
            }
        });
    };

});
app.controller("HomeController", function ($scope, $location, $http, AuthenticationService) {
    $scope.credentials = {UserName: "", Password: "", RememberMe: false};
    $scope.sidebar='';
    $scope.userMenu='';
    $scope.notify='';
    $scope.homeTab='';
    $scope.settingTab='active';
    $scope.statsTab='';
    $scope.tmplateUrl="./build/template/admin/index.html?"+Date.parse(new Date());
    $scope.headerUrl="./build/template/common/header.html?"+Date.parse(new Date());
    $scope.sidebarUrl="./build/template/common/sidebar.html?"+Date.parse(new Date());
    $scope.controlSidebarUrl="./build/template/common/control_sidebar.html?"+Date.parse(new Date());
    if(!AuthenticationService.isLoggedIn()){
        $location.path("/login");
    }
    $scope.homePage = function () {
        console.log('hellow world');
    };
    $scope.logout = function () {
        AuthenticationService.logout().success(function (data) {
            console.log(data);
            $location.path("/login");
        });
    };
    $scope.getvalue = function () {
        var url = "/api/values";
        $http.get(url).success(function (data) {
                console.log(data);
            })
            .error(function (data) {
                console.log(data);
            });
    };
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

