/** @format */

import * as vscode from "vscode";
import * as fs from "fs";
import { SWANProjectManager } from "./SWANProjectManager/SWANProjectManager";
import { File } from "./SWANProjectManager/File";
import { Folder } from "./SWANProjectManager/Folder";

export class i18nManager extends SWANProjectManager {
   i18nKeys: string[];
   i18nFile: File;
   i18nFolder!: Folder;
   webappFolder!: Folder;
   textDocument!: File;

   constructor() {
      super();
      this.i18nKeys = [];
      this.i18nFile = new File("properties", 0, 0, "", "i18n.properties");
   }

   public extractI18nKeys(textDocument: vscode.TextDocument) {
      this.initiateTextDocument(textDocument);
      this.getI18nKeys();
      this.initiateFiles();
      this.appendKeys();
   }

   private initiateTextDocument(textDocument: vscode.TextDocument) {
      this.textDocument = new File(
         textDocument.languageId,
         textDocument.getText().length,
         textDocument.lineCount,
         textDocument.getText(),
         textDocument.uri.path
      );
   }

   private getI18nKeys() {
      const i18nSnippets = this.textDocument.data.split("i18n>");
      i18nSnippets.splice(0, 1);
      this.i18nKeys = i18nSnippets.map((snippet) => {
         return this.trimString(snippet, "}");
      });

      this.createUniqueKeys();
   }

   private trimString(str: string, char: string) {
      return str.substring(0, str.indexOf(char));
   }

   private createUniqueKeys() {
      this.i18nKeys = this.i18nKeys.filter((key, index) => {
         return this.i18nKeys.indexOf(key) === index;
      });
   }

   private initiateFiles() {
      this.findWebappFolder();
      this.createI18nFolder();
      this.getI18nProperties();
   }

   private findWebappFolder() {
      const pathArray = this.textDocument.path.split("/");
      if (pathArray[pathArray.length - 2] != "view") {
         pathArray.splice(pathArray.length - 1, 1);
      }
      pathArray.splice(pathArray.length - 2, 2);
      this.initiateWebappFolder(pathArray.join("/"));
   }

   private initiateWebappFolder(path: string) {
      this.webappFolder = new Folder(path, null);
   }

   private createI18nFolder() {
      this.initiate18nFolderInstance();
      if (this.i18nFolder.path) {
         fs.stat(this.i18nFolder.path, (err, stats) => {
            if (err && this.i18nFolder.path) {
               fs.mkdir(this.i18nFolder.path, (err) => {
                  if (err) {
                     vscode.window.showErrorMessage(err.message);
                  }
               });
            }
         });
      }
   }

   private initiate18nFolderInstance() {
      this.i18nFolder = new Folder(this.webappFolder.path + "/i18", this.webappFolder);
   }

   private getI18nProperties() {
      this.i18nFile.path = this.i18nFolder.path + "/i18n.properties";
      fs.stat(this.i18nFile.path, (err, stats) => {
         if (err) {
            this.createI18nProperties();
         }
      });
   }

   private createI18nProperties() {
      fs.writeFile(this.i18nFile.path, "", (err) => {
         if (err) {
            vscode.window.showErrorMessage(err.message);
         }
      });
   }

   private appendKeys() {
      this.eliminateDuplicates();

      this.i18nKeys.forEach((key) => {
         fs.appendFile(
            this.i18nFile.path,
            `\n${key}=${key.charAt(0).toUpperCase() + key.replace(/([A-Z])/g, " $1").slice(1)}`,
            (err) => {
               if (err) {
                  vscode.window.showErrorMessage(err.message);
               }
            }
         );
      });
   }

   private eliminateDuplicates() {
      const fileData = this.readFileData(this.i18nFile.path);
      const lines = this.splitInLines(fileData);

      const i18nFileKeys = this.extractKeys(lines);

      i18nFileKeys.forEach((i18nFileKey) => {
         this.i18nKeys.forEach((key) => {
            if (i18nFileKey === key) {
               this.i18nKeys.splice(this.i18nKeys.indexOf(key), 1);
            }
         });
      });
   }

   private readFileData(path: string) {
      return fs.readFileSync(path, "utf8");
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
}
