﻿(function () {
    "use strict";

    var NUM_PAWNS, NUM_ROWS = 2, NUM_COLS = 5, indexSelected;
    WinJS.UI.Pages.define("/pages/kids/110.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            
            indexSelected = parseInt(options.toString());

            if (indexSelected == 1) {
                NUM_PAWNS = 3;
            }
            else if (indexSelected == 0 || indexSelected == 2 || indexSelected == 3) {
                NUM_PAWNS = 5;
            }
            else {
                NUM_PAWNS = 10;
            }

            var numGrid = document.getElementById("numGrid");

            for (var row = 0; row < NUM_ROWS; row++) {
                var numrow = document.createElement("tr");
                for (var col = 0; col < NUM_COLS; col++) {
                    var numContainer = document.createElement("td");
                    numContainer.setAttribute("class", "numContainer");

                    var idNumber = row * NUM_COLS + col + 1;
                    numContainer.setAttribute("id", "numBox" + idNumber);
                    if (indexSelected)
                        numContainer.innerHTML = idNumber;

                    numContainer.setAttribute("ondragover", "return false;");
                    numContainer.addEventListener('drop', checkShapeDrop, false);

                    numrow.appendChild(numContainer);
                }
                numGrid.appendChild(numrow);
            }

            populateArray();
            for (var idnum = 1; idnum <= NUM_PAWNS; idnum++) {
                var circle = document.createElement("canvas")
                circle.setAttribute("width", 100);
                circle.setAttribute("height", 100);
                var context = circle.getContext('2d');
                var centerX = circle.width / 2;
                var centerY = circle.height / 2;
                var radius = min(centerX, centerY);

                //document.getElementById("mistakeCount").innerHTML = circle.width;
                context.fillStyle = 'green';
                context.beginPath();
                context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
                context.fill();


                context.fillStyle = "blue";
                context.font = "bold 16px Arial";
                context.textAlign = "center";
                context.fillText(numArray[idnum-1], 10, 10);

                /*
                var circle = document.createElement("img");
                circle.src = "/images/circle.png";                    
                circle.setAttribute("alt", "pawn" + idNumber);
                */

                if (indexSelected == 3 || indexSelected == 5)
                    circle.setAttribute("class", "freepawnSingle");
                else
                    circle.setAttribute("class", "freepawn");
                circle.setAttribute("id", "pawn" + numArray[idnum-1]);
                circle.addEventListener('dragstart', startShapeDrag, false);
                //circle.addEventListener('drag', moveObject, false);
                //id('pawnHeap' + randint(1, 2)).appendChild(circle);
                id('pawnHeap' + ((idnum % 2)+1)).appendChild(circle);
            }
            numpawnsleft = NUM_PAWNS;
            disableRightHeap = true;
            toggleHeap(disableRightHeap);            

            id('reset').addEventListener("click", resetPawns, false);
            timeCtrl = setInterval(timer, 500);

            gotRightAudio = new Audio("/sounds/right.wma");
            gotRightAudio.load();
            gotWrongAudio = new Audio("/sounds/wrong.wma");
            gotWrongAudio.load();
            applaudAudio = new Audio("/sounds/applause.wma");
            applaudAudio.load();
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
            clearInterval(timeCtrl);
            hours = 0, mins = 0, secs = 0;
        }
    });

    // Restore the user's volume
    var appData = Windows.Storage.ApplicationData.current;
    var localSettings = appData.localSettings;

    var timeCtrl = null;
    var mistakeCount = 0;
    var numpawnsleft;
    var gotRightAudio, gotWrongAudio, applaudAudio;
    var disableRightHeap;
    function toggleHeap(disableRight) {
        if (disableRight && (id('pawnHeap1').childElementCount != 0))
        {
            for (var i = 0; i < id('pawnHeap1').childElementCount; i++) {
                id('pawnHeap1').childNodes[i].draggable = true;
                id('pawnHeap1').childNodes[i].setAttribute("class", "freepawn");
            }
            for (var i = 0; i < id('pawnHeap2').childElementCount; i++) {
                id('pawnHeap2').childNodes[i].draggable = false;
                id('pawnHeap2').childNodes[i].setAttribute("class", "disabled");
            }
            disableRightHeap = false;
        } else if (!disableRight && (id('pawnHeap2').childElementCount != 0)) {
            for (var i = 0; i < id('pawnHeap1').childElementCount; i++) {
                id('pawnHeap1').childNodes[i].draggable = false;
                id('pawnHeap1').childNodes[i].setAttribute("class", "disabled");
            }
            for (var i = 0; i < id('pawnHeap2').childElementCount; i++) {
                id('pawnHeap2').childNodes[i].draggable = true;
                id('pawnHeap2').childNodes[i].setAttribute("class", "freepawn");

            }
            disableRightHeap = true;
        }
    }

    function moveObject(eventInfo) {
        var coords = window.event;
        this.setAttribute("class", "dragging");
        //this.style.top = coords.pageY;
        //this.style.left = coords.pageX;
        id('mistakeCount').innerHTML = (coords.pageX);
    }

    function checkShapeDrop(e) {
        // Remove the 'numBox' and 'pawn' part of the id's and compare the rest of the strings. 
        var target = this.id.replace("numBox", "");
        var elt = e.dataTransfer.getData('text').replace("pawn", "");
        if (target == elt) {  // if we have a match, fill the numBox with white and show the status.
            this.innerHTML = "";

            //  Remove the original image to give illusion that the image is now inside the numBox
            var pawn = document.getElementById(e.dataTransfer.getData('text'))
            this.appendChild(pawn);
            //id('pawnHeap').removeChild(pawn);
            pawn.setAttribute("class", "setpawn");
            pawn.draggable = false;

            gotRightAudio.volume = localSettings.values["volume"];
            gotRightAudio.play();

            toggleHeap(disableRightHeap);

            if (!(--numpawnsleft)) {                
                clearInterval(timeCtrl);
                applaudAudio.volume = localSettings.values["volume"];
                applaudAudio.play();
                var msgBox = new Windows.UI.Popups.MessageDialog("Good Job, " + localSettings.values["usrName"] + "!!! You've completed the game in " +
                    (hours < 10 ? "0" : "") + hours + ":" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs +
                     " with " + mistakeCount + " mistakes. Why don't you try it again?");
                msgBox.showAsync();

                if(localSettings.values["highscores"])
                    localSettings.values["highscores"] = localSettings.values["highscores"] + localSettings.values["usrName"] + "," + "Scrambled" + "," + mistakeCount + "," + hours + ":" + mins + ":" + secs + ".";
                else localSettings.values["highscores"] = localSettings.values["usrName"] + "," + "Scrambled" + "," + mistakeCount + "," + hours + ":" + mins + ":" + secs + ".";
            }
            id("mistakeCount").innerHTML = mistakeCount;
        }
        else {
            // Display the number of mistakes so far
            mistakeCount++;
            id(e.dataTransfer.getData('text')).setAttribute("class", "freepawn");
            id("mistakeCount").innerHTML = mistakeCount + ": Pieces don't match!";
            //pawnHeapNode.appendChild(this);
            //id(e.dataTransfer.getData('text')).style.visibility = true;
            gotWrongAudio.volume = localSettings.values["volume"];
            gotWrongAudio.play();
        }
    }

    //var pawnHeapNode;
    // When dragging starts, set dataTransfer's data to the element's id.
    function startShapeDrag(e) {
        e.dataTransfer.setData('text', this.id);
        //pawnHeapNode = this.parent;
        //document.body.appendChild(this);

        //this.style.visibility = false;
    }

    function id(elementId) {
        return document.getElementById(elementId);
    }

    function min(x, y) {        
        if (x < y)
            return x;
        else
            return y;
    }

    function resetPawns() {
        populateArray();
        for (var idnum = 1; idnum <= NUM_PAWNS; idnum++) {
            id('pawnHeap'+randint(1,2)).appendChild(id("pawn" + numArray[idnum-1]));
            id("pawn" + idnum).setAttribute("class", "freepawn");
        }

        for (var row = 0; row < NUM_ROWS; row++) {
            for (var col = 0; col < NUM_COLS; col++) {
                var idNumber = row * NUM_COLS + col + 1;
                var numContainer = document.getElementById("numBox" + idNumber);
                if (indexSelected)
                    numContainer.innerHTML = idNumber;
            }
        }

        toggleHeap(disableRightHeap);

        mistakeCount = 0;
        numpawnsleft = NUM_PAWNS;
        id("mistakeCount").innerHTML = 0;
        hours = 0, mins = 0, secs = 0;
    }

    var hours = 0, mins = 0, secs = 0;
    var blink = true;
    var separator = ":";
    function timer() {        
        blink ? (++secs, separator = " ", blink = false) : (separator = ":", blink = true);
        (secs == 60) ? (++mins, secs = 0) : true;
        (mins == 60) ? (++hours, mins = 0) : true;               
        id('timeCounter').innerHTML = (hours < 10 ? "0" : "") + hours + separator + (mins < 10 ? "0" : "") + mins + separator + (secs < 10 ? "0" : "") + secs;
    }

    var numArray;
    function populateArray() {
        numArray = new Array();
        var populated_count = 0;
        while (populated_count < NUM_PAWNS) {
            numArray[populated_count] = ++populated_count;
        }

        for (var i = numArray.length - 1; i > 0; i--) {
            var j = randint(0, i);

            // Swap the elements at positions i and j.
            var temp = numArray[i];
            numArray[i] = numArray[j];
            numArray[j] = temp;
        }
    }

    function randint(l, u)
    // Returns an integer uniformly distributed over l..u.
    {
        return l + Math.floor(Math.random() * (u + 1 - l));
    }
})();
