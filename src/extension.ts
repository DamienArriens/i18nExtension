/** @format */

import * as vscode from "vscode";
import * as commands from "./commands/commands";

export function activate(context: vscode.ExtensionContext) {
   context.subscriptions.push(commands.default);
   vscode.commands.executeCommand("extension.i18nExtension");
}

export function deactivate() {
   console.log("i18nExtension deactivated!");
}
