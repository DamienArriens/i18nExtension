/** @format */

import * as vscode from "vscode";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
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
            const i18nKeys = getI18nKeys(textDocument);
            const oPromise = initiateFiles(textDocument);
            appendKeys(i18nKeys, oPromise.file);
         }
      });
   });

   context.subscriptions.push(i18nExtension);

   vscode.commands.executeCommand("extension.i18nExtension");
}

export function deactivate() {
   console.log("Deactivated");
}

function trimString(str: string, char: string) {
   return str.substring(0, str.indexOf(char));
}

function getI18nKeys(xmlFile: vscode.TextDocument) {
   const xmlContent = xmlFile.getText();
   const i18nSnippets = xmlContent.split("i18n>");
   i18nSnippets.splice(0, 1);
   const i18nKeys = i18nSnippets.map((snippet) => {
      return trimString(snippet, "}");
   });

   // Eliminate duplicate keys
   const i18nKeysUnique = i18nKeys.filter((key, index) => {
      return i18nKeys.indexOf(key) === index;
   });
   return i18nKeysUnique;
}

function initiateFiles(textDocument: vscode.TextDocument) {
   const webappFolder = getWebappFolder(textDocument);
   const i18nFolder = getI18nFolder(webappFolder);
   const oPromise = getI18nProperties(i18nFolder);

   return oPromise;
}

function getWebappFolder(textDocument: vscode.TextDocument) {
   const path = textDocument.uri.path.split("/");
   if (path[path.length - 2] != "view") {
      path.splice(path.length - 1, 1);
   }
   path.splice(path.length - 2, 2);
   path.splice(0, 1);
   const webappFolder = path.join("/");

   return webappFolder;
}

function getI18nFolder(webappFolder: string) {
   const i18nFolder = webappFolder + "/i18";
   fs.stat(i18nFolder, (err, stats) => {
      if (err) {
         fs.mkdir(i18nFolder, (err) => {
            if (err) {
               vscode.window.showErrorMessage(err.message);
            }
         });
      }
   });

   return i18nFolder;
}

function getI18nProperties(i18nFolder: string) {
   const i18nProperties = i18nFolder + "/i18n.properties";
   fs.stat(i18nProperties, (err, stats) => {
      if (err) {
         fs.writeFile(i18nProperties, "", (err) => {
            if (err) {
               vscode.window.showErrorMessage(err.message);
            }
         });
         return { type: "Initialization", file: i18nProperties };
      }
   });
   return { type: "Existing", file: i18nProperties };
}

function appendKeys(i18nKeys: string[], i18nProperties: string) {
   const fileData = fs.readFileSync(i18nProperties, "utf8");
   const lines = fileData.split("\n");
   const i18nFileKeys: string[] = [];
   lines.forEach((line) => {
      i18nFileKeys.push(line.split("=")[0]);
   });
   i18nKeys.forEach((key) => {
      i18nFileKeys.forEach((i18nFileKey) => {
         if (i18nFileKey === key) {
            i18nKeys.splice(i18nKeys.indexOf(key) - 1, 1);
         }
      });
   });

   i18nKeys.forEach((key) => {
      fs.appendFile(
         i18nProperties,
         `\n${key}=${key.charAt(0).toUpperCase() + key.replace(/([A-Z])/g, " $1").slice(1)}`,
         (err) => {
            if (err) {
               vscode.window.showErrorMessage(err.message);
            }
         }
      );
   });
}
