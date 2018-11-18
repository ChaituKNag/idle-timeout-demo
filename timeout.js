function IdleTimeout(timeoutSeconds, options) {

    var defaultOptions = {
        callback: function () {},
        alertTimoutSeconds: 10,
        events: "mousemove keydown wheel DOMMouseScroll mousewheel mousedown touchstart touchmove MSPointerDown MSPointerMove"
    }
    
    this.timeoutSeconds = timeoutSeconds;
    this.options = Object.assign({}, defaultOptions, options);
    this.timoutRef = null;
    this.intervalRef = null;
    this.activityListenerRefs = {};
    this.startTime = null;
    this.endTime = null;

    this.options.events.split(' ').forEach(function (event) {
        this.activityListenerRefs[event] = this.activityListener.bind(this);
        window.addEventListener(event, this.activityListenerRefs[event]);
    }, this);

    this.startTimer();
}

IdleTimeout.prototype.startTimer = function () {

    this.startTime = new Date();
    this.endTime = new Date(this.startTime.getTime() + (this.timeoutSeconds * 1000));

    this.timoutRef = setTimeout(this.onTimerDone.bind(this), this.timeoutSeconds * 1000);

    this.intervalRef = setInterval(this.showMessage.bind(this), 1000);
}

IdleTimeout.prototype.clearTimer = function () {
    clearTimeout(this.timoutRef);
    clearTimeout(this.intervalRef);
    this.hideMessage();
}

IdleTimeout.prototype.resetTimer = function () {
    this.clearTimer();
    this.startTimer();
}

IdleTimeout.prototype.onTimerDone = function () {
    this.options.callback();
    this.options.events.split(' ').forEach(function (event) {
        window.removeEventListener(event, this.activityListenerRefs[event]);
    }, this);
    clearTimeout(this.intervalRef);
    this.hideMessage();
}

IdleTimeout.prototype.activityListener = function () {
    this.resetTimer();
}

IdleTimeout.prototype.showMessage = function () {
    var remaining = Math.ceil((this.endTime.getTime() - (new Date().getTime()))/1000);
    var message = `${remaining} second(s) remaining...`;

    var messageElement = document.querySelector('#timeout-message');
    if(!messageElement) {
        messageElement = document.createElement('span');
        messageElement.setAttribute('id', 'timeout-message');

        if(typeof this.options.customClass === 'string' && this.options.customClass.trim() !== "") {
            messageElement.classList.add(this.options.customClass);
        } else {
            messageElement.style = `
                position: absolute;
                top: 50%;
                left: 50%;
                widht: 300px;
                transform: translate(-50%, -50%);
                font-family: 'Open Sans', sans-serif;
                padding: 15px;
                border: 1px solid grey;
                box-shadow: 0 0 5px -2px rgba(0, 0, 0, .5);
                color: white;
            `;
        }
    }

    if(remaining <= this.options.alertTimoutSeconds) {
        messageElement.style.backgroundColor = "green";
        document.body.appendChild(messageElement);
    }
    if(remaining <= 5) {
        messageElement.style.backgroundColor = "red";
        document.body.appendChild(messageElement);
    }

    messageElement.innerHTML = message;
}

IdleTimeout.prototype.hideMessage = function () {
    var messageElement = document.querySelector('#timeout-message');
    if(messageElement) {
        document.body.removeChild(messageElement);

    }
}