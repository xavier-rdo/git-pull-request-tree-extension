var
    path  = require('path'),
    chai  = require('chai'),
    model = require(path.join(__dirname, '..', 'domain', 'model'))
;

chai.should();

var root = new model.Root();

var gitFiles = [
    new model.GitFile('app/Resources/cron/cron', 5, 0, 5),
    new model.GitFile('src/MyApp/Bundle/Core/CoreBundle/Resources/config/email_mappers.xml', 15, 0, 0),
    new model.GitFile('src/MyApp/Bundle/Front/CoreBundle/Resources/views/Account/account.html.twig', 5, 0, 0),
    new model.GitFile('src/MyApp/Mail/Mapper/Custom/ReviewRecord.php', 5, 0, 5),
    new model.GitFile('src/MyApp/Mail/Mapper/Custom/ReviewRecordMapper.php', 5, 0, 5),
    new model.GitFile('src/MyApp/Migrations/Version20150922174714.php', 5, 0, 5),
    new model.GitFile('src/MyApp/Model/Enums/EmailType.php', 5, 0, 5),
    new model.GitFile('src/MyApp/Model/RecordRepository.php', 5, 0, 5),
    new model.GitFile('src/MyApp/Api/Application/Command/SubmitReviewCommand.php', 5, 0, 5),
    new model.GitFile('src/MyApp/Api/Application/Command/SubmitReviewCommandHandler.php', 5, 0, 5),
    new model.GitFile('src/MyApp/Api/Domain/Model/Review.php', 5, 0, 5),
    new model.GitFile('src/MyApp/Api/Domain/Repository/ReviewRepositoryInterface.php', 5, 0, 5),
    new model.GitFile('src/MyApp/Api/Infrastructure/Bundle/Command/NotifyReviewableRecordsCommand.php', 5, 0, 5),
    new model.GitFile('src/MyApp/Api/Infrastructure/Bundle/Controller/ReviewController.php', 5, 0, 5),
    new model.GitFile('src/MyApp/Api/Infrastructure/Bundle/Resources/config/doctrine/Review.orm.yml', 5, 0, 5),
    new model.GitFile('src/MyApp/Api/Infrastructure/Bundle/Resources/config/routing.yml', 15, 0, 5),
    new model.GitFile('src/MyApp/Api/Infrastructure/Bundle/Resources/config/services.yml', 5, 0, 10),
    new model.GitFile('src/MyApp/Api/Infrastructure/Bundle/Resources/translations/messages.fr.yml', 5, 0, 5),
    new model.GitFile('src/MyApp/Api/Infrastructure/Repository/Doctrine/ReviewRepository.php', 5, 0, 5),
    new model.GitFile('composer.json', 10, 0, 8),
    new model.GitFile('composer.lock', 10, 0, 2)
];

describe('Github pull request File TreeBuilder\n', function() {

    describe('Tree Model (Git Files, Tree Root, Folders and Files)', function() {

        it("Should create a root folder with name '.'", function() {
            root.name.should.equal('/');
        });

        it("Should instantiate 21 Git Files", function()  {
            gitFiles.length.should.equal(21);
        });
    });

    describe('Tree Builder', function() {
        new model.TreeBuilder(root, gitFiles);

        it("Should add two files in root folder", function() {
            Object.keys(root.files).length.should.equal(2);
        });

        it("Should add two sub-folders in root folder", function() {
            Object.keys(root.folders).length.should.equal(2);
        });

        it("Should register 20 new lines in root folder", function() {
            root.created.should.equal(20);
        });

        it("Should register 10 removed lines in root folder", function(){
            root.removed.should.equal(10);
        });

        var folder = root
            .getSubFolder('src')
            .getSubFolder('MyApp')
            .getSubFolder('Api')
            .getSubFolder('Infrastructure')
            .getSubFolder('Bundle')
            .getSubFolder('Resources')
        ;

        it("Should add two folders in src/MyApp/Api/Infrastructure/Bundle/Resources", function() {
            Object.keys(folder.folders).length.should.equal(2);
        });

        it("Should add no file in src/MyApp/Api/Infrastructure/Bundle/Resources", function() {
           Object.keys(folder.files).length.should.equal(0);
        });

        it("Should therefore not increment created/updated/removed counters in that folder", function() {
            folder.created.should.equal(0);
            folder.updated.should.equal(0);
            folder.removed.should.equal(0);
        });

        it("Should increment created and removed lines in 'config' sub-folder", function() {
            var subFolder = folder.getSubFolder('config');
            subFolder.created.should.equal(20);
            subFolder.removed.should.equal(15);
        });
    });
});
