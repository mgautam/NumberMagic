﻿(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/highscores/highscore.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.

            var appData = Windows.Storage.ApplicationData.current;
            var localSettings = appData.localSettings;

            var levelArray = Array("blank", "1 - 3", "1 - 5", "1 - 5+", "6 - 10", "6 - 10+", "1 - 10", "1 - 10+", 
                "11 - 15", "11 - 15+", "1 - 15+", "16 - 20", "16 - 20+", "11 - 20+", "1 - 20+", 
                "21 - 25", "21 - 25+", "1 - 25+", "26 - 30", "26 - 30+", "21 - 30+", "1 - 30", "1 - 50", "1 - 100");

            var score_post_string = "sid=" + localSettings.values["sid"];
            var parsedData;
            WinJS.xhr({
                type: "post",
                url: "http://www.kvasix.com/NumberMagic/scorecheck.php",
                responseType: 'json',
                headers: { "Content-type": "application/x-www-form-urlencoded" },
                data: score_post_string
            }).done(   //
              function complete(result) {
                  if (result.status === 200) {
                      console.log(result.responseText);
                      var highscore_list = JSON.parse(result.responseText);

                      var highscore_table = document.getElementById("scoretable");
                      highscore_table.innerHTML = "<tr><th>Date</th><th>Level</th><th>Mistakes (Pawn > Board)</th><th>Number of Mistakes</th><th>Timetaken</th></tr>";
                      var row = 0;
                      while (highscore_list[row]) {
                          var row_html = document.createElement("tr");

                          var date = document.createElement("td");
                          date.innerText = highscore_list[row].date;
                          row_html.appendChild(date);

                          var level = document.createElement("td");
                          level.innerText = levelArray[highscore_list[row].level];
                          row_html.appendChild(level);

                          var mistakes = document.createElement("td");
                          mistakes.innerText = highscore_list[row].mistakes;
                          row_html.appendChild(mistakes);

                          var mistakecount = document.createElement("td");
                          mistakecount.innerText = highscore_list[row].mistakecount;
                          row_html.appendChild(mistakecount);

                          var timetaken = document.createElement("td");
                          timetaken.innerText = "";
                          var hours_taken = Math.floor(highscore_list[row].timetaken / 3600);
                          var mins_taken = (Math.floor(highscore_list[row].timetaken / 60)) % 60;
                          var secs_taken = highscore_list[row].timetaken % 60;
                          if (hours_taken) {
                              timetaken.innerText += hours_taken + "h "; //highscore_list[row].timetaken;//highscore_list[row].hours * 3600 + highscore_list[row].mins * 60 + highscore_list[row].secs;
                          }
                          if (mins_taken) {
                              timetaken.innerText += mins_taken + "m "; //highscore_list[row].timetaken;//highscore_list[row].hours * 3600 + highscore_list[row].mins * 60 + highscore_list[row].secs;
                          }
                          if (secs_taken) {
                              timetaken.innerText += secs_taken + "s"; //highscore_list[row].timetaken;//highscore_list[row].hours * 3600 + highscore_list[row].mins * 60 + highscore_list[row].secs;
                          }
                          row_html.appendChild(timetaken);

                          highscore_table.appendChild(row_html);
                          row++;
                      }
                  }
              },
              function error(result) {
                  /*
                  id("greetings").innerHTML = "Connection Error!";
                  id("userStatus").innerHTML = "Error connecting to Database! Please check your network.";
                  */
              },
              function progress(progress) {
              }
            );
        }
    });

    
    
})();
