// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import {parse, ParseError} from 'jsonc-parser';

// this method is called when the extension is activated
// the extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('conan-intellisense-patch.patchCppIncludePaths', async () => {
		// Look for the CMake build directory
		if (!vscode.workspace.workspaceFolders) {
			return;
		}
		var cmakeBuildDir = vscode.workspace.getConfiguration().get('conanIntellisensePatch.cmakeBuildDirectory') as string;
		if (!cmakeBuildDir) {
			return;
		}
		cmakeBuildDir = cmakeBuildDir.replace(/\${workspaceFolder}/, vscode.workspace.rootPath as string);
		var directoryFound = false;
		await new Promise((resolve) => fs.stat(cmakeBuildDir, (err, stats: fs.Stats) => {
			if (!err) {
				if (stats.isDirectory()) {
					directoryFound = true;
				}
			}
			resolve(true);
		}));

		// if the directory can't be found, display an info message telling user to update 'conanIntellisensePatch.cmakeBuildDirectory'
		if (!directoryFound) {
			vscode.window.showInformationMessage(
				`Could not find a directory "${cmakeBuildDir}" ` +
				'if you have already run cmake, set "conanIntellisensePatch.cmakeBuildDirectory"' +
				' to the location of the CMake build directory.');
		}

		// parse conanbuildinfo.txt
		var conanBuildInfo: undefined | string;
		const conanBuildInfoFile = cmakeBuildDir + "/conanbuildinfo.txt";
		await new Promise((resolve) => fs.stat(conanBuildInfoFile, (err, stats: fs.Stats) => {
			if (!err) {
				if (stats.isFile()) {
					conanBuildInfo = fs.readFileSync(conanBuildInfoFile, 'utf8');
				}
			}
			resolve(true);
		}));
		var includePaths: string[] = [];
		if (conanBuildInfo) {
			const includePathsStr = conanBuildInfo.match(/\[includedirs\]([^\[\$]+)/);
			if (includePathsStr) {
				includePaths = includePathsStr[1].trim().split('\n');
			}
		}
		if (includePaths.length === 0){
			return;
		}

		// read in existing ${workspaceFolder}/.vscode/c_cpp_properties.json
		const cppOptsPath = vscode.workspace.rootPath + "/.vscode/c_cpp_properties.json";
		fs.readFile(cppOptsPath, async (err, data) => {
			var buffStr: string;
			if (err) {
				buffStr = '{}';
			} else {
				buffStr	= data.toString('utf-8');
			}
			var errors: ParseError[] = [];
			const cppProps = parse(buffStr,errors);
			if (!cppProps["configurations"]){
				await new Promise( ()=>fs.stat(path.dirname(cppOptsPath), (err, stat)=>{
					if (err || !stat.isDirectory()) {
						fs.mkdirSync(path.dirname(cppOptsPath));
					}
				}));
				cppProps["configurations"] = [{
					"name": "Linux",
					"includePath": ["${workspaceFolder}/**"],
					"defines": [],
					"compilerPath": "/usr/bin/clang",
					"cStandard": "c11",
					"cppStandard": "c++14",
					"intelliSenseMode": "clang-x64",
					"compileCommands": "${workspaceFolder}/build/compile_commands.json"
				}];
			}
			cppProps.configurations.forEach((config:any)=>{
				if (!config["includePath"]){
					config["includePath"] = [];
				}
				const configIncludePaths = new Set(config.includePath);
				includePaths.forEach(p => configIncludePaths.add(p));
				config.includePath = [...configIncludePaths];
			});
			fs.renameSync(cppOptsPath, cppOptsPath+".old");
			fs.writeFileSync(cppOptsPath, JSON.stringify(cppProps, null, 4));

		// patch include paths
		vscode.window.showInformationMessage('Successfully patched .vscode/c_cpp_properties.json');
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
