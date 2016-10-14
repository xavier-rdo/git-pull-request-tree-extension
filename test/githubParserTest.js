var
    path         = require('path'),
    chai         = require('chai'),
    GithubParser = require(path.join(__dirname, '..', 'domain', 'githubParser'))
;

chai.should();

var parser = new GithubParser();

describe('Github Parser', function() {

    describe('Changed file line parser', function() {

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
            var line = 'unmatching-string';
            var parsed = parser.parseChangedFileBlock(line);
            parsed.should.equal(false);
        });

    });

});
