angular.module("umbraco").controller("seoChecker.ConfirmDialogController", function ($scope, localizationService) {

        $scope.initializeConfirm = function () {
            localizationService.localize($scope.model.localizationKey).then(function (value) {
                $scope.confirmCaption = value;
            });
        };

        $scope.confirm = function() {
            if($scope.model && $scope.model.close) {
                $scope.model.submit();
            }
        };

        $scope.cancel = function () {
            if($scope.model && $scope.model.close) {
                $scope.model.close();
            }
        };

        //Initialize
        $scope.initializeConfirm();
    });