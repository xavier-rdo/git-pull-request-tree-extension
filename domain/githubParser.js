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
     * Example of a block to be parsed :
     *
     * ```
     *     <span class="diffstat tooltipped tooltipped-e" aria-label="23 additions &amp; 0 deletions">23 
     *         <span class="block-diff-added"></span>
     *         <span class="block-diff-added"></span>
     *         <span class="block-diff-added"></span>
     *         <span class="block-diff-added"></span>
     *         <span class="block-diff-added"></span>
     *     </span>
     *     <span class="user-select-contain" title="app/Resources/translations/messages.fr.yml">
     *         app/Resources/translations/messages.fr.yml
     *     </span>
     * ```
     *
     * @param changedFileBlock string The Github HTML corresponding to a changed file header in the PR list
     *
     * @returns Array {{created: number, updated: number, removed: number, fullPath: string}}
     */
    GithubParser.prototype.parseChangedFileBlock = function(changedFileBlock) {
        var pathRegexp = /<span class="user-select-contain" title="[\sa-zA-Z0-9\/\.\-\_]*">([\sa-zA-Z0-9\/\.\-\_]*)<\/span>/g;
        var matches = pathRegexp.exec(changedFileBlock);

        if (matches === null) {
            return false;
        }

        var filePath = matches[1].trim();
        var additionsRegexp = /([0-9]+)[\s]*addition*/;
        var additionMatches = additionsRegexp.exec(changedFileBlock);
        var deletionsRegexp = /([0-9]+)[\s]*deletion/;
        var deletionMatches = deletionsRegexp.exec(changedFileBlock);

        return {
            created: additionMatches !== null ? parseInt(additionMatches[1]) : 0,
            updated: 0,
            removed: deletionMatches !== null ? parseInt(deletionMatches[1]) : 0,
            fullPath: filePath
        };
    };

    /**
     * Parse the summary string from Github commit page to extract total number of files,
     * total number of additions (created lines) and deletions (removed lines).
     *
     * @param {string} changedFilesText eg '1 file', '12 files'
     * @param {string} changedLinesText eg '+12 −5'
     *
     * @return {Array} With keys: changedFiles, createdLines and removedLines
     */
    GithubParser.prototype.parseSummary = function(changedFilesText, changedLinesText) {
        // Number of changed files
        var pattern      = /([0-9]+)[\s]*file/;
        var matches      = changedFilesText.match(pattern);
        var changedFiles = parseInt(matches[1]);

        // Number of added lines
        var pattern      = /\+([0-9]+)/;
        var matches      = changedLinesText.match(pattern);
        var createdLines = parseInt(matches[1]);

        // Number of deleted lines
        var pattern      = /\−([0-9]+)/;
        var matches      = changedLinesText.match(pattern);
        var removedLines = parseInt(matches[1]);

        return {
            changedFiles: changedFiles,
            createdLines: createdLines,
            removedLines: removedLines
        }
    };

    /**
     * Extract the project's name from the page's main title (H1 content). The title's pattern is: <author>/<project>.
     *
     * @param {string} pageTitle
     *
     * @returns {string}
     */
    GithubParser.prototype.parseProjectName = function(pageTitle) {
        var chunks = pageTitle.split('/');

        return chunks[1].trim();
    };

    // Export GithubParser module (in the CommonJS way or globally)
    if (typeof exports === 'undefined') {
        global.GithubParser = GithubParser;
    } else {
        module.exports = GithubParser;
    }

})(this);
