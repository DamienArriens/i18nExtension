/** @format */

import * as vscode from "vscode";
import * as fs from "fs";
import { ProjectManager } from "./ProjectManager";
import { File } from "./File";
import { Folder } from "./Folder";
import { Translator } from "../translators/Translator";

export class I18nManager extends ProjectManager {
   constructor() {
      super();
   }

   public extractI18nKeys(textDocument: vscode.TextDocument) {
      const xmlDocument = this.initiateTextDocument(textDocument);

      const i18nKeys = this.getI18nKeys(xmlDocument);
      const { i18nFile, i18nFolder } = this.initiateFiles(xmlDocument);
      this.appendKeys(i18nKeys, i18nFile);

      return { i18nFile, i18nFolder };
   }

   private initiateTextDocument(textDocument: vscode.TextDocument) {
      return new File(
         textDocument.languageId,
         textDocument.getText().length,
         textDocument.lineCount,
         textDocument.getText(),
         textDocument.uri.path
      );
   }

   private getI18nKeys(textDocument: File) {
      const i18nSnippets = textDocument.getData().split("i18n>");
      i18nSnippets.splice(0, 1);
      const i18nKeys = i18nSnippets.map((snippet) => {
         return this.trimString(snippet, "}");
      });

      return this.createUniqueValues(i18nKeys);
   }

   private initiateFiles(xmlDocument: File) {
      const webappFolder = this.findWebappFolder(xmlDocument);
      const i18nFolder = this.createI18nFolder(webappFolder);
      const i18nFile = this.getI18nFile(i18nFolder);
      return { i18nFile, i18nFolder };
   }

   private findWebappFolder(xmlDocument: File) {
      const pathArray = xmlDocument.getPath().split("/");
      if (pathArray[pathArray.length - 2] != "view") {
         pathArray.splice(pathArray.length - 1, 1);
      }
      pathArray.splice(pathArray.length - 2, 2);
      return new Folder(pathArray.join("/"), null);
   }

   private createI18nFolder(webappFolder: Folder) {
      const i18nFolder = this.initiate18nFolderInstance(webappFolder);

      fs.stat(i18nFolder.getPath(), (err, stats) => {
         if (err) {
            fs.mkdir(i18nFolder.getPath(), (err) => {
               if (err) {
                  vscode.window.showErrorMessage(err.message);
               }
            });
         }
      });

      return i18nFolder;
   }

   private initiate18nFolderInstance(webappFolder: Folder) {
      return new Folder(webappFolder.getPath() + "/i18n", webappFolder);
   }

   private getI18nFile(i18nFolder: Folder) {
      const i18nFile = new File("properties", 0, 0, "", i18nFolder.getPath() + "/i18n.properties");
      fs.stat(i18nFile.getPath(), (err, stats) => {
         if (err) {
            this.createI18nFile(i18nFile);
         }
      });

      return i18nFile;
   }

   private createI18nFile(i18nFile: File) {
      fs.writeFile(i18nFile.getPath(), "", (err) => {
         if (err) {
            vscode.window.showErrorMessage(err.message);
         }
      });
   }

   private appendKeys(i18nKeys: string[], i18nFile: File) {
      i18nKeys = this.eliminateDuplicates(i18nKeys, i18nFile);

      i18nKeys.forEach((key) => {
         fs.appendFile(
            i18nFile.getPath(),
            `\n${key}=${key.charAt(0).toUpperCase() + key.replace(/([A-Z])/g, " $1").slice(1)}`,
            (err) => {
               if (err) {
                  vscode.window.showErrorMessage(err.message);
               }
            }
         );
      });
   }

   private eliminateDuplicates(i18nKeys: string[], i18nFile: File) {
      const fileData = i18nFile.getData();
      const lines = this.splitInLines(fileData);

      const i18nFileKeys = this.extractKeys(lines);

      i18nFileKeys.forEach((i18nFileKey) => {
         i18nKeys.forEach((key) => {
            if (i18nFileKey === key) {
               i18nKeys.splice(i18nKeys.indexOf(key), 1);
            }
         });
      });

      return i18nKeys;
   }

   private splitInLines(data: string) {
      const lines = data.split("\n");
      lines.forEach((line) => {
         if (line === "") {
            lines.splice(lines.indexOf(line), 1);
         }
      });

      return lines;
   }

   private extractKeys(lines: string[]) {
      const i18nFileKeys: string[] = [];
      lines.forEach((line) => {
         i18nFileKeys.push(line.split("=")[0]);
      });

      return i18nFileKeys;
   }

   public translateI18nProperties(i18nFile: File, i18nFolder: Folder) {
      const i18nManifest = this.getI18nManifest(i18nFolder);

      const i18nTranslator = new Translator();
      i18nTranslator.translate(i18nFile, i18nManifest);
   }

   private getI18nManifest(i18nFolder: Folder) {
      const i18nManifest = new File("json", 0, 0, "", i18nFolder.getPath() + "/i18n.json");
      fs.stat(i18nManifest.getPath(), (err, stats) => {
         if (err) {
            i18nManifest.setData(
               JSON.stringify({
                  defaultLanguage: "en",
                  languages: ["en-GB"]
               })
            );

            fs.writeFile(i18nManifest.getPath(), i18nManifest.getData(), (err) => {
               if (err) {
                  vscode.window.showErrorMessage(err.message);
               }
            });
         }
      });

      i18nManifest.getData();

      return i18nManifest;
   }
}
