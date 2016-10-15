/// <reference path="../angular/angular.js" />

var myService = angular.module("angApp.getEmployeeService", []);

myService.factory("getEmployeeService", ["$http", "$q", function ($http, $q) {

    var myDataService = {
        getEmpRest: function () {
            var deferred = $q.defer();
            var post = undefined;
            getRest = function () {
                deferred.notify();
                $http.post("https://hackerearth.0x10.info/api/fashion?type=json&query=list_products")
                .then(function (result) {
                    post = result.data.products;
                    //console.log(post)
                    deferred.resolve(post);
                }, function (error) {
                    post = error;
                    deferred.reject(error);
                });
                post = deferred.promise;
                return $q.when(post);
            }
            return getRest();
        }
    }

    return myDataService;
}]);