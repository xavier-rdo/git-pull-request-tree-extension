/* *************************** */
/* ********** MODEL ********** */
/* *************************** */

(function(global) {

    /**
     * Base model for an atomic file path node (either a file, or a folder)
     * It exposes common fields : name, created (int), updated (int), etc.
     *
     * @param name String Name of the node
     *
     * @constructor
     */
    var Node = function (name) {
        this.name    = name;
        this.created = 0;
        this.updated = 0;
        this.removed = 0;
    };

    /**
     * Return the parent of the current node.
     *
     * @returns FolderNode
     */
    Node.prototype.getParent = function () {
        return this.parent;
    };

    /**
     * Set the parent of the current node
     *
     * @param parent FolderNode
     */
    Node.prototype.setParent = function (parent) {
        if (this instanceof Root) {
            throw new Error("A root node cannot have any parent");
        }
        if (!(parent instanceof FolderNode)) {
            throw new Error("Wrong type for parent. It must be an instance of FolderNode");
        }
        this.parent = parent;
    };

    /**
     * Model for a git file that is part of a Pull/Merge Request. Wraps data extracted
     * from "Files changed" list in a Github pull request page : file path, count of new lines
     * and deleted lines.
     *
     * To be Gitlab-compliant, it also exposes the updated parts (Gitlab distinguishes
     * between created files, updated files and deleted files).
     *
     * @param fullPath String  Full path of the file relative to the git project root
     * @param created  Integer Count of new lines (Github) or 1 if new file (Gitlab)
     * @param updated  Integer Count of updated lines (Github) or 1 if updated file (Gitlab)
     * @param removed  Integer Count of removed lines (Github) or 1 removed file (Gitlab)
     *
     * @constructor
     */
    var GitFile = function (fullPath, created, updated, removed) {
        this.fullPath = fullPath;
        var parts     = fullPath.split('/');
        var filename  = parts.pop();
        this.path     = parts.join('/');
        Node.call(this, filename);
        this.created = created;
        this.updated = updated;
        this.removed = removed;
    };

    GitFile.prototype = Object.create(Node.prototype);

    /**
     * Model for folder nodes (root or sub-folder)
     *
     * {@inheritdoc}
     */
    var FolderNode = function (name) {
        Node.call(this, name);
        this.files = [];
        this.folders = [];
    };

    FolderNode.prototype = Object.create(Node.prototype);

    /**
     * Add a folder node as a child of the current folder node
     * unless it already exists
     *
     * @param name String
     *
     * @returns FolderNode
     */
    FolderNode.prototype.addFolder = function (name) {
        if (!(name in this.folders)) {
            var folder = new FolderNode(name);
            folder.setParent(this);
            this.folders[name] = folder;
        }

        return this.folders[name];
    };

    /**
     * Add a file to the current folder
     *
     * @param file GitFile
     */
    FolderNode.prototype.addFile = function (file) {
        file.setParent(this);
        this.files[file.name] = file;
        this.created += file.created;
        this.updated += file.updated;
        this.removed += file.removed;
    };

    /**
     * Retrieve a sub-folder by name if it exists in the current folder
     *
     * @param name String Name of the sub-folder to retrieve
     *
     * @returns FolderNode|null
     */
    FolderNode.prototype.getSubFolder = function(name) {
        if (! (name in this.folders)) {
            return null;
        }

        return this.folders[name];
    };

    /**
     * Model for root folder (has no parent).
     *
     * @constructor
     */
    var Root = function () {
        FolderNode.call(this, '/');
        this.parent = null;
    };

    Root.prototype = Object.create(FolderNode.prototype);

    /* *************************** */
    /* ****** TREE BUILDER ******* */
    /* *************************** */

    /**
     * Build the folder tree from root, including all folders and files
     * contained in git files' paths.
     *
     * @param root     Root
     * @param gitFiles GitFile[]
     *
     * @constructor
     */
    var TreeBuilder = function (root, gitFiles) {
        for (key in gitFiles) {
            var gitFile       = gitFiles[key];
            var parts         = gitFile.path !== '' ? gitFile.path.split('/') : [];
            var currentParent = root;
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i];
                currentParent = currentParent.addFolder(part);
            }
            currentParent.addFile(gitFile);
        }
    };

    /*
     * Javascript plumbing to make Model and TreeBuilder available in different contexts (Node, browser, ...)
     *
     * @see https://gist.github.com/CrocoDillon/9990078
     */
    if (typeof exports === 'undefined') {
        global.GitFile     = GitFile;
        global.Root        = Root;
        global.FolderNode  = FolderNode;
        global.TreeBuilder = TreeBuilder;
    } else {
        exports.GitFile     = GitFile;
        exports.Root        = Root;
        exports.FolderNode  = FolderNode;
        exports.TreeBuilder = TreeBuilder;
    }

}(this));
