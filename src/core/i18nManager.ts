/** @format */

import * as vscode from "vscode";
import * as fs from "fs";
import { ProjectManager } from "./ProjectManager";
import { File } from "./File";
import { Folder } from "./Folder";
import { Translator } from "../translators/Translator";

export class i18nManager extends ProjectManager {
   private i18nKeys: string[];
   private i18nFile: File;
   private i18nFolder!: Folder;
   private webappFolder!: Folder;
   private textDocument!: File;
   private i18nManifest!: File;

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
      const i18nSnippets = this.textDocument.getData().split("i18n>");
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
      const pathArray = this.textDocument.getPath().split("/");
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

      fs.stat(this.i18nFolder.getPath(), (err, stats) => {
         if (err) {
            fs.mkdir(this.i18nFolder.getPath(), (err) => {
               if (err) {
                  vscode.window.showErrorMessage(err.message);
               }
            });
         }
      });
   }

   private initiate18nFolderInstance() {
      this.i18nFolder = new Folder(this.webappFolder.getPath() + "/i18n", this.webappFolder);
   }

   private getI18nProperties() {
      this.i18nFile.setPath(this.i18nFolder.getPath() + "/i18n.properties");
      fs.stat(this.i18nFile.getPath(), (err, stats) => {
         if (err) {
            this.createI18nProperties();
         }
      });
   }

   private createI18nProperties() {
      fs.writeFile(this.i18nFile.getPath(), "", (err) => {
         if (err) {
            vscode.window.showErrorMessage(err.message);
         }
      });
   }

   private appendKeys() {
      this.eliminateDuplicates();

      this.i18nKeys.forEach((key) => {
         fs.appendFile(
            this.i18nFile.getPath(),
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
      const fileData = super.readFileData(this.i18nFile.getPath());
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

   public translateI18nProperties() {
      this.getI18nManifest();

      const i18nTranslator = new Translator();
      i18nTranslator.translate(this.i18nFile, this.i18nManifest);
   }

   private getI18nManifest() {
      this.i18nManifest.setPath(this.i18nFolder.getPath() + "/i18n.json");
      fs.stat(this.i18nFile.getPath(), (err, stats) => {
         if (err) {
            this.i18nManifest = new File(
               "json",
               0,
               0,
               "",
               this.i18nFolder.getPath() + "/i18n.json"
            );

            this.i18nManifest.setData(
               JSON.stringify({
                  defaultLanguage: "en",
                  languages: ["en"]
               })
            );

            fs.writeFile(this.i18nManifest.getPath(), this.i18nManifest.getData(), (err) => {
               if (err) {
                  vscode.window.showErrorMessage(err.message);
               }
            });
         }
      });
   }
}
