/** @format */

import * as vscode from "vscode";
import { i18nManager } from "../core/i18nManager";

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
         const I18nManager = new i18nManager();
         I18nManager.extractI18nKeys(textDocument);
         I18nManager.translateI18nProperties();
      }
   });
});

export default i18nExtension;
