var intervalId
var intervalStart

function listen() {
    document.addEventListener("click", (e) => {

        function scroll(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "scroll",
            })
        }

        function stopScrolling(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "stop",
            })
        }

        function remove(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "remove",
            })
        }

        function reportError(error) {
            console.error(`Could not execute: ${error}`)
        }

        if (e.target.textContent.substring(0, 4) === "Auto") {
            browser.tabs.query({ active: true, currentWindow: true })
                .then(scroll)
                .catch(reportError)

            intervalStart = Date.now() / 1000

            intervalId = window.setInterval(function () {
                e.target.textContent = "Stop " +
                    (10 - parseInt((Date.now() / 1000 - intervalStart).toString()[0])) +
                    " seconds left"
            }, 1000)

            window.setTimeout(function () {
                window.clearInterval(intervalId)
                e.target.textContent = "Auto scroll (10s)"
            }, 10000)
        }
        else if (e.target.textContent.substring(0, 4) === "Stop") {
            window.clearInterval(intervalId)
            e.target.textContent = "Auto scroll (10s)"

            browser.tabs.query({ active: true, currentWindow: true })
                .then(stopScrolling)
                .catch(reportError)
        }
        else if (e.target.textContent === "Remove spam") {
            browser.tabs.query({ active: true, currentWindow: true })
                .then(remove)
                .catch(reportError)
        }
    })
}

function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden")
    document.querySelector("#error-content").classList.remove("hidden")
    console.error(`Failed to execute content script: ${error.message}`)
}

browser.tabs.executeScript({ file: "no2.js" })
    .then(listen)
    .catch(reportExecuteScriptError)