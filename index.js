
const chalk = require("chalk");
const { executeTest, getValidInput } = require('./utils');
const path = require("node:path");
const fs = require("node:fs");

let serversPath = ["./servers/index-mini-express-server.js", "./servers/index-express.js", "./servers/index-fastify.js", "./servers/index-koa.js"]
let librariesName = ["mini-express-server.js", "express.js", "fastify.js", "koa.js"]
let comands = [["ab", ["-c 500", "-n 10000", "http://127.0.0.1:3000/"]], ["autocannon", { connections: 100, pipelining: 10, duration: 10 }]]

async function main() {
    let output = "";
    while (true) {
        console.log(chalk.yellow("This script will execute benchmark using autocannon or Apache Server Benchmarking Tool\n"))
        console.log("These are the list libraries:")
        console.log("\t1- mini-express-server");
        console.log("\t2- express");
        console.log("\t3- fastify");
        console.log("\t4- koa");

        console.log("\nThese are the possible tests:")
        comands.forEach((co, index) => console.log("\t", index + 1 + "-", co))
        let options = {
            library: 0,
            testType: 0
        }
        options.library = await getValidInput("\nSelect the library to test: [1-4]: ", (ans) => {
            if (isNaN(parseInt(ans))) return false;
            ans = parseInt(ans);
            if (ans < 1 || ans > 5) return false;
            return true;
        });

        options.testType = await getValidInput("\nSelect the test type: [1-2]: ", (ans) => {
            if (isNaN(parseInt(ans))) return false;
            ans = parseInt(ans);
            if (ans < 1 || ans > 2) return false;
            return true;
        });

        console.log(`\nPerformin test: ${chalk.yellow(comands[options.testType - 1][0])} on library ${chalk.blue(librariesName[options.library - 1])}\n`)
        output = `Test performed on: ${new Date()}\nlibrary: ${librariesName[options.library - 1]}\ncommand: ${comands[options.testType - 1]}\n\n`

        executeTest(serversPath[options.library - 1], comands[options.testType - 1],
            (message) => {
                const msg = message.toString();
                console.log(msg);
                output += msg
            },
            (code) => {
                if (code == 0) {
                    console.log(chalk.green('Process finish successfully, writting result'))
                    if (options.testType == 1) {
                        fs.writeFileSync(path.join(".", "results", "ab", librariesName[options.library - 1] + ".txt"), output, { encoding: "utf-8" });
                        process.exit(0);
                    }
                    if (options.testType == 2) {
                        fs.writeFileSync(path.join(".", "results", "autocannon", librariesName[options.library - 1] + ".txt"), output, { encoding: "utf-8" });
                        process.exit(0);
                    }
                } else {
                    console.log(chalk.red('Process finish with error'))
                }
            });
        break;
    }
}

main();
