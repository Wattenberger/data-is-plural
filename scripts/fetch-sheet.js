import fs from "fs"
import request from "request"
import d3 from "d3"

const CWD = process.cwd();
const CONFIG_PATH = `${CWD}/scripts/config.json`;
const CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
const { sheet } = CONFIG.google;

const makeRequest = (opt, cb) => {
  const base = "https://docs.google.com/spreadsheets/u/1/d";
  const url = `${base}/${opt.id}/export?format=csv&id=${opt.id}&gid=${
    opt.gid || 0
  }`;
  console.log(url);
  request(url, (error, response, body) => {
    if (error) console.log(error);
    else if (response) {
      const file = `${CWD}/${opt.filepath || "data/sheet.js"}`;
      const data = d3.csvParse(body);
      const content = `export default ${JSON.stringify(data)}`;
      fs.writeFile(file, content, (err) => {
        if (err) console.error(err);
        cb();
      });
    }
  });
};

function init() {
  let i = 0;
  const next = () => {
    const d = sheet[i];
    if (d.id)
      makeRequest(d, () => {
        i += 1;
        if (i < sheet.length) next();
        else process.exit();
      });
  };

  next();
}

init();
