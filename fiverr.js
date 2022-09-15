// ==UserScript==
// @name         Fiverr Buyer Requests
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.fiverr.com/users/santiagorecoba/requests*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fiverr.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    const vary = 300000
    const refreshrate = Math.floor(randomIntFromInterval(vary - 100000, vary) / 1000) * 1000
    var counter = 0;
    var counterint;
    var inter;
    console.log('Refresh Rate: ' + refreshrate)


    var checker = setInterval(() => {
        if (document.querySelector("#main-wrapper > div.main-content.js-main-content > section > div > article > div.db-new-main-table.align-top.js-db-table > table > tbody")) {
            ScriptLoader();
            clearInterval(checker);
        }
    }, 5000);

    function ScriptLoader() {
            createIntervals();
     


        console.log('Loaded')
        let rows = document.querySelector("#main-wrapper > div.main-content.js-main-content > section > div > article > div.db-new-main-table.align-top.js-db-table > table > tbody").querySelectorAll('tr');
        let quantity = rows.length
        if (quantity > 0 && !rows[0].innerHTML.includes('No requests found')) {
            showNotification(quantity);
        }

        function showNotification(quantity) {
            console.log('Found ' + quantity)
            var title = "Buyer requests came in!";
            var icon = "https://www.google.com/s2/favicons?sz=64&domain=fiverr.com"
            var body = quantity + " new buyer requests!";
            var notification = new Notification(title, { body, icon });
            notification.onclick = () => {
                notification.close();
                window.parent.focus();
            }
        }


        document.addEventListener("visibilitychange", onVisibilityChanged, false);

    }

    function createIntervals() {
        clearInterval(inter);
        clearInterval(counterint);
        counterint = setInterval(() => {
            document.title = 'Updating in: ' + (Math.floor(refreshrate / 1000) - counter) + 's';
            counter++;
        }, 1000);

        inter = setInterval(() => {
            clearInterval(inter);
            clearInterval(counterint)
            location.reload();
        }, refreshrate);

    }

    function onVisibilityChanged() {
        if (document.hidden || document.mozHidden || document.webkitHidden || document.msHidden) {
            createIntervals();
            console.log('Out of focus')
        } else {
            clearInterval(inter);
            clearInterval(counterint);
            counter = 0;
            document.title = 'In focus (Paused)';
            console.log('In focus')
        }
    }

})();