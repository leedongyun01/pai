import { SqliteSaver } from "@langchain/langgraph-checkpoint-sqlite";
import Database from "better-sqlite3";
import { config } from "@/lib/config";
import path from "path";
import fs from "fs";

// Ensure the directory for the database exists
const dbPath = config.DATABASE_URL.replace('file:', '');
const dbDir = path.dirname(path.resolve(dbPath));

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let checkpointer: SqliteSaver | null = null;

export function getCheckpointer() {
  if (!checkpointer) {
    const db = new Database(dbPath);
    checkpointer = new SqliteSaver(db);
  }
  return checkpointer;
}