/** @format */

export class File {
   private name: string;
   private type: string;
   private characterCount: number;
   private lineCount: number;
   private data: string;
   private path: string;

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

   public getName(): string {
      return this.name;
   }

   public getType(): string {
      return this.type;
   }

   public getCharacterCount(): number {
      return this.characterCount;
   }

   public getLineCount(): number {
      return this.lineCount;
   }

   public getData(): string {
      return this.data;
   }

   public getPath(): string {
      return this.path;
   }

   public setData(data: string): void {
      this.data = data;
   }

   public setPath(path: string): void {
      this.path = path;
   }

   public setName(name: string): void {
      this.name = name;
   }

   public setType(type: string): void {
      this.type = type;
   }

   public setCharacterCount(characterCount: number): void {
      this.characterCount = characterCount;
   }

   public setLineCount(lineCount: number): void {
      this.lineCount = lineCount;
   }
}
