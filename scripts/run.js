const fs = require("fs");
const os = require("os");
const path = require("path");
const { exec, execSync, spawn } = require("child_process");

const PORT = 5050;
const PATH_LIMIT = 1024;
const SPAWN_SHELL_DELAY = 1000;
const REWRITE_NGROK_URL_DELAY = 2000;
const NGROK_PATH = process.argv[2];
const systemType = os.platform();

const windowsShellOptions = {
  shell: process.env.ComSpec || "C:\\Windows\\system32\\cmd.exe",
};

function setNgrokPath() {
  if (!NGROK_PATH) return;

  const newPath = process.env.path + ";" + NGROK_PATH;

  if (newPath.length > PATH_LIMIT) {
    throw new Error(
      "Your path variable is over 1024 characters long. You will have to shorten it or add ngrok manually to your path."
    );
  } else {
    console.log("path changed");
    exec(`setx PATH "%PATH%;${NGROK_PATH}"`);
  }
}

function newTerminal(command) {
  const CWD = path.join(__dirname, "../");

  switch (systemType) {
    case "win32":
      // empty double quotes is intentional because of how the "start" Windows
      // command parameters work, setTimeout() used for Windows to prevent new
      // shells from opening too fast and skipping some commands
      setTimeout(() => {
        spawn(`start "" /d ${CWD} ${command}`, [], windowsShellOptions);
      }, SPAWN_SHELL_DELAY);
      break;
    case "darwin":
      execSync(`
      osascript -e 'tell application "Terminal" to activate' \
      -e 'tell application "System Events" to keystroke "t" using {command down}' \
      -e 'tell application "Terminal" to do script "cd ${CWD} && ${command}" in front window'
      `);
      break;
    default:
      console.log(
        "This dev script currently only supports Windows/unix at the moment."
      );
  }
}

// Make sure all instances of ngrok's process doesn't exist.
if (systemType === "win32") {
  setNgrokPath();
  spawn("Taskkill /IM ngrok.exe /F", [], windowsShellOptions);
} else if (systemType === "darwin") {
  exec("killall ngrok");
}
newTerminal(`ngrok http ${PORT}`);

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
        const FILE_PATH = "./packages/app/utils/constants.ts";
        fs.readFile(FILE_PATH, "utf-8", function (error, data) {
          if (error) throw error;
          const overwrite = data.replace(
            /\b(https:\/\/)\b.*\b(.ngrok-free.app)\b/,
            public_url
          );

          fs.writeFile(FILE_PATH, overwrite, "utf-8", function (error) {
            if (error) throw error;
            console.log("Successfully overwrite ngrok URL");
          });
        });
      }
    });

    newTerminal("yarn server:start");
    newTerminal("yarn app:start");
  });
}, REWRITE_NGROK_URL_DELAY);
