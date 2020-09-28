angular.module("umbraco")
    .controller("seoChecker.seocontentPickerController",
    function ($scope, $routeParams, notificationsService, editorService) {

        $scope.showDialog = function () {
            var dialogOptions = {
                multiPicker: false,
                startNodeId: null,
                submit: function submit(data) {
                    $scope.model.value.id = data.selection[0].id;
                    $scope.model.value.name = data.selection[0].name;
                    editorService.close();
                },
                close: function close() {
                    editorService.close();
                },
                idType: "int"
            };
            if ($scope.model.value.contentType === 'media') {
                editorService.mediaPicker(dialogOptions);

            } else {

                editorService.contentPicker(dialogOptions);
            }

        };

        $scope.clear = function () {
            $scope.model.value.id = null;
            $scope.model.value.name = '';
        };
      
    });
