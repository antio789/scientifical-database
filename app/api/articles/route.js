import path from "path";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";

  export async function GET() {
    const jsonDirectory = path.join(process.cwd(), "data");
    try{
    const fileContents = await fs.readFile(jsonDirectory + "/biogasTechnology.json", "utf8");
    const articles = JSON.parse(fileContents);
    return NextResponse.json(articles);
    }catch(error){
      console.error('not working',error);
      return NextResponse.json(fileContents)
    }
}