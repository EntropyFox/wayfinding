# AR Tracker (Browser)
This projects purpose is to develop tracking without messing up the viewer. 

## Configure and build
Ensure dependencies are installed:

    npm install

Run in developing mode:

    npm run dev

To test a single images tracking

    npm run dev:image

The size of the image is currently hardcoded to be the same as the one we request fromt the video (480 x 630). 

### Running Localhost on your mobile phone

To run the viewer on your mobile phone while developing, do the following:

1. Make sure your computer and your phone are running on the same network.
2. Get your computer's IP address.
   a. Find local IP address on Linux: https://www.linuxtrainingacademy.com/determine-public-ip-address-command-line-curl/
   b. Find local IP address on Windows or Mac: https://www.whatismybrowser.com/detect/what-is-my-local-ip-address
3. Make sure the viewer is running on localhost 8080 on your computer.
4. Enter the following in your mobile phones browser: https://[computer's IP address]:8080/[hololink id].
   Example: https://192.168.0.103:8080/5f5bd344cbe3a41686bd6ed8
5. The browser will tell you that the connection is not secure. Bypass this and view the link anyway.