/** @format */

import { File } from "../core/File";
import { KeyValuePair } from "../core/KeyValuePair";
import { DeepL } from "./engines/DeepL/DeepL";
import * as fs from "fs";
import { Folder } from "../core/Folder";
import { ProjectManager } from "../core/ProjectManager";

export class Translator {
   public translate(i18nFile: File, i18nManifest: File) {
      const { defaultLanguage, languages } = this.readJSON(i18nManifest);
      const deepl = new DeepL();
      const projectManager = new ProjectManager();

      languages.forEach((language) => {
         const path = this.getLanguagePath(i18nFile.getPath(), language);
         if (this.exists(path)) {
            const KeyValuePairs = this.getKeyValuePairs(i18nFile.getPath());
            const ForeignKeyValuePairs = this.getKeyValuePairs(path);

            const keysToBeAdded = this.eliminateDuplicates(KeyValuePairs, ForeignKeyValuePairs);

            keysToBeAdded.forEach(async (keyValuePair) => {
               const newLine = new KeyValuePair(
                  keyValuePair.key,
                  await deepl.translate(
                     keyValuePair.value,
                     deepl.convertToSourceLanguage(defaultLanguage),
                     deepl.convertToTargetLanguage(language)
                  )
               );

               projectManager.writeFileData(path, newLine.key + "=" + newLine.value + "\n");
            });
         }
      });
   }

   private eliminateDuplicates(
      KeyValuePairs: KeyValuePair[],
      ForeignKeyValuePairs: KeyValuePair[]
   ) {
      ForeignKeyValuePairs.forEach((foreignKeyValuePair) => {
         KeyValuePairs.forEach((keyValuePair) => {
            if (keyValuePair.key === foreignKeyValuePair.key) {
               KeyValuePairs.splice(KeyValuePairs.indexOf(keyValuePair), 1);
            }
         });
      });

      return KeyValuePairs;
   }

   private readJSON(i18nManifest: File) {
      const defaultLanguage: string = JSON.parse(i18nManifest.getData()).defaultLanguage;
      const languages: string[] = JSON.parse(i18nManifest.getData()).languages;
      return { defaultLanguage, languages };
   }

   private exists(path: string): boolean {
      fs.stat(path, (err, stats) => {
         if (err) {
            fs.writeFile(path, "", (err) => {
               if (err) {
                  console.log(err);
                  return false;
               }
            });
            return true;
         }
      });
      return true;
   }

   private getLanguagePath(i18nFilePath: string, language: string) {
      const path = i18nFilePath.split("/");
      path.pop();
      path.push("i18n_" + language.replace("-", "_") + ".properties");
      return path.join("/");
   }

   private getKeyValuePairs(path: string) {
      const projectManager = new ProjectManager();
      const data = projectManager.readFileData(path);
      const KeyValuePairs: KeyValuePair[] = [];
      data.split("\n").map((line) => {
         if (line.includes("=")) {
            KeyValuePairs.push(new KeyValuePair(line.split("=")[0], line.split("=")[1]));
         }
      });

      KeyValuePairs.forEach((keyValuePair) => {
         if (keyValuePair.value.includes("\r")) {
            keyValuePair.value = keyValuePair.value.split("\r")[0];
         }
      });

      return KeyValuePairs;
   }
}
