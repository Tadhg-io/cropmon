##!/usr/bin/python

# import libraries

import RPi.GPIO as GPIO # This is the GPIO library we need to use the GPIO pins on the Raspberry Pi
import smtplib # This is the SMTP library we need to send the email notification
import time # This is the time library, we need this so we can use the sleep function
from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from pprint import pprint

pnconfig = PNConfiguration()
pnconfig.subscribe_key = "sub-c-49ee9850-49f3-11eb-a73a-1eec528e8f1f"
pnconfig.publish_key = "pub-c-8fd5daec-f9e0-431f-b01b-b0acc0840aa4"

# instantiate the pubnub service
pubnub = PubNub(pnconfig)

class MySubscribeCallback(SubscribeCallback):
    def status(self, pubnub, status):
        pass

    def presence(self, pubnub, presence):
        pprint(presence.__dict__)

    def message(self, pubnub, message):
        pprint(message.__dict__)

def my_publish_callback(envelope, status):
    print(envelope, status)

pubnub.add_listener(MySubscribeCallback())

# Set our GPIO numbering to BCM
GPIO.setmode(GPIO.BCM)

# Define the GPIO pin that we have our digital output from our sensor connected to
channel = 17
# Set the GPIO pin to an input
GPIO.setup(channel, GPIO.IN)

def callback(channel):  
        if GPIO.input(channel):
                print("LED off")
                pubnub.publish()\
                .channel("CROPS")\
                .message({"sender": pnconfig.uuid, "content": "Hello From Python SDK"})\
                .pn_async(my_publish_callback)
        else:
                print("LED on")

# This line tells our script to keep an eye on our gpio pin and let us know when the pin goes HIGH or LOW
GPIO.add_event_detect(channel, GPIO.BOTH, bouncetime=10)
# This line asigns a function to the GPIO pin so that when the above line tells us there is a change on the pin, run this function
GPIO.add_event_callback(channel, callback)

# This is an infinte loop to keep our script running
while True:
        #  sleep and do nothing
        time.sleep(600)
        callback(channel)