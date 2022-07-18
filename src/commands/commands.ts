/** @format */

import * as vscode from "vscode";
import { I18nManager } from "../core/i18nManager";

const i18nExtension = vscode.commands.registerCommand("extension.i18nExtension", () => {
   vscode.commands.executeCommand("extension.activated");
   vscode.commands.executeCommand("extension.onSave");
});

vscode.commands.registerCommand("extension.activated", () => {
   vscode.window.showInformationMessage("i18n-Extension successfully activated!");
});

vscode.commands.registerCommand("extension.onSave", () => {
   vscode.workspace.onDidSaveTextDocument((textDocument) => {
      if (textDocument.languageId === "xml") {
         const I18nManagerInstance = new I18nManager();
         const { i18nFile, i18nFolder } = I18nManagerInstance.extractI18nKeys(textDocument);
         I18nManagerInstance.translateI18nProperties(i18nFile, i18nFolder);
      }
   });
});

export default i18nExtension;
