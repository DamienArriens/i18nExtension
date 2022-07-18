/** @format */

import * as deepl from "deepl-node";
import { SourceLanguage } from "./sourceLanguage";
import { TargetLanguage } from "./targetLanguage";

export class DeepL {
   async translate(text: string, from: deepl.SourceLanguageCode, to: deepl.TargetLanguageCode) {
      const key = "ae0ff787-68e0-1e31-d511-b962769dc9aa:fx";
      const translator = new deepl.Translator(key);

      const result = await translator.translateText(text, from, to);
      return result.text;
   }

   convertToSourceLanguage(language: string): deepl.SourceLanguageCode {
      switch (language) {
         case "bg":
            return "bg";
         case "cs":
            return "cs";
         case "da":
            return "da";
         case "de":
            return "de";
         case "el":
            return "el";
         case "en":
            return "en";
         case "es":
            return "es";
         case "et":
            return "et";
         case "fi":
            return "fi";
         case "fr":
            return "fr";
         case "hu":
            return "hu";
         case "id":
            return "id";
         case "it":
            return "it";
         case "ja":
            return "ja";
         case "nl":
            return "nl";
         case "pl":
            return "pl";
         case "pt":
            return "pt";
         case "ro":
            return "ro";
         case "ru":
            return "ru";
         case "sk":
            return "sk";
         case "sl":
            return "sl";
         case "sv":
            return "sv";
         case "tr":
            return "tr";
         case "zh":
            return "zh";
         default:
            return "en";
      }
   }

   convertToTargetLanguage(language: string): deepl.TargetLanguageCode {
      switch (language) {
         case "cs":
            return "cs";
         case "da":
            return "da";
         case "de":
            return "de";
         case "el":
            return "el";
         case "en-gb":
            return "en-GB";
         case "en-us":
            return "en-US";
         case "es":
            return "es";
         case "et":
            return "et";
         case "fi":
            return "fi";
         case "fr":
            return "fr";
         case "hu":
            return "hu";
         case "id":
            return "id";
         case "it":
            return "it";
         case "ja":
            return "ja";
         case "lt":
            return "lt";
         case "lv":
            return "lv";
         case "nl":
            return "nl";
         case "pl":
            return "pl";
         case "pt-pt":
            return "pt-PT";
         case "pt-br":
            return "pt-BR";
         case "ro":
            return "ro";
         case "ru":
            return "ru";
         case "sk":
            return "sk";
         case "sl":
            return "sl";
         case "sv":
            return "sv";
         case "tr":
            return "tr";
         case "zh":
            return "zh";
         default:
            return "en-GB";
      }
   }
}
