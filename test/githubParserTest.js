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
            var line   = '+1 -2 README.md';
            var parsed = parser.parseChangedFileLine(line);
            parsed.created.should.equal(1);
            parsed.updated.should.equal(0);
            parsed.removed.should.equal(2);
            parsed.fullPath.should.equal('README.md');
        });

        it("Should parse multi-level filepaths", function() {
            var line   = '+1 -2 src/MyApp/Model/Customer.php';
            var parsed = parser.parseChangedFileLine(line);
            parsed.created.should.equal(1);
            parsed.fullPath.should.equal('src/MyApp/Model/Customer.php');
        });

        it("Should handle extra spaces", function() {
            var line   = '+1   -2    README.md';
            var parsed = parser.parseChangedFileLine(line);
            parsed.created.should.equal(1);
            parsed.removed.should.equal(2);
            parsed.fullPath.should.equal('README.md');
        });

        it("Should parse exotic minus signs", function() {
            var line   = '+1 −2 README.md';
            var parsed = parser.parseChangedFileLine(line);
            parsed.removed.should.equal(2);
            parsed.fullPath.should.equal('README.md');
        });

        it("Should handle gracefully unmatching strings", function() {
            var line = 'unmatching-string';
            var parsed = parser.parseChangedFileLine(line);
            parsed.should.equal(false);
        });

    });

});
