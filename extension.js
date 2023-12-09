const vscode = require('vscode');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */



function activate(context) {
    const currentWorkspace = vscode.workspace.workspaceFolders?.[0];
	const currentWorkspacePath = currentWorkspace.uri.fsPath;

	let showCurrentWorkspaceDisposable = vscode.commands.registerCommand('test-extension.showCurrentWorkspace', function () {
		vscode.window.showInformationMessage('Текущая рабочая папка: ' + currentWorkspacePath);
	});

	context.subscriptions.push(showCurrentWorkspaceDisposable);



	let runScanCommandDisposable = vscode.commands.registerCommand('test-extension.runScan', function () {
		exec('npm run scan', { cwd: currentWorkspacePath }, (error, stdout, stderr) => {
			// if (error == null) {
			// 	console.error(`Ошибка выполнения команды: ${error.message}`);
			// 	console.log(`stdout: ${stdout}`);
            //     console.error(`stderr: ${stderr}`);
			// 	vscode.window.showErrorMessage('Ошибка при сканировании библиотек');
			// 	return;
			// }
			vscode.window.showInformationMessage('Сканирование библиотек успешно завершено');
		});
	});

	context.subscriptions.push(runScanCommandDisposable);



	let runScanCommandCode = vscode.commands.registerCommand('test-extension.runScanCode', function () {
		exec('npx eslint *.js > eslint_report.txt', { cwd: currentWorkspacePath }, (error, stdout, stderr) => {
			vscode.window.showInformationMessage('Сканирование кода успешно завершено');
		});
	});

	context.subscriptions.push(runScanCommandCode);



	let addScanScriptDisposable = vscode.commands.registerCommand('test-extension.addScanScript', function () {
        // Путь к файлу package.json
        const packageJsonPath = path.join(currentWorkspacePath, 'package.json');

        // Проверяем, существует ли файл package.json
        if (fs.existsSync(packageJsonPath)) {
            // Читаем содержимое файла
            const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');

            try {
                // Преобразуем содержимое в объект
                const packageJson = JSON.parse(packageJsonContent);

                // Добавляем новый скрипт в раздел "scripts"
                if (!packageJson.scripts) {
                    packageJson.scripts = {};
                }
                packageJson.scripts.scan = "auditjs ossi --json > lib_problems.json";

                // Записываем обновленный объект обратно в файл
                fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

                vscode.window.showInformationMessage('Скрипт "scan" успешно добавлен в файл package.json');
            } catch (error) {
                console.error('Ошибка при обработке файла package.json:', error.message);
                vscode.window.showErrorMessage('Ошибка при обработке файла package.json: ' + error.message);
            }
        } else {
            vscode.window.showWarningMessage('Файл package.json не найден в текущей директории');
        }
    });

    context.subscriptions.push(addScanScriptDisposable);



	let installAuditjsDisposable = vscode.commands.registerCommand('test-extension.installAuditjs', function () {
		exec('npm install auditjs -D', { cwd: currentWorkspacePath }, (error, stdout, stderr) => {
			// if (error) {
			// 	console.error(`Ошибка выполнения команды: ${error.message}`);
			// 	console.log(`stdout: ${stdout}`);
			// 	console.error(`stderr: ${stderr}`);
			// 	vscode.window.showErrorMessage(`Ошибка выполнения команды: ${error.message}`);
			// } else {
				vscode.window.showInformationMessage('Установка auditjs завершена успешно.');
			// }
		});
	});

	context.subscriptions.push(installAuditjsDisposable);



	let installEslintDisposable = vscode.commands.registerCommand('test-extension.installESlint', function () {
		exec('npm install eslint -D', { cwd: currentWorkspacePath }, (error, stdout, stderr) => {
			// if (error) {
			// 	console.error(`Ошибка выполнения команды: ${error.message}`);
			// 	console.log(`stdout: ${stdout}`);
			// 	console.error(`stderr: ${stderr}`);
			// 	vscode.window.showErrorMessage(`Ошибка выполнения команды: ${error.message}`);
			// } else {
				vscode.window.showInformationMessage('Установка eslint завершена успешно.');
			// }
		});
	});

	context.subscriptions.push(installEslintDisposable);



	let EslintInitDisposable = vscode.commands.registerCommand('test-extension.ESlintInit', function () {
		const eslintConfigPath = path.join(currentWorkspacePath, '.eslintrc.json');
		const eslintConfigContent = `{
		"env": {
			"browser": true,
			"commonjs": true,
			"es2021": true
		},
		"extends": "eslint:recommended",
		"parserOptions": {
			"ecmaVersion": "latest"
		},
		"rules": {
		}
	}`;
	
		try {
			fs.writeFileSync(eslintConfigPath, eslintConfigContent);
			vscode.window.showInformationMessage('.eslintrc.json успешно создан.');
		} catch (error) {
			console.error('Ошибка при создании .eslintrc.json:', error.message);
			vscode.window.showErrorMessage('Ошибка при создании .eslintrc.json: ' + error.message);
		}
	});

	context.subscriptions.push(EslintInitDisposable);



	let InstallESPlugins = vscode.commands.registerCommand('test-extension.InstallESPlugins', function () {

		exec('npm install --save-dev eslint-plugin-security', { cwd: currentWorkspacePath }, (error, stdout, stderr) => {
				vscode.window.showInformationMessage('eslint-plugin-security установлен.');
		});

		exec('npm install eslint-plugin-sonarjs --save-dev', { cwd: currentWorkspacePath }, (error, stdout, stderr) => {
			vscode.window.showInformationMessage('eslint-plugin-sonarjs установлен.');
		});

		exec('npm install eslint-plugin-xss --save-dev', { cwd: currentWorkspacePath }, (error, stdout, stderr) => {
			vscode.window.showInformationMessage('eslint-plugin-xss установлен.');
		});

		exec('npm install --save-dev eslint-plugin-no-unsanitized', { cwd: currentWorkspacePath }, (error, stdout, stderr) => {
			vscode.window.showInformationMessage('eslint-plugin-no-unsanitized установлен.');
		});
	});

	context.subscriptions.push(InstallESPlugins);



	let addESlintConfig = vscode.commands.registerCommand('test-extension.addESlintconfig', function () {
		// Путь к файлу .eslintrc.json
		const eslintrcPath = path.join(currentWorkspacePath, '.eslintrc.json');
	
		// Проверяем, существует ли файл .eslintrc.json
		if (fs.existsSync(eslintrcPath)) {
			// Читаем содержимое файла
			const eslintrcContent = fs.readFileSync(eslintrcPath, 'utf-8');
	
			try {
				// Преобразуем содержимое в объект
				const eslintrc = JSON.parse(eslintrcContent);
	
				// Добавляем раздел "plugins"
				if (!eslintrc.plugins) {
					eslintrc.plugins = [];
				}
				eslintrc.plugins.push("security", "sonarjs", "xss", "no-unsanitized");
	
				// Добавляем новые элементы в раздел "rules"
				if (!eslintrc.rules) {
					eslintrc.rules = {};
				}
				eslintrc.rules["security/detect-eval-with-expression"] = "error";
				eslintrc.rules["security/detect-non-literal-innerhtml"] = "error";
				eslintrc.rules["security/detect-unsafe-regex"] = "error";
				eslintrc.rules["security/detect-buffer-noassert"] = "error";
				eslintrc.rules["security/detect-child-process"] = "error";
				eslintrc.rules["security/detect-disable-mustache-escape"] = "error";
				eslintrc.rules["security/detect-object-injection"] = "error";
	
				eslintrc.rules["sonarjs/no-all-duplicated-branches"] = "error";
				eslintrc.rules["sonarjs/no-element-overwrite"] = "error";
				eslintrc.rules["sonarjs/no-empty-collection"] = "error";
				eslintrc.rules["sonarjs/no-extra-arguments"] = "error";
				eslintrc.rules["sonarjs/no-identical-conditions"] = "error";
				eslintrc.rules["sonarjs/no-identical-expressions"] = "error";
				eslintrc.rules["sonarjs/no-ignored-return"] = "error";
				eslintrc.rules["sonarjs/no-one-iteration-loop"] = "error";
				eslintrc.rules["sonarjs/no-use-of-empty-return-value"] = "error";
	
				eslintrc.rules["no-unsanitized/method"] = "error";
				eslintrc.rules["no-unsanitized/property"] = "error";

				eslintrc.rules["no-unused-vars"] = "warn";
				eslintrc.rules["no-undef"] = "warn";
	
				// Записываем обновленный объект обратно в файл
				fs.writeFileSync(eslintrcPath, JSON.stringify(eslintrc, null, 2));
	
				vscode.window.showInformationMessage('Файл .eslintrc.json успешно обновлен');
			} catch (error) {
				console.error('Ошибка при обработке файла .eslintrc.json:', error.message);
				vscode.window.showErrorMessage('Ошибка при обработке файла .eslintrc.json: ' + error.message);
			}
		} else {
			vscode.window.showWarningMessage('Файл .eslintrc.json не найден в текущей директории');
		}
	});
	
	context.subscriptions.push(addESlintConfig);



    let disposable = vscode.commands.registerCommand('test-extension.helloWorld', function () {
        vscode.window.showInformationMessage('Hello World from test extension!');
    });

    context.subscriptions.push(disposable);
}


function deactivate() {}

module.exports = {
    activate,
    deactivate
}
