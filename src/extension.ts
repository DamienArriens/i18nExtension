/** @format */

import * as vscode from "vscode";
import { i18nManager } from "./i18nManager";

export function activate(context: vscode.ExtensionContext) {
   const I18nManager = new i18nManager();

   const i18nExtension = vscode.commands.registerCommand("extension.i18nExtension", () => {
      vscode.commands.executeCommand("extension.activated");
      vscode.commands.executeCommand("extension.onSave");
   });

   vscode.commands.registerCommand("extension.activated", () => {
      vscode.window.showInformationMessage("i18nExtension successfully activated!");
   });

   vscode.commands.registerCommand("extension.onSave", () => {
      vscode.workspace.onDidSaveTextDocument((textDocument) => {
         if (textDocument.languageId === "xml") {
            I18nManager.extractI18nKeys(textDocument);
         }
      });
   });

   context.subscriptions.push(i18nExtension);

   vscode.commands.executeCommand("extension.i18nExtension");
}

export function deactivate() {
   console.log("i18nExtension deactivated!");
}
