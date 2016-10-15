/// <reference path="../angular/angular.js" />

var cont = angular.module("angApp.controllers", []);

cont.controller("TodoController", function($scope) {
   
}).controller("getDataCodeCafe", ["$scope", "getEmployeeService", "filterFilter", "$filter", function ($scope, getEmployeeService, filterFilter, $filter) {

    $scope.topLang = [],
    $scope.total,
    $scope.topTitle = [],
    $scope.topLevel= [],
    $scope.filteredTodos = [],
    $scope.currentPage = 1,
    $scope.numPerPage = 6,
    $scope.maxSize = 5;
    $scope.total;

    $scope.makeTodos = function () {
        $scope.todos = [];
        var promise = getEmployeeService.getEmpRest();
        promise.then(function (successParam) {
            $scope.todos = successParam;
            

            //convertion of datatypes
            for (var i = 0; i < $scope.todos.length ; i++) {
                $scope.todos[i].id = parseInt($scope.todos[i].id);
                $scope.todos[i].category = parseInt($scope.todos[i].category);
                $scope.todos[i].quantity = parseInt($scope.todos[i].quantity);
                $scope.todos[i].rating = parseFloat($scope.todos[i].rating,10);
                $scope.todos[i].price = parseFloat($scope.todos[i].price, 10);
            }


            // call to $watch
            $scope.getpageCount($scope.currentPage);

            //call to function for web sql
            $scope.statisticalData($scope.todos);

            setTimeout(function(){
                $scope.getTotal();
                console.log($scope.total)
            },1000)
               
        });
   
    };
    
    $scope.makeTodos();
    
    // $watch 
    $scope.getpageCount = function (currentPage) {

        $scope.$watch("currentPage + numPerPage", function () {
           
            var begin = ((currentPage - 1) * $scope.numPerPage);
            var end = begin + $scope.numPerPage;
            
            $scope.filteredTodos = $scope.todos.slice(begin, end);
            
        });
    }


    //Filters 
    $scope.filter = function (param) {
        if (!window.event.target.checked) { //If it is not checked
            $scope.makeTodos();
            return;
        }
        //sorting 
       
        $scope.todos = $filter('orderBy')($scope.todos, param);
        $scope.getpageCount($scope.currentPage);
        return;
    };

    //Min - max price sorted
    $scope.getProduct = function () {
        
        $scope.todos = [];
        var promise = getEmployeeService.getEmpRest();
        promise.then(function (successParam) {
            $scope.todos = successParam;


            //convertion of datatypes
            for (var i = 0; i < $scope.todos.length ; i++) {
                $scope.todos[i].id = parseInt($scope.todos[i].id);
                $scope.todos[i].category = parseInt($scope.todos[i].category);
                $scope.todos[i].quantity = parseInt($scope.todos[i].quantity);
                $scope.todos[i].rating = parseFloat($scope.todos[i].rating, 10);
                $scope.todos[i].price = parseFloat($scope.todos[i].price, 10);
            }

            var min = parseInt(document.getElementById("amount1").value);
            var max = parseInt(document.getElementById("amount2").value);


            //sorting 
            //console.log(min + " || "+ max);
            $scope.tod = [];
            for (var i = 0; i < $scope.todos.length ; i++) {

                var productPrice = parseInt($scope.todos[i].price)
                if (productPrice > min && productPrice < max) {
                    $scope.tod.push($scope.todos[i]);
                }
            }

            $scope.todos = [];
            $scope.todos = $scope.tod;
            // call to filtered data for pagination
            $scope.getpageCount($scope.currentPage);

        });
    };
    

    // WEB SQL
    $scope.statisticalData = function (submissionObj) {

        var db = openDatabase('mydb', '1.0', 'total items', 5 * 1024 * 1024);
        
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS items (id unique, name, price, category)');
        });

        
        for (var i in submissionObj) {
            add(submissionObj[i]);
            
        } 

        function add(subObj) {
            db.transaction(function (tx) {
                tx.executeSql("INSERT INTO items (id, name, price, category) VALUES (" + subObj.id + ",'" + subObj.name + "','" + subObj.price + "','" + subObj.category + "')");
               
            });
        }
       
    }
   

    $scope.getTotal = function () {
        var db = openDatabase('mydb', '1.0', 'total items', 5 * 1024 * 1024);
        db.transaction(function (tx) {
            tx.executeSql("select count() as count from items", [], function (tx, results) {
                var len = results.rows.length, i;
                for (i = 0; i < 1; i++) {
                    $scope.total = results.rows.item(i).count;
                }

            });
        });
    }
    

}]);