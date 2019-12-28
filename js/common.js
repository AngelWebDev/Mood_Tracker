//save file
function saveJSON(data, filename) {

    if (!data) {
        alert("no Data");
        return;
    }

    if (!filename) filename = 'mood_tracker_data.json'

    var dataArray = [], writeData;
    var writeData = "{";
    for (var i = 0; i < data.track_date.length; i ++) {        
        dataArray.push({date: data.track_date[i],
                        mood: data.mood[i],
                        sleep: data.sleep[i],
                        energy: data.energy[i],
                        arguments: data.arguments[i],
                        supportiveness: data.supportiveness[i],
                        productivity: data.productivity[i],
                        periods: data.periods[i],
                        comment: data.comment[i],
                        overall: data.overall[i]
                    });        
    }

    
    writeData = JSON.stringify(dataArray);    

    var blob = new Blob([writeData], { type: 'text/json' }),
    e = document.createEvent('MouseEvents'),
    a = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}

//calculate overallscore
function calculateScore(moodValue, sleepValue, energyValue, argumentsValue, supportValue, 
                        productivityValue, periodsValue) {    

    return moodValue + sleepValue + energyValue + argumentsValue + supportValue +
        productivityValue + periodsValue;
}

//convert datestring to Date object
