//主控制器
var app = angular.module("myApp", ['ngRoute','textAngular']);
app.config(function ($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: './build/template/login.html',
        controller: 'LoginController'
    });
    $routeProvider.when('/home', {
        templateUrl: './build/template/admin/home.html',
        controller: 'HomeController'
    });
    $routeProvider.when('/articleList', {
        templateUrl: './build/template/admin/articleList.html',
        controller: 'ArticleController'
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
    $scope.articleList="";
    if(!AuthenticationService.isLoggedIn()){
        $location.path("/login");
    }
    $scope.chapter = {chapter_name:"",status:1,pid:0,rank:0};
    $scope.addChapter = function (chapter){
        $http.post(config.home_url + "/api/addChapter", chapter).success(function(data){
            console.log(data);
            if(data.code==1){
                $location.path("/index");
            }else{
                $scope.message=data.message;
                $scope.showMessage=true;
            }
        });
    };
    $scope.article ={chapter_id:"",title:"",content:""};
    $scope.addArticle = function (chapter){
        $http.post(config.home_url + "/api/addArticle", chapter).success(function(data){
            console.log(data);
            if(data.code==1){
                $location.path("/index");
            }else{
                $scope.message=data.message;
                $scope.showMessage=true;
            }
        });
    };

    $scope.logout = function () {
        AuthenticationService.logout().success(function (data) {
            console.log(data);
            $location.path("/login");
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
    $scope.changePage = function (template){
        if(template=='articleList'){
            $http.post(config.home_url + "/api/getArticle").success(function(data){
                if(data.code==1){
                    console.log(data.data);
                    $scope.articleList=data.data;
                }else{
                    $scope.articleList=data.message;
                    $scope.showMessage=true;
                }
            });
        }
        $scope.tmplateUrl="./build/template/admin/"+template+".html?"+Date.parse(new Date());
    };
    $scope.editArticle = function (id){
        $http.post(config.home_url + "/api/getArticleById",{id:id}).success(function(data){
            $scope.article.title=data.data.title;
            $scope.article.chapter_id=data.data.chapter_id;
            $scope.article.content=data.data.content;
            $scope.article.id=data.data.id;
        });
        $scope.tmplateUrl="./build/template/admin/editArticle.html?"+Date.parse(new Date());
    };
    $scope.saveArticle = function(article){
        $http.post(config.home_url + "/api/saveArticle",article).success(function(data){
            if(data.code==1){
                $scope.changePage('articleList');
            }else{
                $scope.articleList=data.message;
                $scope.showMessage=true;
            }
        });
    };
});

