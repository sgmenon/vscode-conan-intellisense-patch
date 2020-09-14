# conan-intellisense-patch

This VSCode extension will allow the C++ intellisense extension to work correctly when a workspace contains a conanfile.txt or conanfile.py at the root level

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

### 1.0.0

Initial release 

