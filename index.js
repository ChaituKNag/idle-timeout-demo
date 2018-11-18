(function () {
    var timer = new IdleTimeout(15, {
        callback: function () {
            console.log("callback triggered");
            document.body.innerHTML = `
                <h1>Your session has timed out...</h1>
            `;
        }
    });
})();