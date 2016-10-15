/// <reference path="../angular/angular.js" />
/// <reference path="../angular/angular.min.js" />

var app = angular.module("angApp", ["angApp.controllers", "angApp.getEmployeeService", "ngRoute", "ui.bootstrap"]);

app.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'templates/header.html',
        controller: 'getDataCodeCafe'
    }).
    when('/home', {
        templateUrl: 'html/home.html',
        controller: 'loginCtrl'
    }).
    otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode(true);
}]);