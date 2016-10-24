var
    path         = require('path'),
    chai         = require('chai'),
    GithubParser = require(path.join(__dirname, '..', 'domain', 'githubParser'))
;

chai.should();

var parser = new GithubParser();

describe('Github Parser', function() {

    describe('Changed file line parser', function() {

        it("Should parse summary with one or several changed files", function() {
            var parsedSummary = parser.parseSummary('1 file', '+15 −6');
            parsedSummary.changedFiles.should.equal(1);
            parsedSummary.createdLines.should.equal(15);
            parsedSummary.removedLines.should.equal(6);

            parsedSummary = parser.parseSummary('2 files', '+15 −6');
            parsedSummary.changedFiles.should.equal(2);
            parsedSummary.createdLines.should.equal(15);
            parsedSummary.removedLines.should.equal(6);
        });

        it("Should parse atomic files", function() {
            var block = '\
                <span class="diffstat tooltipped tooltipped-e" aria-label="3 additions &amp; 2 deletions">23\
                <span class="user-select-contain" title="README.md">\
                README.md\
                </span>\
            ';
            var parsed = parser.parseChangedFileBlock(block);
            parsed.created.should.equal(3);
            parsed.updated.should.equal(0);
            parsed.removed.should.equal(2);
            parsed.fullPath.should.equal('README.md');
        });

        it("Should parse multi-level filepaths", function() {
            var block = '\
                <span class="diffstat tooltipped tooltipped-e" aria-label="23 additions &amp; 0 deletions">23\
                <span class="user-select-contain" title="app/Resources/translations/messages.fr.yml">\
                app/Resources/translations/messages.fr.yml\
                </span>\
            ';
            var parsed = parser.parseChangedFileBlock(block);
            parsed.created.should.equal(23);
            parsed.fullPath.should.equal('app/Resources/translations/messages.fr.yml');
        });

        it("Should parse correctly file changes with one deletion or one addition only", function() {
            var block = '\
                <span class="diffstat tooltipped tooltipped-e" aria-label="1 addition &amp; 1 deletion">23\
                <span class="user-select-contain" title="README.md">\
                README.md\
                </span>\
            ';
            var parsed = parser.parseChangedFileBlock(block);
            parsed.created.should.equal(1);
            parsed.removed.should.equal(1);
        });

        it("Should parse binary files", function() {
            var block = '\
                <span class="diffstat tooltipped tooltipped-e" aria-label="Binary file added">BIN\
                <span class="text-green">\
                <span class="block-diff-neutral"></span><span class="block-diff-neutral"></span>\
                <span class="block-diff-neutral"></span><span class="block-diff-neutral"></span>\
                <span class="block-diff-neutral"></span>\
                </span>\
                </span>\
                <span class="user-select-contain" title="web/assets/vendor/front/images/phone-1.png">\
                web/assets/vendor/front/images/phone-1.png\
            </span>\
            ';
            var parsed = parser.parseChangedFileBlock(block);
            parsed.created.should.equal(0);
            parsed.removed.should.equal(0);
            parsed.fullPath.should.equal('web/assets/vendor/front/images/phone-1.png');
        });

        it("Should handle gracefully unmatching strings", function() {
            var parsed = parser.parseChangedFileBlock('unmatching-string');
            parsed.should.equal(false);
        });

    });

});
