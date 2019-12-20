import path from "path";
import ffi from "ffi-napi";
import fs from "fs";

const RL_LIB = "libreadline";
const HISTORY_FILE = path.join(process.env.HOME, ".mal-history");

const rllib = ffi.Library(RL_LIB, {
  readline: ["string", ["stirng"]],
  add_history: ["int", ["string"]]
})

let rl_history_loaded = false;

export function readline(prompt) {
  prompt = prompt || "user> ";

  if(!rl_history_loaded) {
    rl_history_loaded = true;
    let lines = [];

    if(fs.existsSync(HISTORY_FILE)) {
      lines =  fs.readFileSync(HISTORY_FILE).toString().split("\n");
    }

    // max of 2000 lines
    lines = lines.slice(Math.max(lines.length - 2000, 0));
    for (let i = 0; i<lines.length;i++) {
      if(lines[i]) {
        rllib.add_history(lines[i]);
      }
    }

    const line = rllib.readline(prompt);
    if(line) {
      rllib.add_history(line);
      try {
        fs.appendFileSync(HISTORY_FILE, line + "\n");
      } catch(e) {
        console.error(e);
      }
    }
  }

  return line;
}

