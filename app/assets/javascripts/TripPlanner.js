
// The computeBestRoute function takes in an array of destinations as input.
// Each destination has the following structure [[city, min_time], [city, min_time] ... ].
// Given a list of cities and min_times, this function uses the Amadeus API to
// compute the best route between all of the given cities.



var computeBestRoute = function(json) {

    /********************************************************************************************
     PRIVATE HELPER METHODS
     ********************************************************************************************/

    var addDays = function(date, days) {
        console.log(date);
        date.setDate(date.getDate() + days);
        return date;
    };

// Print date as API Readable
    var apiDate = function(date) {
        var dd = date.getDate();
        if(dd < 10) {
            dd = '0'+dd;
        }

        var mm = date.getMonth() + 1;
        if(mm < 10) {
            mm = '0'+mm;
        }

        var y = date.getFullYear();
        return y + '-' + mm + '-' + dd;
    };


    // API Key
    var APIKey = '8E5OgHBknX2AWyiYAhMTB09o1UnFIgGR';

    // Finds the lowest fare flight with the given parameters.
    // Key: API Key
    // Source: City code of source
    // Dest: City code of dest
    // Departure Date: Date Object
    // Num Results: 5
    // Returns: Object containing cheapest flight.
    var getCheapestFlight = function(key, source, dest, dep_date, num_results) {
        if(new Date() > dep_date) {
            throw "getFlightFare input date must be after today's date!"
        }

        // Make the HTTP request to get the JSON data

        var next_date = apiDate(addDays(dep_date, 2));
        dep_date = apiDate(dep_date);

        var url = 'https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey='+key+'&origin='+source+'&destination='+dest+'&departure_date='+dep_date+'--'+next_date+'&nonstop=false&number_of_results=' + num_results;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", url, false ); // false for synchronous request
        xmlHttp.send( null );
        var response = xmlHttp.responseText;

        // Now that we have the JSON data, find the cheapest flight.
        var json = (JSON.parse(xmlHttp.responseText));
        console.log(json);
        console.log('!!!!!!!!!!!!!!!!');

        var results = json.results;
        var cheapest;
        var best_flight;
        for(var i = 0; i < results.length; i++) {
            //console.log("Price from: " + source + "to " + dest + ": " + results[i].fare.total_price);
            //console.log(parseInt(results[i].fare.total_price));
            if(typeof(cheapest) == 'undefined' || parseInt(results[i].fare.total_price) < parseInt(cheapest)) {
                cheapest = results[i].fare.total_price;
                best_flight = results[i];
                //console.log(best_flight);
            }
        }

        // Get the date that the flight takes place on:
        return best_flight;
    };

    /********************************************************************************************
     Function Logic
     ********************************************************************************************/
    var path = {
        flights: [],
        cost: 0
    };
    var initial_loc = json.start;
    var curloc = json.start;
    var date = json.startDate;


    // Takes in the list of all remaining cities
    // and returns the city with the cheapest flight cost.
    var cheapestEdge = function(startLoc, json, curDate) {
        var cheapest_edge;
        var cheapest_edge_price = Number.MAX_VALUE;
        var cheapest_dest;
        for(var i = 0; i<json.dests.length; i++) {
            if(typeof(json.dests[i]) != 'undefined') {
                var cur_flight = getCheapestFlight(APIKey, startLoc, json.dests[i][0], curDate, 5);
                if(cur_flight.fare.total_price < cheapest_edge_price) {
                    cheapest_edge_price = cur_flight.fare.total_price;
                    cheapest_edge = cur_flight;
                    cheapest_dest = json.dests[i][0];
                }
            }
        }
        cheapest_edge.cheapest_dest = cheapest_dest;
        return cheapest_edge;
    };

    // Iterates through destinations, finding the cheapest path that visits all cities.
    while(json.dests.length > 0) {
        // Find the cheapest flight out of options available
        var cheapest_edge = cheapestEdge(curloc, json, date);
        var cheapest_dest = cheapest_edge.cheapest_dest;
        path.flights.push([curloc, cheapest_dest, cheapest_edge.fare.total_price, cheapest_edge]);
        path.flights.cost += parseInt(cheapest_edge.fare.total_price);

        // Remove cheapest flight
        for(var i = 0; i<json.dests.length; i++) {
            if(typeof(json.dests[i]) != 'undefined') {
                if(json.dests[i][0] === cheapest_dest) {
                    date = (addDays(new Date(cheapest_edge.itineraries[0].outbound.flights[0].arrives_at),json.dests[i][1]));
                    json.dests.splice(i, 1);
                }
            }
        }

        // Increment date of flight - find previous flight arrival time, add time to stay in city.

        // We are now at the node cheapest_dest.
        //console.log("Cheapest flight from: " + curloc + " to " + cheapest_dest + "costs: " + cheapest_edge.fare.total_price);

        curloc = cheapest_dest;

    }

    // Now that we are out of destinations, take me home!
    var last_flight = getCheapestFlight(APIKey, curloc, initial_loc, date, 5);
    path.flights.push([curloc, initial_loc, last_flight.fare.total_price, last_flight]);
    path.cost += parseInt(last_flight.fare.total_price);
    return path;

};

