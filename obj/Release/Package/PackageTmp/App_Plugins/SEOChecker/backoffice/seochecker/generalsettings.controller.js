angular.module("umbraco")
    .controller("seoChecker.generalSettingsController",
    function ($scope, $rootScope, $routeParams, notificationsService, editorService,eventsService, seocheckerBackofficeResources, seocheckerHelper) {
        var evts = [];
        $scope.bindData = function () {

            seocheckerBackofficeResources.initializeGeneralSettings($scope.model).then(function (res) {
                $scope.model = res.data;
                $scope.loaded = true;
                seocheckerHelper.syncPath($scope.model.path);
                seocheckerHelper.syncPath($scope.model.path);
                evts.push(eventsService.on("app.tabChange", function (name, tabAlias) {
                    tabChanged(tabAlias);
                }));
            },
                function (data) {
                    seocheckerHelper.showServerError();
                });
        };
        $rootScope.$on("seobooleanCheckbox.changed", function (event, data) {
            

            if (data.alias === 'enableUrlRewriting') {
                $scope.updateTabModel('rewriteTab');
            }

            if (data.alias === 'enableRedirectmodule') {
                $scope.updateTabModel('redirectTab');
            }

            if (data.alias === 'useFaceBook') {
                $scope.updateTabModel('socialTab');
            }
            if (data.alias === 'useTwitter') {
                $scope.updateTabModel('socialTab');
            }
            if (data.alias === 'robotsTxtEnabled') {
                $scope.updateTabModel('robotsTxt');
            }
            if (data.alias === 'xmlSitemapEnabled') {
                $scope.updateTabModel('xmlSitemapTab');
            }
        });

        function tabChanged(tabinfo) {
            var newActiveTab = seocheckerHelper.getTabByName($scope.model.tabs, tabinfo.alias);
            $scope.changeTab(newActiveTab);
        };

        $scope.getActiveTab = function () {
            if ($scope.loaded === true) {
                var newActiveTab = $scope.model.tabs[0];
                if (angular.isUndefined($scope.model) || angular.isUndefined($scope.model.tabs)) {
                    return {};
                }

                $scope.model.tabs.forEach(function (tab) {
                    if (tab.active === true) {
                        newActiveTab = tab;
                    }
                });
                return newActiveTab;
            }
        };
        $scope.changeTab = function (tab) {
            $scope.model.tabs.forEach(function (tab) {
                tab.active = false;
            });
            tab.active = true;
        };


        $scope.updateTabModel = function (tabName) {
            seocheckerBackofficeResources.initializeGeneralSettings($scope.model)
                .then(function (res) {
                    seocheckerHelper.updateTab($scope.model, res.data, tabName);
                },
                function (data) {
                    seocheckerHelper.showServerError();
                });
        }

        $scope.save = function () {
            seocheckerBackofficeResources.saveGeneralSettings($scope.model).then(function (res) {
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

        //Initialize
        $scope.bindData();

        $scope.$on('$destroy', function () {
            for (var e in evts) {
                eventsService.unsubscribe(evts[e]);
            }
        });
    });