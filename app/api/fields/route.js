import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET() {
    try{
        const jsonDirectory = path.join(process.cwd(),"data");
        const fileContents = await fs.readFile(jsonDirectory+"/fields.json","utf8");
        const data= JSON.parse(fileContents)
        return NextResponse.json(data)
    }catch(error){
        console.error("error reading file",error)
        return NextResponse.json({error: "failed to read data  "+error})
    }
}