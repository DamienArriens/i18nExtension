/** @format */

import { File } from "./File";

export class Folder {
   name: string | null;
   files: File[];
   folders: Folder[];
   path: string | null;
   parentFolder: Folder | null;

   constructor(path: string | null, parentFolder: Folder | null) {
      this.files = [];
      this.folders = [];
      if (path) {
         this.path = path;
         this.name = path.split("/")[path.split("/").length - 1];
      } else {
         this.path = null;
         this.name = null;
      }
      this.parentFolder = parentFolder;
   }

   addFile(file: File) {
      this.files.push(file);
   }
   getFile(name: string) {
      return this.files.find((file) => file.name === name);
   }
   getFiles() {
      return this.files;
   }
}
