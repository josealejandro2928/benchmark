
const { fork, spawn } = require('child_process');
const readline = require('readline');

function readInput(question, validation = () => true) {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(question, (ans) => {
            if (validation(ans)) {
                rl.close();
                resolve(ans);
            } else {
                reject(false);
                rl.close();
            }
        })
    })
}

async function getValidInput(question, validation = () => true, iter = 5) {
    for (let i = 0; i < iter; i++) {
        try {
            let res = await readInput(question, validation)
            return res;
        } catch (e) {
            console.log("Invalid input, try again");
        }
    }
    throw new Error("You reach the maximun amount of trials");
}

function executeTest(serverPath, command, onData = () => { }, onEnd = () => { }) {
    const controller = new AbortController();
    const { signal } = controller;
    let serverNodeInstance = fork(serverPath, { signal })
    serverNodeInstance.on("error", (error) => {
        if (!(error.message == "The operation was aborted"))
            console.log("Error in running server: ", error);
        serverNodeInstance.removeAllListeners();
        serverNodeInstance.kill();
    })

    serverNodeInstance.on("exit", (code) => {
        console.log("Server exit with code: ", code);
    })

    setTimeout(async () => {
        const [comm, args] = command
        const spawnnedCommand = spawn(comm, args, { signal });
        if (comm == "ab") {
            spawnnedCommand.on("error", (error) => {
                console.log("🚀 ~ file: utils.js:59 ~ spawnnedCommand.on ~ error", error)
                if (!(error.message == "The operation was aborted"))
                    console.log("Error in spannedCommand", error)
                spawnnedCommand.removeAllListeners();
                spawnnedCommand.kill();
            })

            spawnnedCommand.stdout.on("data", (data) => {
                onData(data);
            })

            spawnnedCommand.on("exit", (code) => {
                console.log("spawnnedCommand exit with code: ", code);
                onEnd(code);
                controller.abort();
            })
        }
        if (comm == "autocannon") {
            const autocannon = require('autocannon')
            let res = await autocannon({
                url: 'http://localhost:3000/',
                ...args
              
            })
            console.log(autocannon.printResult(res))
            let newObj = {
                "latency": {
                    average: res["latency"]["average"] + " ms",
                    mean: res["latency"]["mean"] + " ms",
                    stddev: res["latency"]["stddev"] + " ms",
                    min: res["latency"]["min"] + " ms",
                    max: res["latency"]["max"] + " ms",
                },
                "requests": {
                    average: res["requests"]["average"] + " #/seg",
                    mean: res["requests"]["mean"] + " #/seg",
                    stddev: res["requests"]["stddev"] + " #/seg",
                    min: res["requests"]["min"] + " #/seg",
                    max: res["requests"]["max"] + " #/seg",
                }
            }
            onData(JSON.stringify(newObj, null, 2));
            onEnd(0)
        }


    }, 1000)

    process.on("exit", () => {
        controller.abort();
    })

}

function generateRouteRandom(root = "api", length = 3) {
    function generateWord() {
        let a = Math.floor(Math.random() * 100000000)
        let b = Date.now();
        let res = a + b;
        return res.toString(16).slice(5);
    }
    let res = [root];
    for (let i = 0; i < length; i++) {
        res.push(generateWord());
    }
    return "/" + res.join("/") + "/"
}

module.exports = {
    generateRouteRandom,
    readInput,
    executeTest,
    getValidInput
}