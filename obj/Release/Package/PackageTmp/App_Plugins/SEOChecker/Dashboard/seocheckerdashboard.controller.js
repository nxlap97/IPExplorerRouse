angular.module("umbraco")
    .controller("seoChecker.dashboardController",
    function ($scope, $timeout, $routeParams, notificationsService, editorService, seocheckerBackofficeResources, seocheckerHelper) {
       
        $scope.bindData = function () {
            seocheckerBackofficeResources.initializeDashboard().then(function (res) {
                $scope.loaded = true;
                $scope.model = res.data;
            });
        };
        $scope.upload = function () {
            var fileInput = document.getElementById('selectLicenseFile');
            seocheckerHelper.uploadFiles('uploadlicense', fileInput.files[0],function (fileInfo) {

                seocheckerBackofficeResources.processLicenseFile(fileInfo).then(function (res) {
                    var uploadedModel = res.data;
                    seocheckerHelper.showNotification(uploadedModel.notificationStatus);
                    $scope.bindData();
                });
            });
        };
        $scope.bindData();
    });