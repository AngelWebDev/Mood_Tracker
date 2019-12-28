var dateString = "";
var searchDataIndex = -1;
//Init Datepicker
function initDatePicker() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yy = today.getFullYear() - 2000;

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    
    dateString = mm + "/" + dd + "/" + today.getFullYear();

    if (trackerDatabase.track_date.length > 0) {
        searchDataIndex = trackerDatabase.track_date.findIndex(function(element) {
            return (element === dateString);
        });

        if (searchDataIndex > -1) {
            resetInputInfoByDatabase(searchDataIndex);
            $("#button-update").html("Update");
            $("#button-delete").show();
        } else {
            $("#button-update").html("Submit");
            $("#button-delete").hide();
        }
    }

    $("#trackday-year").html(yy);
    $("#trackday-date").html(dd);
    $("#trackday-month").html(mm);

    var from_$input = $('#input-datepicker').pickadate(),
        from_picker = from_$input.pickadate('picker');
    from_picker.set('select', today);

    from_picker.on('set', function(event) {
        if (event.select) {
            var selectedDate = from_picker.get('select');
            yy = selectedDate.year - 2000;
            dd = selectedDate.date;
            mm = selectedDate.month + 1;

            if (selectedDate.date < 10) {
                dd = '0' + dd;
            }

            if (selectedDate.month < 9) {
                mm = '0' + mm;
            }

            dateString = mm + "/" + dd + "/" + today.getFullYear();

            if (trackerDatabase.track_date.length > 0) {
                searchDataIndex = trackerDatabase.track_date.findIndex(function(element) {
                    return (element === dateString);
                });

                if (searchDataIndex > -1) {
                    resetInputInfoByDatabase(searchDataIndex);
                    $("#button-update").html("Update");
                    $("#button-delete").show();
                } else {

                    $("#button-update").html("Submit");                    
                    $("#button-delete").hide();
                }
                console.log("searchData", searchDataIndex);
            }
            $("#trackday-year").html(yy);
            $("#trackday-date").html(dd);
            $("#trackday-month").html(mm);
            //to_picker.set('min', from_picker.get('select'))    
        } else if ('clear' in event) {
            //to_picker.set('min', false)
        }
    });

    $("#button-datepicker").click(function(ev) {
        from_$input.click();
    });
}

//reset InputInfo by parameters
function resetInputInfo(mood, sleep, energy, arguments, supportiveness, productivity, periods, comment, overall) {
    $("#mood").val(mood).change();
    $("#sleep").val(sleep).change();
    $("#energy").val(energy).change();
    $("#arguments").val(arguments).change();
    $("#supportiveness").val(supportiveness).change();
    $("#productivity").val(productivity).change();
    $("#periods").prop("checked", periods == -40 ? true : false);
    $("#comment").val(comment);
    $("#score").html(overall);
}

//reset InputInfo by selected date
function resetInputInfoByDatabase(index) {
    resetInputInfo(trackerDatabase.mood[index],
        trackerDatabase.sleep[index],
        trackerDatabase.energy[index],
        trackerDatabase.arguments[index],
        trackerDatabase.supportiveness[index],
        Number(trackerDatabase.productivity[index]),
        Number(trackerDatabase.periods[index]),
        trackerDatabase.comment[index],
        trackerDatabase.overall[index]
    )
}

//generating Slider States
function generateSliderStates(arr, low, high) {

    var endColor = { r: 0x4b, g: 0xc4, b: 0x7d };
    var startColor = { r: 0xf1, g: 0xc4, b: 0x0f };

    for (i = 0; i <= high - low; i++) {
        arr.push({
            name: 'step' + i,
            tooltip: "",
            range: _.range(i + low, i + low + 1),
            color: {
                r: parseInt(startColor.r + (endColor.r - startColor.r) * i / (high - low)),
                g: parseInt(startColor.g + (endColor.g - startColor.g) * i / (high - low)),
                b: parseInt(startColor.b + (endColor.b - startColor.b) * i / (high - low))
            }
        });
    }
}

function generateSliderState2(arr, data) {
    var length = data.length;
    for (i = 0; i < length; i ++) {
        arr.push(data[i]);
    }

}
//initSliderRange
function initSliderRange(elementSeector, data_index = -1, decimal_point = 0) {
    const $tooltip = $('#range-tooltip');
    const sliderStates = [];
    var currentState;
    var $handle;

    elementSeector = elementSeector;
    var element = $(elementSeector);
    var eleWidth = parseInt(element.css('width'));
    var minValue = Number(element.attr('min'));
    var maxValue = Number(element.attr('max'));
    var defaultValue = Number(element.attr('defaultValue'));

    if (data_index == -1) {
        generateSliderStates(sliderStates, minValue, maxValue);    
    } else {
        generateSliderState2(sliderStates, sliderData[data_index]);
        
    }
    
    element.val(defaultValue);

    /*element.parent().find('.range-defaultalue-tip').css(
      'left', (defaultValue - minValue) * eleWidth / (maxValue - minValue) + 'px');
    */
    element
        .rangeslider({
            polyfill: false,
            onInit: function() {

                $handle = $('.rangeslider__handle', this.$range);
                updateHandle($handle[0], this.value);
                updateState($handle[0], this.value);
            }
        })
        .on('input', function() {
            updateHandle($handle[0], this.value);
            checkState($handle[0], this.value);
        });

    // Update the value inside the slider handle
    function updateHandle(el, val) {
        if (decimal_point == 0)
            el.textContent = val;
        else
            el.textContent = (Number(val) / 10).toString();
    }

    // Check if the slider state has changed
    function checkState(el, val) {
        // if the value does not fall in the range of the current state, update that shit.
        if (decimal_point == 1) {
            val = Number(val) * 10;
        }

        if (!_.contains(currentState.range, parseInt(val))) {
            updateState(el, val);
        }
    }

    // Update Slider's UI property
    function updateSlider(val) {
        //console.log($element.next().find('.rangeslider__handle'));

        element.next().find('.rangeslider__handle').attr("style", function(i, orgValue) {
            return 'left: ' + $(this).css('left') + '; background: rgb(' + val.r + ', ' + val.g + ', ' + val.b + ')';
        });
        //$element.next().find('.rangeslider__handle').html("asfa");
    }

    // Change the state of the slider
    function updateState(el, val) {

        for (var j = 0; j < sliderStates.length; j++) {

            if (_.contains(sliderStates[j].range, parseInt(val))) {
                currentState = sliderStates[j];
                updateSlider(sliderStates[j].color);
            }
        }
        // If the state is high, update the handle count to read 50+
        /*if (currentState.name == "high") {
          updateHandle($handle[0], "50+");
        }*/
        // Update handle color
        $handle
            .removeClass(function(index, css) {
                return (css.match(/(^|\s)js-\S+/g) || []).join(' ');
            })
            .addClass("js-" + currentState.name);
        // Update tooltip
        $tooltip.html(currentState.tooltip);
    }
}

function displayOverallscore() {
    var moodValue = Number($("#mood").val());
    var sleepValue = Number($("#sleep").val());
    var energyValue = Number($("#energy").val());
    var argumentsValue = Number($("#arguments").val());
    var supportValue = Number($("#supportiveness").val());
    var productivityValue = Number($("#productivity").val());
    var periodsValue = $("#periods").prop("checked") === true ? 1 : 0;

    $("#score").html(calculateScore(moodValue, sleepValue, energyValue, argumentsValue, supportValue, productivityValue,
        periodsValue));
}

//update trackerDatabase variable
function updateGlobalVariable(trackdata, add) {

    console.log(trackdata);
    if (add) {
        trackerDatabase.track_date.push(trackdata.track_date);
        trackerDatabase.mood.push(trackdata.mood);
        trackerDatabase.sleep.push(trackdata.sleep);
        trackerDatabase.energy.push(trackdata.energy);
        trackerDatabase.arguments.push(trackdata.arguments);
        trackerDatabase.supportiveness.push(trackdata.supportiveness);
        trackerDatabase.productivity.push(trackdata.productivity);
        trackerDatabase.periods.push(trackdata.periods == 1 ? -40 : -100);
        trackerDatabase.comment.push(trackdata.comment);
        trackerDatabase.overall.push(trackdata.overall);
    } else {
        trackerDatabase.track_date[searchDataIndex] = trackdata.track_date;
        trackerDatabase.mood[searchDataIndex] = trackdata.mood;
        trackerDatabase.sleep[searchDataIndex] = trackdata.sleep;
        trackerDatabase.energy[searchDataIndex] = trackdata.energy;
        trackerDatabase.arguments[searchDataIndex] = trackdata.arguments;
        trackerDatabase.supportiveness[searchDataIndex] = trackdata.supportiveness;
        trackerDatabase.productivity[searchDataIndex] = trackdata.productivity;
        trackerDatabase.periods[searchDataIndex] = (trackdata.periods == 1 ? -40 : -100);
        trackerDatabase.comment[searchDataIndex] = trackdata.comment;
        trackerDatabase.overall[searchDataIndex] = trackdata.overall;
    }
    console.log(trackerDatabase);
}

//submit Data to Database module
function submitData() {
    var moodValue = Number($("#mood").val());
    var sleepValue = Number($("#sleep").val());
    var energyValue = Number($("#energy").val());
    var argumentsValue = Number($("#arguments").val());
    var supportValue = Number($("#supportiveness").val());
    var productivityValue = Number($("#productivity").val());
    var periodsValue = $("#periods").prop("checked") === true ? 1 : 0;
    var commentValue = $("#comment").val();

    var from_$input = $('#input-datepicker').pickadate(),
        from_picker = from_$input.pickadate('picker');
    var selectedDate = from_picker.get('select');
    var yy = selectedDate.year;
    var dd = selectedDate.date;
    var mm = selectedDate.month + 1;

    if (selectedDate.date < 10) {
        dd = '0' + dd;
    }

    if (selectedDate.month < 10) {
        mm = '0' + mm;
    }

    saveDatabase({
        track_date: mm + '/' + dd + '/' + yy,
        mood: moodValue,
        sleep: sleepValue,
        energy: energyValue,
        arguments: argumentsValue,
        supportiveness: supportValue,
        productivity: productivityValue,
        periods: periodsValue,
        comment: commentValue,
        overall: calculateScore(moodValue, sleepValue, energyValue, argumentsValue, supportValue, productivityValue,
            periodsValue)
    }, updateGlobalVariable);
}



function initInputData() {
    readDatabase(initDatePicker);
}

window.onload = function() {
    $("#button-delete").hide();
    openDatabase(initInputData);

    //Init checkbox
    $(':checkbox').checkboxpicker();

    //Init Datepicker Elements    

    //Init SliderRange Elements
    initSliderRange('#mood', 2);
    initSliderRange('#sleep', 0);
    initSliderRange('#energy', 2);
    initSliderRange('#arguments',1);
    initSliderRange('#supportiveness', 2);
    initSliderRange('#productivity', 3);

    //Recalculate when input changes
    $("#button-update").click(function() {
        submitData();
    });

    $("#button-delete").click(function() {
        //submitData();
    });

    $("#periods").on('change', function() {
        displayOverallscore();
    });

    $("input").change(function() {
        displayOverallscore();

    });

    $("#button-export").click(function() {
        readDatabase(saveJSON);
    });

    $("#button-delete").click(function() {
        removeRecord(dateString, function() {

            trackerDatabase.track_date.splice(searchDataIndex, 1);
            trackerDatabase.mood.splice(searchDataIndex, 1);
            trackerDatabase.sleep.splice(searchDataIndex, 1);
            trackerDatabase.energy.splice(searchDataIndex, 1);
            trackerDatabase.arguments.splice(searchDataIndex, 1);
            trackerDatabase.supportiveness.splice(searchDataIndex, 1);
            trackerDatabase.productivity.splice(searchDataIndex, 1);
            trackerDatabase.periods.splice(searchDataIndex, 1);
            trackerDatabase.comment.splice(searchDataIndex, 1);
            trackerDatabase.overall.splice(searchDataIndex, 1);            
            console.log(trackerDatabase);
            var from_$input = $('#input-datepicker').pickadate(),
                from_picker = from_$input.pickadate('picker');
            from_picker.set('select', new Date());

        })
    })
    displayOverallscore();
}