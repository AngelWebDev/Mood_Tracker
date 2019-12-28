const DATABASE_NAME = "moodtracker_personal";
const OBJECT_STORE_NAME = "trackerdata";
const VERSION = "1.0";
var db;

var trackerDatabase = { track_date: [], mood: [], sleep: [], energy: [], arguments: [], supportiveness: [], productivity: [], periods: [], comment: [], overall: [] };
/*DATA_STRUCTURE
    track_date: DATE(key)
    mood: int
    sleep: int
    energy: int
    arguments: int
    supportiveness: int
    productivity: float
    periods: int
    comment: string
    overall: float  
*/

function openDatabase(callback = null) {
    var request = window.indexedDB.open(DATABASE_NAME, VERSION);
    request.onerror = function(event) {
        console.log('The database is opened failed');
    };


    request.onsuccess = function(event) {
        db = request.result;
        console.log('The database is opened successfully');
        if (callback != null) {
            callback();
        }
    };

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        var objectStore = db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'track_date' });
        objectStore.createIndex('mood', 'mood', { unique: false });
        objectStore.createIndex('sleep', 'sleep', { unique: false });
        objectStore.createIndex('energy', 'energy', { unique: false });
        objectStore.createIndex('arguments', 'arguments', { unique: false });
        objectStore.createIndex('supportiveness', 'supportiveness', { unique: false });
        objectStore.createIndex('productivity', 'productivity', { unique: false });
        objectStore.createIndex('periods', 'periods', { unique: false });
        objectStore.createIndex('comment', 'comment', { unique: false });
        objectStore.createIndex('overall', 'overall', { unique: false });
    }
}

function updateDatabase(trackData, callback) {
    var request = db.transaction([OBJECT_STORE_NAME], 'readwrite')
        .objectStore(OBJECT_STORE_NAME)
        .put(trackData);

    request.onsuccess = function(event) {
        alert('The data has been updated successfully.');
        if (callback != null) {
            callback(trackData, false);
        }
    };

    request.onerror = function(event) {
        alert('The data has been updated failed');

    }
}

function saveDatabase(trackData, callback = null) {
    var request = db.transaction([OBJECT_STORE_NAME], 'readwrite')
        .objectStore(OBJECT_STORE_NAME)
        .add(trackData);


    request.onsuccess = function(event) {
        alert("The data has been written successfully.");
        if (callback != null) {
            callback(trackData, true);
        }
    };

    request.onerror = function(event) {
        console.log('The data has been written failed');
        updateDatabase(trackData, callback);
    }
}

function removeRecord(date, callback) {
    var request = db.transaction([OBJECT_STORE_NAME], 'readwrite')
        .objectStore(OBJECT_STORE_NAME)
        .delete(date);


    request.onsuccess = function(event) {
        alert("The data has been deleted successfully.");
        if (callback != null) {
            callback();
        }
    };

    request.onerror = function(event) {
        alert('The data has been deleted failed');
        updateDatabase(trackData, callback);
    }
}


function readDatabase(callback = null) {
    var objectStore = db.transaction(OBJECT_STORE_NAME).objectStore(OBJECT_STORE_NAME);
    console.log(trackerDatabase);
    if (trackerDatabase.track_date.length > 0) {
        console.log("Database was already read");
        callback(trackerDatabase);
        return;
    }

    trackerDatabase = { track_date: [], mood: [], sleep: [], energy: [], arguments: [], supportiveness: [], productivity: [], periods: [], comment: [], overall: [] };;


    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;

        if (cursor) {
            trackerDatabase.track_date.push(cursor.key);
            trackerDatabase.mood.push(cursor.value.mood);
            trackerDatabase.sleep.push(cursor.value.sleep);
            trackerDatabase.energy.push(cursor.value.energy);
            trackerDatabase.arguments.push(cursor.value.arguments);
            trackerDatabase.supportiveness.push(cursor.value.supportiveness);
            trackerDatabase.productivity.push(cursor.value.productivity);
            trackerDatabase.periods.push(cursor.value.periods === 0 ? -100 : -40);
            trackerDatabase.comment.push(cursor.value.comment);
            trackerDatabase.overall.push(cursor.value.overall);
            cursor.continue();
        } else {
            
            if (callback != null) {
                callback(trackerDatabase);
            }

            console.log('No more data');
        }
    };
}