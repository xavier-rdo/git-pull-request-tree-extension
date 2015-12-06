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

    /**
     * Parse the summary string from Github commit page to extract total number of files,
     * total number of additions (file lines) and deletions (file lines).
     *
     * The summary to parse looks like this : 'Showing 25 changed files with 685 additions and 6 deletions.'
     *
     * Those results are also used in order to compute the relative weight of each changed file/folder
     * in the commit and then infer highlighted ones.
     *
     * @param  {string} summary
     *
     * @return {Array} With keys: changedFiles, createdLines and removedLines
     */
    GithubParser.prototype.parseSummary = function(summary) {
        // Number of changed files
        var pattern      = /([0-9]+)[\s]*changed/;
        var matches      = summary.match(pattern);
        var changedFiles = parseInt(matches[1]);

        // Number of added lines
        var pattern      = /([0-9]+)[\s]*additions/;
        var matches      = summary.match(pattern);
        var createdLines = parseInt(matches[1]);

        // Number of deleted lines
        var pattern      = /([0-9]+)[\s]*deletions/;
        var matches      = summary.match(pattern);
        var removedLines = parseInt(matches[1]);

        return {
            changedFiles: changedFiles,
            createdLines: createdLines,
            removedLines: removedLines
        }
    }

    // Export GithubParser module (in the CommonJS way or globally)
    if (typeof exports === 'undefined') {
        global.GithubParser = GithubParser;
    } else {
        module.exports = GithubParser;
    }

})(this);
