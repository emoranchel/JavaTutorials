Full version available at: http://emoranchel.github.io/JavaTutorials/OBE-Viewer/?obe=obelabs%2Fabcs_obe_lab%2FREADME.json
<!--
{
  Tags: node, server 
}
-->
# Developing a Business Application by Using Oracle Visual Builder Cloud Service #

## Before You Begin ##

This tutorial shows you how to quickly develop a business app by using Oracle Application Business Cloud Service. This tutorial takes approximately 15 minutes to complete.

### Background ###

Oracle Visual Builder Cloud Service is a visual development tool for creating web and mobile apps by simply dragging and dropping user interface (UI) components onto a page.

### What Do You Need? ###

- A desktop or laptop computer running Microsoft Windows 7 or later, Apple MacOS 10.9 or later, or Linux with a web browser
- Access to an instance of Oracle Visual Builder Cloud Service

## Log In to Oracle Visual Builder Cloud Service ##

1. Sign in to your Oracle Cloud account and change the temporary password, if you haven't already done so.
2. Log in to your Cloud instance.
3. Click **Dashboard**.
4. Click **Customize Dashboard**.
5. Select **Show** for **appbuilder** and close the dialog box.
6. In the **Application Builder** tile, click **Action** ![Action menu](img/hamburger.png)  and select **Open Service Console**.
   Some code for example:
```java
package org.example.stickerStory;

import java.io.IOException;
import javax.json.JsonObject;
import javax.websocket.EncodeException;
import javax.websocket.Session;
import javax.websocket.WebSocketClose;
import javax.websocket.WebSocketEndpoint;
import javax.websocket.WebSocketMessage;
import javax.websocket.WebSocketOpen;
import javax.websocket.WebSocketPathParam;

@WebSocketEndpoint(
        value = "/story/{story-id}/notifications",
        encoders = {org.example.stickerStory.JsonEncoder.class},
        decoders = {org.example.stickerStory.JsonDecoder.class})
public class StoryWebSocket {

    private StoryCollection storyCollection = new StoryCollection();

    @WebSocketMessage
    public void onMessage(
            @WebSocketPathParam("story-id") String storyId,
            Session session,
            JsonObject jsonObject) throws IOException, EncodeException {
        System.out.println("MESSAGE RECEIVED");
        Story story = storyCollection.getStory(storyId);
        story.addSticker(jsonObject);
    }

    @WebSocketOpen
    public void onOpen(
            @WebSocketPathParam("story-id") String storyId,
            Session session) {
        Story story = storyCollection.getStory(storyId);
        story.addPlayer(session);
        story.updatePlayer(session);
    }

    @WebSocketClose
    public void onClose(
            @WebSocketPathParam("story-id") String storyId,
            Session session) {
        Story story = storyCollection.getStory(storyId);
        story.removePlayer(session);
    }
}
```


   ![Application Builder tile](img/abcs-00.png)

## Design the Application UI ##

1. On the **Oracle Visual Builder Cloud Service** page, click **New Web Application**.
2. On the **Create Application** page, enter `Books Tracker` in the **Application Name** field and click **Next**.
3. In the **Application Template** field, select `Oracle Alta UI`, click **Next**, and then click **Finish**.
4. From the main toolbar, click **Home** and then click **New Page**.
5. In the **Create Page** wizard, in the **Page Title** field, enter `Book Catalog`, click **Edit**, and then click **Next**.
   Some more code before the image

```javascript
function backgroundImg() {
    var canvas = document.getElementById("board");
    var ctx = canvas.getContext("2d");
    var img = document.getElementById("background_img");
    ctx.drawImage(img, 0, 0);
}
function toggleLog() {
    var log = document.getElementById("logContainer");
    if (!log.getAttribute("style")) {
        log.setAttribute("style", "display:block;");
    } else {
        log.setAttribute("style", "");
    }
}

function drag(ev) {
    var bounds = ev.target.getBoundingClientRect();
    var dragObject = {
        sticker: ev.target.getAttribute("data-sticker"),
        offsetX: ev.clientX - bounds.left,
        offsetY: ev.clientY - bounds.top
    };

    ev.dataTransfer.setData("Sticker", JSON.stringify(dragObject));
}

function drop(ev) {
    ev.preventDefault();
    var bounds = document.getElementById("board").getBoundingClientRect();
    var dragObject = JSON.parse(ev.dataTransfer.getData("Sticker"));
    var sendObject = {action: "add",
        x: ev.clientX - dragObject.offsetX - bounds.left,
        y: ev.clientY - dragObject.offsetY - bounds.top,
        sticker: dragObject.sticker};
    socket.send(JSON.stringify(sendObject));
    log("Sending Object " + JSON.stringify(sendObject));
}

function allowDrop(ev) {
    ev.preventDefault();
}

var logCount = 0;
function log(logstr) {
    var logElement = document.getElementById("log");
    logElement.innerHTML = "<b>[" + logCount + "]: </b>" + logstr + "<br>" + logElement.innerHTML;
    logCount++;
}
window.onload = initialize;
var socket = null;
function initialize() {
    backgroundImg();
    socket = new WebSocket("ws://localhost:8080/StickerStory/story/1/notifications");
    socket.onopen = function() {
        var sendObject = {action: "HAI"};
        socket.send(JSON.stringify(sendObject));
        log("Sending Object " + JSON.stringify(sendObject));
    };
    socket.onmessage = function(event) {
        if (event.data) {
            var receiveObject = JSON.parse(event.data);
            if (receiveObject.action === "add") {
                var imageObj = new Image();
                imageObj.onload = function() {
                    var canvas = document.getElementById("board");
                    var context = canvas.getContext("2d");
                    context.drawImage(imageObj, receiveObject.x, receiveObject.y);
                };
                imageObj.src = "resources/stickers/" + receiveObject.sticker;
            }
            log("Received Object: " + JSON.stringify(receiveObject));
        }
    };

}
```

   ![Create Page step](img/abcs-05.png)

6. Click **New Business Object**, enter `Book_Catalog_BO` in the **Business Object Name** field, and click OK  Business object **OK** ![button](img/func_checkmark_16_ena.png) .
7. Click **Create** to save the changes.

## Add a Table Component to the Form ##

1. On the Application Designer page, in the Filter Box field of the components panel, enter table, and drag and drop the table component onto the Book Catalog form.

   ![Add a Table to the Book Catalog page](img/abcs-07.png)

2. On the Table Creation Wizard page, select Book_Catalog_BO as the business object.

   ![Data step](img/abcs-08.png)

3. On the Table Creation Wizard page, click New Field. In the New Field dialog box, enter Book Title and click Create Create button. Repeat these actions to add the Author, ISBN, and Published Date fields.
4. In the Available list, drag and drop Id to the first position in the Selected list, and click Finish.

   ![Mapping step](img/abcs-09.png)

5. On the Table Designer page, click Actions (the hand icon) to open the list of available actions for the table.
6. On the Application Designer page, in the Create Book_Catalog_BO tile, click Edit Edit Action button.
7. On the Configure Action page, in the Save Book_Catalog_BO tile, click Remove this item (X) to remove the save action. Click Done.
8. On the Application Designer page, click Test Application Test Application button to run your web app on the Runtime page.
9. On your running Book Catalog web app page, click Create, enter the values for the following fields, and then click Save and Close:
```
   Book Title: Oracle ABCS For Beginners
   Author: Oracle Press
   ISBN: 123-456-789-0
   Published Date: today's date
```
   The row is displayed in the books table on the Book Catalog page of your web app.

   ![Books Tracker application](img/abcs-12.png)

## Complete and Test the App ##

1. On the Runtime page, click Back To Designer.
2. On the Application Designer page, click Home.
3. Clear Filter, click the picture component in the components panel, and then drag and drop it onto the Home page of your web app.

   ![UI Components section](img/abcs-15.png)

4. In the active window, click select from Image Gallery.
5. On the Image Gallery tab, click Application Menu, click the navi_library image, and then click Select.

   ![Image Gallery tab](img/abcs-17.png)

6. In the Select from Image Gallery dialog box, click Create Accept button .
7. On the Application Designer page, click Actions, and then click Add Action.

   ![Properties panel for the Image component](img/abcs-18.png)

8. On the Configure Action page, select Navigate to Page in the Suggested panel and drag and drop it onto the THEN DO SOMETHING ELSE section.

   ![Configure Action page](img/abcs-19.png)

9. On the Configure Action page, select Book Catalog from the Page to Open drop-down list, and click Done.
10. On the Application Designer page, click Test Application Test Application button.
11. Your running app should look like the following image:

   ![Finalized Books Tracker application](img/abcs-21.png)

## Want to Learn More? ##

[Oracle Visual Builder Cloud Service: Get Started](http://www.oracle.com/pls/topic/lookup?ctx=en/cloud/paas/app-builder-cloud&id=abcsgs)
