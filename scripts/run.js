const fs = require("fs");
const os = require("os");
const { exec } = require("child_process");
const PORT = 5050;

const systemType = os.platform();

if ((systemType !== "linux") && systemType !== "darwin") {
  console.log("This command currently only supports linux or unix at the moment.");
  return;
}

exec("killall ngrok");
exec(`ttab ngrok http ${PORT}`);

setTimeout(() => {
  exec("curl http://127.0.0.1:4040/api/tunnels", (error, stdout) => {
    const ngrok = JSON.parse(stdout);
    const { tunnels } = ngrok;
    const { public_url } = tunnels[0];
    console.log(public_url);
    fs.access("./packages/app/utils/", (error) => {
      if (error) {
        throw error;
      } else {
        const FILE_PATH = "./packages/app/utils/constants.js";
        fs.readFile(FILE_PATH, "utf-8", function(error, data) {
          if (error) throw error;
          const overwrite = data.replace(/\b(https:\/\/)\b.*\b(.ngrok.io)\b/, public_url);

          fs.writeFile(FILE_PATH, overwrite, "utf-8", function(error) {
            if (error) throw error;
            console.log("Successfully overwrite ngrok URL");
          });
        });
      }
    })
  });
}, 3000);

exec("ttab yarn server:start");
exec("ttab yarn app:start");