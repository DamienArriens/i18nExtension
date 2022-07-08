/** @format */

import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
   console.log("Extension activated");

   const disposable = vscode.commands.registerCommand("extension.i18nExtension", () => {
      vscode.window.showErrorMessage("I don't know what I am doing!");
   });

   context.subscriptions.push(disposable);
}
