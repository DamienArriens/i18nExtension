/** @format */

import { File } from "./File";

export class Folder {
   private name: string;
   private files: File[];
   private folders: Folder[];
   private path: string;
   private parentFolder: Folder | null;

   constructor(path: string, parentFolder: Folder | null) {
      this.files = [];
      this.folders = [];
      this.path = path;
      this.name = path.split("/")[path.split("/").length - 1];
      this.parentFolder = parentFolder;
   }

   addFolder(folder: Folder) {
      this.folders.push(folder);
   }

   getFolder(name: string) {
      for (const folder of this.folders) {
         if (folder.getName() === name) {
            return folder;
         }
      }
      return null;
   }

   getFolders() {
      return this.folders;
   }

   getName() {
      return this.name;
   }

   setName(name: string) {
      this.name = name;
   }

   getPath() {
      return this.path;
   }

   setPath(path: string) {
      this.path = path;
   }

   getParentFolder() {
      return this.parentFolder;
   }

   setParentFolder(parentFolder: Folder) {
      this.parentFolder = parentFolder;
   }

   getFileCount() {
      return this.files.length;
   }

   getFolderCount() {
      return this.folders.length;
   }

   getFileList() {
      return this.files;
   }

   getFileListRecursive() {
      let fileList: File[] = [];
      for (const folder of this.folders) {
         fileList = fileList.concat(folder.getFileListRecursive());
      }
      fileList = fileList.concat(this.files);
      return fileList;
   }

   getFolderListRecursive() {
      let folderList: Folder[] = [];
      for (const folder of this.folders) {
         folderList = folderList.concat(folder.getFolderListRecursive());
      }
      folderList = folderList.concat(this.folders);
      return folderList;
   }

   getFolderList() {
      return this.folders;
   }

   addFile(file: File) {
      this.files.push(file);
   }

   getFile(name: string) {
      return this.files.find((file) => file.getName() === name);
   }

   getFiles() {
      return this.files;
   }

   removeFile(file: File) {
      this.files = this.files.filter((f) => f !== file);
   }

   removeFolder(folder: Folder) {
      this.folders = this.folders.filter((f) => f !== folder);
   }

   removeAllFiles() {
      this.files = [];
   }

   removeAllFolders() {
      this.folders = [];
   }

   removeAll() {
      this.removeAllFiles();
      this.removeAllFolders();
   }

   removeAllRecursive() {
      this.removeAll();
      for (const folder of this.folders) {
         folder.removeAllRecursive();
      }
   }

   removeAllRecursiveExceptFolder(folder: Folder) {
      this.removeAllRecursive();
      this.folders = [folder];
   }

   removeAllRecursiveExceptFile(file: File) {
      this.removeAllRecursive();
      this.files = [file];
   }
}
