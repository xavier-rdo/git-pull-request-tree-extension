(function(global) {

    var TreeRenderer = function(root) {
        this.root = root;
        this.parentContainer = document.createElement('div');
        this.parentContainer.className = 'tree-view';
    };

    TreeRenderer.prototype.render = function() {
        var rootContainer = this.renderFolder(this.root);
        this.parentContainer.appendChild(rootContainer);
        return this.parentContainer;
    };

    TreeRenderer.prototype.renderFolder = function(folder) {

        var folderContainer       = document.createElement('div');
        folderContainer.className = "folder-container";
        var folderTitle           = document.createElement('h2');
        folderTitle.textContent   = folder.name;
        folderContainer.appendChild(folderTitle);

        for (key in folder.folders) {
            subfolder = folder.folders[key];
            folderContainer.appendChild(this.renderFolder(subfolder));
        }

        var fileList = this.renderFiles(folder);
        if (false !== fileList) {
            folderContainer.appendChild(fileList);
        }

        return folderContainer;
    };

    TreeRenderer.prototype.renderFiles = function(folder) {
        var keys = Object.keys(folder.files);
        if (keys.length === 0) {
            return false;
        }
        var fileList = document.createElement('ul');
        fileList.className = "file-container";
        for (key in keys) {
            var gitfile  = folder.files[keys[key]];
            var fileItem = document.createElement('li');
            fileItem.textContent = gitfile.name;
            fileList.appendChild(fileItem);
        }

        return fileList;
    };

    global.TreeRenderer = TreeRenderer;

})(this);
