var dateString = "";

const GRAPH_WEEK = 0;
const GRAPH_MONTH = 1;
const GRAPH_YEAR = 2;

var startDate = new Date();
var endDate = new Date();
var baseDate = new Date();
var graphType = GRAPH_WEEK;
var chart;


const strokeWidths = [6 //overall
    , 2 //mood
    , 2 //sleep
    , 2 //energy
    , 2 //arguments
    , 2 //supportiveness
    , 2 //productivity
    , 0 //periods
    , 0 //comment
];

const dashes = [0 //overall
    , 10 //mood
    , 6 //sleep
    , 12 //energy
    , 8 //arguments
    , 4 //supportiveness
    , 2 //productivity
    , 0 //periods
    , 0 //comment
];

const colors = ['#3A5794' //overall
    , '#00FF00' //mood
    , '#FFFF00' //sleep
    , '#0000FF' //energy
    , '#008888' //arguments
    , '#880088' //supportiveness
    , '#00FFFF' //productivity
    , '#FFFFFF' //periods
    , '#111111' //comment
];

function readDatabaseToGraph() {
    readDatabase(resetGraph);
}

function resetGraph(data) {
    var options = {
        chart: {
            height: 350,
            type: 'line',
            stacked: false,
            events: {
                click: function(event, chartContext, config) {
                    // ...
                    
                }

            }
        },
        stroke: {
            width: strokeWidths,
            curve: 'smooth',
            dashArray: dashes
        },

        colors: colors,
        series: [{
            name: 'Score',
            data: data.overall
        }, {
            name: 'Mood',
            data: data.mood
        }, {
            name: 'Sleep',
            data: data.sleep
        }, {
            name: 'Enery',
            data: data.energy
        }, {
            name: 'arguments',
            data: data.arguments
        }, {
            name: 'Supportiveness',
            data: data.supportiveness
        }, {
            name: 'Productivity',
            data: data.productivity
        }, {
            name: 'Periods',
            type: 'scatter',
            data: data.periods
        }, {
            name: 'comments',
            data: data.comment
        }],
        fill: {},
        dataLabels: {
            enabled: false,
        },
        labels: data.track_date,
        markers: {
            size: 5,
            hover: {
                sizeOffset: 6
            },

        },
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            min: -40,
            max: 60
        },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: function(y, opt) {

                    if (opt.seriesIndex == 8) {                        
                        return data.comment[opt.dataPointIndex];
                    } else if(opt.seriesIndex == 7) {
                        return y == -40 ? true : false;
                    }
                    return y;

                }
            }
        },
        legend: {
            labels: {
                useSeriesColors: true
            },
            markers: {
                customHTML: [
                    function() {
                        return '<span><i class="fab "></i></span>'
                    },
                    function() {
                        return '<span><i class="fab "></i></span>'
                    },
                    function() {
                        return '<span><i class="fab "></i></span>'
                    },
                    function() {
                        return '<span><i class="fab "></i></span>'
                    },
                    function() {
                        return '<span><i class="fab "></i></span>'
                    },
                    function() {
                        return '<span><i class="fab "></i></span>'
                    },
                    function() {
                        return '<span><i class="fab "></i></span>'
                    },
                    function() {
                        return '<span><i class="fab "></i></span>'
                    },
                    function() {
                        return '<span><i class="fab "></i></span>'
                    }
                ]
            }
        },

    }

    chart = new ApexCharts(
        document.querySelector("#chart"),
        options
    );

    chart.render();
}

function resetGraphType(type) {    

    graphType = type;
    startDate = new Date(baseDate);
    endDate = new Date(baseDate);

    switch (graphType) {
        case GRAPH_WEEK:
            startDate.setTime(baseDate.getTime() - (baseDate.getDay() - 0) * 24 * 60 * 60 * 1000);
            endDate.setTime(baseDate.getTime() + (6 - baseDate.getDay()) * 24 * 60 * 60 * 1000);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);    
            $("#current_status").html(moment(baseDate).format("YYYY MMMM") + " " + (moment(baseDate).weeks() - moment(baseDate).add(0, 'month').startOf('month').weeks() + 1));
            break;

        case GRAPH_MONTH:
            startDate = new Date(baseDate);    
            endDate = new Date(baseDate);
            startDate.setDate(1);
            endDate.setDate(31);

            while (endDate.getMonth() != baseDate.getMonth()) {
                endDate.setTime(endDate.getTime() - 24 * 60 * 60 * 1000);
            }

            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            $("#current_status").html(moment(baseDate).format("YYYY MMMM")); 
            break;

        case GRAPH_YEAR:
            startDate.setMonth(0);
            startDate.setDate(1);
            endDate.setMonth(11);
            endDate.setDate(31);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            $("#current_status").html(moment(baseDate).format("YYYY")); 
            break;
        default:
            return;
    }
    resetGraphCustom(startDate, endDate, trackerDatabase);
};

function resetGraphCustom(start, end, data) {
    
    var filterData = { track_date: [], mood: [], sleep: [], energy: [], arguments: [], supportiveness: [], productivity: [], periods: [], comment: [], overall: [] };
    var tempDate;
    var nextDataExist = false;
    var prevDataExist = false;
    for (var index = 0; index < data.track_date.length; index ++) {
        tempDate = new Date(data.track_date[index]);
        if (tempDate >= start && tempDate <= end) {            
            filterData.track_date.push(data.track_date[index]);
            filterData.energy.push(data.energy[index]);
            filterData.mood.push(data.mood[index]);
            filterData.sleep.push(data.sleep[index]);
            filterData.arguments.push(data.arguments[index]);
            filterData.supportiveness.push(data.supportiveness[index]);
            filterData.productivity.push(data.productivity[index]);
            filterData.periods.push(data.periods[index]);
            filterData.comment.push(data.comment[index]);
            filterData.overall.push(data.overall[index]);            
        } else if (tempDate > end) {
            nextDataExist = true;
            break;
        } else if(tempDate < startDate) {
            prevDataExist = true;
        }
    }
    
   
    if (prevDataExist) {
        $("#button-prev").removeAttr("disabled");
    } else {
        $("#button-prev").attr("disabled", true);
    }
    if (nextDataExist) {
        $("#button-next").removeAttr("disabled");
    } else {
        $("#button-next").attr("disabled", true);
    }
    chart.updateOptions({     
        labels: filterData.track_date,
    });

    chart.clearAnnotations();
    chart.updateSeries([{
            name: 'Score',
            data: filterData.overall
        }, {
            name: 'Mood',
            data: filterData.mood
        }, {
            name: 'Sleep',
            data: filterData.sleep
        }, {
            name: 'Enery',
            data: filterData.energy
        }, {
            name: 'arguments',
            data: filterData.arguments
        }, {
            name: 'Supportiveness',
            data: filterData.supportiveness
        }, {
            name: 'Productivity',
            data: filterData.productivity
        }, {
            name: 'Periods',
            type: 'scatter',
            data: filterData.periods
        }, {
            name: 'comments',
            data: filterData.comment
        }], true );

}

function changeBaseDate(next) {

    switch (graphType) {
        case GRAPH_WEEK:
            if (next) {
                baseDate.setTime(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            } else {
                baseDate.setTime(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000);
            }
            
            break;
        case GRAPH_MONTH:
            var tempValue = baseDate.getMonth();
            if (next) {                
                tempValue = (tempValue + 1) % 12;
                if (tempValue == 0) baseDate.setFullYear(baseDate.getFullYear() + 1);

                baseDate.setMonth(tempValue);
                while (baseDate.getMonth() != tempValue) {
                    baseDate.setTime(baseDate.getTime() - 24 * 60 * 60 * 1000);
                }
            } else {
                tempValue = tempValue == 0 ? 11 : (tempValue - 1);
                if (tempValue == 11) baseDate.setFullYear(baseDate.getFullYear() - 1);

                baseDate.setMonth(tempValue);
                while (baseDate.getMonth() != tempValue) {
                    baseDate.setTime(baseDate.getTime() - 24 * 60 * 60 * 1000);
                }
            }
      
            
            break;

        case GRAPH_YEAR:
            if (next) {
                baseDate.setFullYear(baseDate.getFullYear() + 1);
            } else {
                baseDate.setFullYear(baseDate.getFullYear() - 1);
            }

            
            break;
        default:
            return;
    }
    resetGraphType(graphType);
}


window.onload = function() {
    var today = new Date();

    dateString = moment(today).format("MM/DD/YYYY");  
    openDatabase(readDatabaseToGraph);

    $("#button-export").click(function() {
        readDatabase(saveJSON);
    });

    $("#button-year").click(function(){
        $("#button-week").removeClass("active");
        $("#button-month").removeClass("active");
        $("#button-year").addClass("active");
        resetGraphType(GRAPH_YEAR);
    });

    $("#button-month").click(function(){
        $("#button-week").removeClass("active");
        $("#button-month").addClass("active");
        $("#button-year").removeClass("active");
        resetGraphType(GRAPH_MONTH);
    });

    $("#button-week").click(function(){
        $("#button-week").addClass("active");
        $("#button-month").removeClass("active");
        $("#button-year").removeClass("active");
        resetGraphType(GRAPH_WEEK);
    });

    $("#button-prev").click(function(){       
        changeBaseDate(false);
       
    })

    $("#button-next").click(function(){
        changeBaseDate(true);
    
    })
}