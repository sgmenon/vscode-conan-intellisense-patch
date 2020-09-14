# conan-intellisense-patch

This VSCode extension will allow the C++ intellisense extension to work correctly when a workspace contains a conanfile.txt or conanfile.py at the root level

## Installation 

Make sure you have `node.js` version >v12, and npm version >v6

### For Debian/Ubuntu
- Install `node.js` using [these steps](https://github.com/nodesource/distributions/blob/master/README.md#debinstall).
- Install npm

    ```sh
    # get npm
    sudo apt-get install npm 
    # upgrade to the latest version
    npm install -g npm@latest
    ```

### Build and install VSIX package

1. Build the package
    - run `npm install`
    - run `npm install -g npx`
    - run `npx vsce package`
    This will create a file name named `conan-intellisense-patch-0.0.1.vsix`.
1. [Install](conan-intellisense-patch-0.0.1) the .vsix file.

## Workflow

1. Open VSCode to the workspace where you have a project that uses CMake and Conan.
1. Invoke the cmake generator in some build folder.
1. If the folder is not named `${workspaceFolder}/build`, set the Extension setting named `conanIntellisensePatch.cmakeBuildDirectory` to the appropriate directory.
1. Hit `ctrl+shift+P`, search for the command `patchCppIncludePaths`. and run the command.
1. Your project now should have all include paths that come from Conan appropriately set.

## Requirements

This extension is meant to complement the C++ Intellisense extension.

## Extension Settings

This extension contributes the following settings:

* `conanIntellisensePatch.cmakeBuildDirectory`: directory where the CMake generator was invoked. The default value is `${workspaceFolder}/build`.

## Known Issues

## Release Notes

### 0.0.1

Initial unstable version...

