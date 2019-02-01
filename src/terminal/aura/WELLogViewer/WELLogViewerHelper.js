({
    propertirizeElement: function(cmp, name) {
        var element = null;
        Object.defineProperty(this, name, {
            get: function() {
                if (!element) {
                    element = cmp.find(name);
                }
                return element;
            },
        });
    },

    propertirizeAttribute: function(cmp, name) {
        const attName = 'v.' + name;
        Object.defineProperty(this, name, {
            get: function() {
                return cmp.get(attName);
            },
            set: function(value) {
                cmp.set(attName, value);
            },
        });
    },

    subscribe: function() {
        return this.empApi.subscribe('/event/WELLog__e', -1, $A.getCallback(logEvent => {
            this.logEventContainer.addLogEvent(logEvent);
        }))
        .then(subscription => {
            console.info('Subscribed to channel ', subscription.channel);
            this.subscription = subscription;
        });
    },

    unsubscribe: function() {
        return this.empApi.unsubscribe(this.subscription, $A.getCallback(unsubscribed => {
            console.info('Unsubscribed from channel '+ unsubscribed.subscription);
        }))
        .then((success) => {
            if (success) {

                this.subscription = null;
            }
        });
    },
})