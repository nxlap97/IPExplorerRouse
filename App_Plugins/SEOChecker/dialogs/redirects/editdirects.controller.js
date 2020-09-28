angular.module("umbraco").controller("seoChecker.EditRedirectsController", function ($scope, localizationService, seocheckerBackofficeResources, seocheckerHelper) {
    $scope.initializeConfirm = function () {
        $scope.parentModel = $scope.model;
        seocheckerBackofficeResources.initializeEditRedirect($scope.parentModel.redirectid).then(function (res) {
            $scope.model = res.data;
            $scope.loaded = true;

            $scope.$watch("model.tabs['0'].properties[0].value", function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (!seocheckerHelper.isNullOrUndefined(newVal)) {
                        seocheckerBackofficeResources.getContentTypeOfRedirectUrl(newVal).then(function (res) {
                            $scope.model.tabs[0].properties[1].value.contentType = res.data;
                        });
                    }
                }
            }, true);
        });
    };

    $scope.save = function () {
        seocheckerBackofficeResources.saveRedirect($scope.model).then(function (res) {
            var result = res.data;
            if (!result.isInValid) {
                seocheckerHelper.showNotification(result.notificationStatus);
                if($scope.parentModel && $scope.parentModel.submit) {
                    $scope.parentModel.submit();
                }
            }
        });


    };

    $scope.onCancel = function () {
        if($scope.parentModel && $scope.parentModel.close) {
            $scope.parentModel.close();
        }
    };

    //Initialize
    $scope.initializeConfirm();
});