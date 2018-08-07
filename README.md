# hello-world-api

This is the first node.js assignment.

A simple RESTFul JSON API that listen on port 4000 returning a welcome message in JSON if POST to '/hello' route. Not working for https.

The API parses the URL and returns JSON with regards the parsed URL.

NOTE: on my server log, when user-agent is firefox, looks like the request 'end' handler runs two times for my api. The second time parses 'favicon.ico' as the urlCleanPath (trimmedPath).