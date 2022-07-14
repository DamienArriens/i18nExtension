/** @format */

export class File {
   name: string;
   type: string;
   characterCount: number;
   lineCount: number;
   data: string;
   path: string;

   constructor(
      type: string,
      characterCount: number,
      lineCount: number,
      data: string,
      path: string
   ) {
      this.type = type;
      this.characterCount = characterCount;
      this.lineCount = lineCount;
      this.data = data;
      const pathList = path.split("/");
      if (pathList.length > 1) pathList.splice(0, 1);
      this.path = pathList.join("/");
      this.name = this.path.split("/")[this.path.split("/").length - 1];
   }
}
