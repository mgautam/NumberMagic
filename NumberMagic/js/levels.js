﻿
var appData = Windows.Storage.ApplicationData.current;
var localSettings = appData.localSettings;

function create_sqlite_table() {
    console.log(appData.localFolder.path);
    var dbPath = appData.localFolder.path + '\\db.sqlite';
    SQLite3JS.openAsync(dbPath)
        .then(function (db) {
            return db.runAsync('CREATE TABLE Scores (sid TEXT, level INT, mistakecount INT, mistakes TEXT, timetaken INT, date TEXT)')
                .then(function () {
                    console.log("TABLE Scores Created");
                }, function (error) {
                    console.log('SQLite Error (Result Code ' + error + ')');
                });
        });
}

function score_post(score_post_array) {

    var dbPath = appData.localFolder.path + '\\db.sqlite';    
    SQLite3JS.openAsync(dbPath)
    .then(function (db) {
        return db.runAsync('INSERT INTO Scores (sid, level, mistakecount, mistakes, timetaken, date) VALUES (?, ?, ?, ?, ?, datetime("now"))', score_post_array).then(
            function () {
                return db.eachAsync('SELECT * FROM Scores', function (row) {
                    console.log('Get a ' + row.row_index + ' for $' + row.date);
                });
            }, function (error) {
                console.log('SQLite Error (Result Code ' + error + ')');
            })        
        .then(function () {
            db.close();
        });
    });

}

function upgradeLevel(this_level) {
    var new_level = this_level + 1;
    if (new_level > localSettings.values["level"]) {

        var dbPath = appData.localFolder.path + '\\db.sqlite';
        SQLite3JS.openAsync(dbPath)
        .then(function (db) {
            return db.runAsync('CREATE TABLE Users (sid TEXT PRIMARY KEY, username TEXT, password TEXT, level INT, centerid TEXT )')
                .then(function () {
                    return db.runAsync('UPDATE Users SET level=? WHERE sid = ?', [new_level, localSettings.values["sid"]] );
                })
                .then(function () {
                    //return db.eachAsync('SELECT * FROM Item', function (row) {
                    //console.log('Get a ' + row.name + ' for $' + row.price);});
                    console.log("You've been upgraded to the next level!!!");
                })
                .then(function () {
                    db.close();
                });
        });
    } else {
        return "Aren't you playing this level again?";
    }
}

function redirect_to_next_level(present_level) {
    var next_level = present_level + 1;
    if (next_level == 0) {
        WinJS.Navigation.navigate("/pages/blank/blank.html", next_level);
    } else if (next_level < 8) {
        WinJS.Navigation.navigate("/pages/110/110.html", next_level);
    } else if (next_level == 10 || next_level == 14) {
        WinJS.Navigation.navigate("/pages/more/more.html", next_level);
    } else if (next_level <= 13) {
        WinJS.Navigation.navigate("/pages/1120/1120.html", next_level);
    } else if (next_level == 17) {
        WinJS.Navigation.navigate("/pages/more/more.html", next_level);
    } else if (next_level <= 20) {
        WinJS.Navigation.navigate("/pages/2130/2130.html", next_level);
    } else if (next_level == 21) {
        WinJS.Navigation.navigate("/pages/301/301.html", next_level);
    } else if (next_level == 22) {
        WinJS.Navigation.navigate("/pages/150/150.html", next_level);
    } else if (next_level == 23) {
        WinJS.Navigation.navigate("/pages/1100/1100.html", next_level);
    }
}