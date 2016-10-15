(function(global) {

    /**
     * @param {Root} root
     *
     * @constructor
     */
    var TreeRenderer = function(root) {
        this.root = root;
        this.parentContainer = document.createElement('ul');
        this.parentContainer.className = 'ext-tree-view';
    };

    /**
     * Build & return the DOM Element (ul: unordered list) that contains the tree structure (folders & files)
     *
     * @returns {Element}
     */
    TreeRenderer.prototype.render = function() {
        var rootContainer = this.renderFolder(this.root);
        this.parentContainer.appendChild(rootContainer);
        return this.parentContainer;
    };

    /**
     * Render the DOM Element (li: list-item) that contains the folder's items (files & subfolders).
     *
     * @param {FolderNode} folder
     *
     * @returns {Element}
     */
    TreeRenderer.prototype.renderFolder = function(folder) {

        var folderContainer       = document.createElement('li');
        folderContainer.className = "jstree-open";
        var folderTitle           = document.createElement('span');
        folderTitle.textContent   = folder.name;

        var counters = this.renderCounters(folder);
        for (var i = 0 ; i < counters.length ; i++) {
            folderTitle.appendChild(counters[i]);
        }
        folderContainer.appendChild(folderTitle);

        // Handle folder's subfolders
        var subFoldersContainer = document.createElement('ul');
        for (var key in folder.folders) {
            var subfolder = folder.folders[key];
            subFoldersContainer.appendChild(this.renderFolder(subfolder));
        }
        folderContainer.appendChild(subFoldersContainer);

        // Handle folder's files
        var fileList = this.renderFiles(folder);
        if (false !== fileList) {
            folderContainer.appendChild(fileList);
        }

        return folderContainer;
    };

    /**
     * Build & return the DOM Element (ul: unordered list) that contains the folder's files.
     *
     * @param {FolderNode} folder
     *
     * @returns {Element} UL Element where each LI corresponds to a file.
     */
    TreeRenderer.prototype.renderFiles = function(folder) {
        var keys = Object.keys(folder.files);
        if (keys.length === 0) {
            return false;
        }
        var fileList = document.createElement('ul');
        for (key in keys) {
            var gitfile  = folder.files[keys[key]];
            var fileItem = document.createElement('li');
            fileItem.textContent = gitfile.name;
            fileItem.setAttribute('data-jstree', '{"icon": "jstree-file"}');
            var counters = this.renderCounters(gitfile);
            for (var i = 0 ; i < counters.length ; i++) {
                fileItem.appendChild(counters[i]);
            }
            fileList.appendChild(fileItem);
        }

        return fileList;
    };

    /**
     * Return for the current node the DOM elements (span) that display the number of additions & deletions.
     *
     * @param {Node} node
     *
     * @returns {Element[]} span elements: one for additions, one for deletions
     */
    TreeRenderer.prototype.renderCounters = function(node) {
        var spans = [];

        if (node.created > 0) {
            var span = document.createElement('span');
            span.className = 'ext-counter counter-created';
            span.textContent = node.created;
            spans.push(span);
        }

        if (node.removed > 0) {
            var span = document.createElement('span');
            span.className = 'ext-counter counter-removed';
            span.textContent= node.removed;
            spans.push(span);
        }

        return spans;
    };

    global.TreeRenderer = TreeRenderer;

})(this);
