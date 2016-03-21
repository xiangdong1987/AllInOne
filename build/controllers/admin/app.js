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
app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function (data) {
                console.log(data);
            })
            .error(function () {

            });
    }
}]);
app.controller("LoginController", function ($scope, $location, $http,fileUpload, AuthenticationService) {
    $scope.credentials = {UserName: "", Password: "", RememberMe: false};
    $scope.bodyClass = 'hold-transition login-page';
    if(!AuthenticationService.isLoggedIn()){
        $location.path("/login");
    }else{
        $location.path("/home");
    }
    $scope.login = function () {
        AuthenticationService.login($scope.credentials).success(function (data) {
            if(data.code==1){
                $location.path("/home");
            }else{
                $scope.message=data.message;
                $scope.showMessage=true;
            }
        });
    };

});
app.controller("HomeController", function ($scope, $location, fileUpload,$http, AuthenticationService) {
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
    $scope.goodsList="";
    if(!AuthenticationService.isLoggedIn()){
        $location.path("/login");
    }
    $scope.chapter = {chapter_name:"",status:1,pid:0,rank:0};
    $scope.addChapter = function (chapter){
        $http.post(config.home_url + "/api/addChapter", chapter).success(function(data){
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
            if(data.code==1){
                $location.path("/index");
            }else{
                $scope.message=data.message;
                $scope.showMessage=true;
            }
        });
    };
    $scope.uploadFile = function(files){
        var fd = new FormData();
        var uploadUrl = "uploadFile";
        fd.append('file', files[0]);
        $http.post(config.home_url+uploadUrl, fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).success(function(data){
            console.log(data);
        }).error();
    };
    $scope.logout = function () {
        AuthenticationService.logout().success(function (data) {
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
    $scope.articleListPage = function (page){
        $http.post(config.home_url + "/api/getArticle",{page:page}).success(function(data){
            if(data.code==1){
                $scope.articleList=data.data.data;
                $scope.pageList=data.data.page;
            }else{
                $scope.articleList=data.message;
                $scope.showMessage=true;
            }
        });
        $scope.tmplateUrl="./build/template/admin/articleList.html?"+Date.parse(new Date());
    };
    $scope.addArticlePage = function () {
        $scope.tmplateUrl="./build/template/admin/addArticle.html?"+Date.parse(new Date());
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
                $scope.articleListPage(1);
            }else{
                $scope.articleList=data.message;
                $scope.showMessage=true;
            }
        });
    };
    $scope.chapterList = function (){
        $http.post(config.home_url + "/api/getChapter").success(function(data){
            if(data.code==1){
                $scope.articleList=data.data;
            }else{
                $scope.articleList=data.message;
                $scope.showMessage=true;
            }
        });
        $scope.tmplateUrl="./build/template/admin/chapterList.html?"+Date.parse(new Date());
    };
    $scope.addChapterPage = function () {
        $scope.tmplateUrl="./build/template/admin/addChapter.html?"+Date.parse(new Date());
    };
    $scope.editChapter = function (id){
        $http.post(config.home_url + "/api/getChapterById",{id:id}).success(function(data){
            $scope.chapter.chapter_name=data.data.chapter_name;
            $scope.chapter.id=data.data.id;
            $scope.chapter.content=data.data.content;
            $scope.chapter.rank=data.data.rank;
        });
        $scope.tmplateUrl="./build/template/admin/editChapter.html?"+Date.parse(new Date());
    };
    $scope.saveChapter = function(chapter){
        $http.post(config.home_url + "/api/saveChapter",chapter).success(function(data){
            if(data.code==1){
                $scope.chapterList();
            }else{
                $scope.articleList=data.message;
                $scope.showMessage=true;
            }
        });
    };

    //商品管理
    $scope.addGoodPage = function () {
        //获取分类
        $http.post(config.home_url + "/api/getCategory").success(function(data){
            if(data.code==1){
                $scope.categorysList=data.data;
            }else{
                $scope.error=data.message;
                $scope.showMessage=true;
            }
        });
        $scope.tmplateUrl="./build/template/admin/addGood.html?"+Date.parse(new Date());
    };
    $scope.goodList = function (cid){
        if(!cid){
            cid=0;
        }
        //获取分类
        $http.post(config.home_url + "/api/getCategory").success(function(data){
            if(data.code==1){
                $scope.categorysList=data.data;
            }else{
                $scope.error=data.message;
                $scope.showMessage=true;
            }
        });
        $http.post(config.home_url + "/api/getGood",{cate_id:cid}).success(function(data){
            if(data.code==1){
                $scope.goodsList=data.data;
            }else{
                $scope.goodsList=data.message;
                $scope.showMessage=true;
            }
        });
        $scope.tmplateUrl="./build/template/admin/goodList.html?"+Date.parse(new Date());
    };
    $scope.loadGood=function (){
        var cid=$scope.category.cate_id;
        $scope.goodList(cid);
    }
    $scope.addGood = function(good){
        $http.post(config.home_url + "/api/addGood",good).success(function(data){
            if(data.code==1){
                $scope.goodList();
            }else{
                $scope.articleList=data.message;
                $scope.showMessage=true;
            }
        });
    };
    $scope.good ={good_id:"",name:"",sale_price:"",price:'',cate_id:'',img:'',video:'',is_recommend:'',des:''};
    $scope.editGood = function (id){
        //获取分类
        $http.post(config.home_url + "/api/getCategory").success(function(data){
            if(data.code==1){
                $scope.categorysList=data.data;
            }else{
                $scope.error=data.message;
                $scope.showMessage=true;
            }
        });
        $http.post(config.home_url + "/api/getGoodById",{good_id:id}).success(function(data){
            console.log(data);
            $scope.good.good_id=data.data.good_id;
            $scope.good.name=data.data.name;
            $scope.good.sale_price=data.data.sale_price;
            $scope.good.price=data.data.price;
            $scope.good.cate_id=data.data.cate_id;
            $scope.good.img=data.data.img;
            $scope.good.video=data.data.video;
            $scope.good.is_recommend=data.data.is_recommend;
            $scope.good.des=data.data.des;
        });
        $scope.tmplateUrl="./build/template/admin/editGood.html?"+Date.parse(new Date());
    };
    $scope.saveGood = function(good){
        $http.post(config.home_url + "/api/saveGood",good).success(function(data){
            if(data.code==1){
                $scope.goodList();
            }else{
                $scope.articleList=data.message;
                $scope.showMessage=true;
            }
        });
    };
    //商品分类管理
    $scope.addCategoryPage = function () {
        $scope.tmplateUrl="./build/template/admin/addCategory.html?"+Date.parse(new Date());
    };
    $scope.categorysList='';
    $scope.addCategory = function(category){
        $http.post(config.home_url + "/api/addCategory",category).success(function(data){
            if(data.code==1){
                $scope.categorysList=data.data;
            }else{
                $scope.categorysList=data.message;
                $scope.showMessage=true;
            }
        });
    };
    $scope.categoryList = function (){
        $http.post(config.home_url + "/api/getCategory").success(function(data){
            if(data.code==1){
                $scope.categorysList=data.data;
            }else{
                $scope.categorysList=data.message;
                $scope.showMessage=true;
            }
        });
        $scope.tmplateUrl="./build/template/admin/categoryList.html?"+Date.parse(new Date());
    };
    $scope.category={cate_id:'',cate_name:'',rank:''};
    $scope.editCategory = function (id){
        $http.post(config.home_url + "/api/getCategoryById",{cate_id:id}).success(function(data){
            console.log(data);
            $scope.category.cate_id=data.data.cate_id;
            $scope.category.cate_name=data.data.cate_name;
            $scope.category.rank=data.data.rank;
        });
        $scope.tmplateUrl="./build/template/admin/editCategory.html?"+Date.parse(new Date());
    };
    $scope.saveCategory = function(category){
        $http.post(config.home_url + "/api/saveCategory",category).success(function(data){
            if(data.code==1){
                $scope.categoryList();
            }else{
                $scope.articleList=data.message;
                $scope.showMessage=true;
            }
        });
    };
});

