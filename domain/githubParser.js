/**
 * Github parser.
 *
 * Parses strings extracted from Github Pull Request pages and converts them into structured data
 * in order to pass them to the domain or service layer.
 *
 * Acts as an intermediary between the view layer (HTML pages) and service/domain layer.
 *
 * Most of the data it converts are provided by the content scripts of the Chrome extension
 * that analyze the DOM of Github pages.
 */

(function(global) {

    var GithubParser = function() {};

    /**
     * Converts a string representation of a modified file (filepath, number of created lines,
     * number of removed lines) into an array.
     *
     * Example of a line to be parsed : '+1 -1 src/AppBundle/Form/Type/MyFormType.php'
     *
     * @param line string The Github line corresponding to a changed file in the PR list
     *
     * @returns Array {{created: number, updated: number, removed: number, fullPath: string}}
     */
    GithubParser.prototype.parseChangedFileLine = function(line) {
        // @TODO: handle this special case: 'BIN images/icon_file.png'
        // Replace exotic minus sign ...
        line = line.replace('−', '-');
        pattern = /([\+\-\−][0-9]+)[\s]*([\+\-\−][0-9]+)[\s]*([\w\.\-\/_]*)/;
        var matches = line.match(pattern);

        if (matches === null) {
            return false;
        }

        return {
            created: Math.abs(parseInt(matches[1])),
            updated: 0,
            removed: Math.abs(parseInt(matches[2])),
            fullPath: matches[3].trim()
        };
    };

    if (typeof exports === 'undefined') {
        global.GithubParser = GithubParser;
    } else {
        module.exports = GithubParser;
    }

})(this);
