var intervalId
(function () {
    if (window.hasRun) {
        return
    }
    window.hasRun = true

    function scroll() {
        var lastScrollHeight = 0
        
        intervalId = window.setInterval(function () {
            var sh = document.documentElement.scrollHeight
            if (sh != lastScrollHeight) {
                lastScrollHeight = sh
                document.documentElement.scrollTop = sh
            }
        }, 200)

        window.setTimeout(function () {
            window.clearInterval(intervalId)
        }, 10000)
    }

    function stopScrolling() {
        window.clearInterval(intervalId)
    }

    function remove() {
        $('div.stream-item__info').each(function () {
            if ($(this).find('div.stream-item__senders').text().includes('/o2') ||
                $(this).find('.stream-item__segregatorName.commerce').length != 0)
                $(this).find('div.stream-item__select')[0].click()
        })
        $(`button.list-stream-actions__Button[data-sel-elem='listing_delete_button']`).click()
    }

    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "scroll") {
            scroll()
        } else if (message.command === "stop") {
            stopScrolling()
        } else if (message.command === "remove") {
            remove()
        }
    })

})()