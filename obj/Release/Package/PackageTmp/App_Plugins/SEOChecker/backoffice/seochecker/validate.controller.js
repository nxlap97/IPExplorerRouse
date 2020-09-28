angular.module("umbraco")
    .controller("seoChecker.validateController",
    function ($scope, $routeParams, notificationsService, editorService, seocheckerBackofficeResources, seocheckerHelper) {

        $scope.bindData = function () {

            seocheckerBackofficeResources.initializeValidationForm($routeParams.id).then(function (res) {
                $scope.model = res.data;
                $scope.loaded = true;
                seocheckerHelper.syncPath($scope.model.path);
                $scope.setTitle();
            });
        };

        $scope.selectRoot = function () {
            editorService.contentPicker({
                startNodeId: -1,
                multiPicker: false,
                callback: function (data) {
                    $scope.model.rootNode.id = data.id;
                    $scope.model.rootNode.name = data.name;
                }
            });
        };

        $scope.validate = function () {
            seocheckerBackofficeResources.validate($scope.model).then(function (res) {
                $scope.model = res.data;
                $scope.setTitle();
                seocheckerHelper.showNotification($scope.model.notificationStatus);
                $scope.frm.$setPristine();
            });
        };

        $scope.save = function () {
            seocheckerBackofficeResources.saveValidation($scope.model).then(function (res) {
                $scope.model = res.data;
                $scope.setTitle();
                if (!$scope.model.isInValid) {
                    seocheckerHelper.syncPath($scope.model.path);
                    seocheckerHelper.showNotification($scope.model.notificationStatus);
                }
                $scope.frm.$setPristine();
            });
        };

        $scope.setTitle = function () {
            $scope.model.displayPageName = $scope.model.scheduledValidation
                ? $scope.model.scheduleValidationPageName
                : $scope.model.pageName;
        };

        $scope.buttonGroup = {
            defaultButton: {
                labelKey: "seoCheckerValidate_validationStart",
                hotKey: "ctrl+s",
                buttonStyle:"primary",
                hotKeyWhenHidden: true,
                handler: function () {
                    $scope.validate();
                }
            },
            subButtons: [
                {
                    labelKey: "seoCheckerValidate_scheduleButton",
                    hotKey: "ctrl+e",
                    hotKeyWhenHidden: true,
                    handler: function () {
                        $scope.model.scheduledValidation = true;
                        $scope.setTitle();
                    }
                }
            ]
        };

        //Initialize
        $scope.bindData();
    });