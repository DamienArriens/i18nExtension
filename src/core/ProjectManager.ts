/** @format */

import * as vscode from "vscode";
import * as fs from "fs";
import { Folder } from "./Folder";

export class ProjectManager {
   public _rootFolder: Folder | undefined;
   public _projectFolder!: Folder;

   constructor() {
      if (vscode.workspace.workspaceFolders !== undefined) {
         this._rootFolder = new Folder(vscode.workspace.workspaceFolders[0].name, null);
      } else {
         vscode.window.showWarningMessage("No workspace found!");
         this._rootFolder = undefined;
      }
   }

   public getRootFolder() {
      if (this._rootFolder !== undefined) {
         return this._rootFolder;
      }
      return vscode.window.showInformationMessage("No workspace found!");
   }

   public readFileData(path: string) {
      return fs.readFileSync(path, "utf8");
   }

   public writeFileData(path: string, data: string) {
      fs.appendFile(path, data, (err) => {
         if (err) {
            vscode.window.showErrorMessage(err.message);
         }
      });
   }

   public readFile(path: string) {
      // TODO
   }

   public createUniqueValues(array: string[]) {
      return array.filter((key, index) => {
         return array.indexOf(key) === index;
      });
   }

   public trimString(str: string, char: string) {
      return str.substring(0, str.indexOf(char));
   }
}
