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
    $scope.userMenuToggle = function (){
        if($scope.userMenu){
            $scope.userMenu='';
            $scope.ariaExpanded='false';
        }else{
            $scope.userMenu='open';
            $scope.ariaExpanded='true';
        }
    };
});

