angular.module("umbraco")
    .controller("seoChecker.booleanFieldController",
    function ($scope, $rootScope) {
        $scope.itemChanged = function (item) {
            item.value = !item.value;
            $rootScope.$broadcast("seobooleanCheckbox.changed", { alias: item.alias, value: item.value });
        };

    });
