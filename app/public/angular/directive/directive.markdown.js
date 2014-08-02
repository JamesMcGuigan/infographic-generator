var githubMarkdown = require('github-flavored-markdown');

angular.module('infographicApp.directives')
    .directive('markdown', ['$http', function($http) {
        return {
            scope: {
                markdown: '='
            },
            link: function (scope, element, attrs) {
                $http.get(attrs.markdown).success(function(response) {
                    $(element[0]).addClass("markdown-body").html( githubMarkdown.parse( response ));
                });
            }
        };
    }]);
