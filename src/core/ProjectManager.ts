/** @format */

import * as vscode from "vscode";
import * as fs from "fs";
import { Folder } from "./Folder";

export class ProjectManager {
   public _rootFolder: Folder | undefined;

   constructor() {
      if (vscode.workspace.workspaceFolders !== undefined) {
         this._rootFolder = new Folder(vscode.workspace.workspaceFolders[0].name, null);
      } else {
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

   public readFile(path: string) {
      // TODO
   }
}
