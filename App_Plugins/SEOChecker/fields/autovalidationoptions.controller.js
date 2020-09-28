angular.module("umbraco")
    .controller("seoChecker.autovalidationOptionsController",
function ($scope, localizationService, notificationsService, editorService, seocheckerBackofficeResources, seocheckerHelper) {

	if (!$scope.model.value) {
        $scope.model.value = "always";
	}
	
    $scope.LocalizePrevalue = function(preval) {
        if (preval === "always") {
            return "Always validate automatically" ;
        }
        if (preval === "aftersave") {
            return "Automatically validate after save" ;
        }
       return "Never validate automatically" ;
    }

	//Initialize
	$scope.model.prevalues = [
					"never",
					"always",
					"aftersave"
	];
});
