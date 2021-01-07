const PubNub = require('pubnub');
const axios = require('axios');

// URL for Notification
const iftttUrl = "https://maker.ifttt.com/trigger/water/with/key/c_uLB8zuDljFmQwyIYpOzJ";

// creds for pubnub
const credentials = {
    "publishKey": "pub-c-8fd5daec-f9e0-431f-b01b-b0acc0840aa4",
    "subscribeKey": "sub-c-49ee9850-49f3-11eb-a73a-1eec528e8f1f",
    "secretKey": "sub-c-49ee9850-49f3-11eb-a73a-1eec528e8f1f"
}
const CHANNELS = {
    CROPS: 'CROPS'
}

class PubSub {

    constructor() {
        // set the notification pending to false by default
        this.notificationPending = false;

        this.pubnub = new PubNub(credentials);
    
        // subscribe to all channels
        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

        this.pubnub.addListener(this.listener());
    }

    // listen for messages
    listener() {
        return  {
            message: MessageObject => {
                console.log("MESSAGE");

                const { channel, message } = MessageObject;
                console.log(message);

                if(this.notificationPending) {

                    // set the flag to false
                    this.notificationPending = false;

                    // trigger the notification
                    axios
                    .post(iftttUrl)
                    .then(res => {
                        console.log(`statusCode: ${res.statusCode}`);
                        console.log(res);
                    })
                    .catch(error => {
                        console.error(error);
                    });
                }
                

                // // get the message that we received
                // var parsedMessage = JSON.parse(message);
                
                // console.log(`Message received. Channel: ${channel}. Message: ${parsedMessage}`);
            }
        }
    }

    // publish a mnessage
    publish({ channel, message }) {
        this.pubnub.publish({channel, message}); 
    }
}

module.exports = PubSub;