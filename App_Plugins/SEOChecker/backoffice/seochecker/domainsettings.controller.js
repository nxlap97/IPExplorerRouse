angular.module("umbraco")
    .controller("seoChecker.domainSettingsController",
    function ($scope, $routeParams, notificationsService, editorService,eventsService, seocheckerBackofficeResources, seocheckerHelper) {
        var evts = [];

        $scope.bindData = function () {

            seocheckerBackofficeResources.initializeDomainSettings($routeParams.id).then(function (res) {
                $scope.model = res.data;
                $scope.loaded = true;
                seocheckerHelper.syncPath($scope.model.path);
                    evts.push(eventsService.on("app.tabChange", function(name, tabAlias) {
                        tabChanged(tabAlias);
                    }));
            },
            function (data) {
                seocheckerHelper.showServerError();
            });
        };

        function tabChanged(tabinfo) {
            var newActiveTab = seocheckerHelper.getTabByName($scope.model.tabs,tabinfo.alias);
            $scope.changeTab(newActiveTab);
        };
      
        $scope.getActiveTab = function()
        {
            if ($scope.loaded === true) {
                var newActiveTab = $scope.model.tabs[0];
                if (angular.isUndefined($scope.model) || angular.isUndefined($scope.model.tabs)) {
                    return {};
                }

                $scope.model.tabs.forEach(function(tab) {
                    if (tab.active === true) {
                        newActiveTab = tab;
                    }
                });
                return newActiveTab;
            }
        };

        $scope.save = function () {
            seocheckerBackofficeResources.saveDomainSettings($scope.model).then(function (res) {
                var model = res.data;
                if (!model.isInValid) {
                    $scope.frm.$setPristine();
                    seocheckerHelper.showNotification(model.notificationStatus);
                }
            },
            function (data) {
                seocheckerHelper.showServerError();
            });
        };

        $scope.changeTab = function(tab) {
            $scope.model.tabs.forEach(function(tab) {
                tab.active = false;
            });
            tab.active = true;
        };

        //Initialize
        $scope.bindData();

        $scope.$on('$destroy', function () {
            for (var e in evts) {
                eventsService.unsubscribe(evts[e]);
            }
        });
    });