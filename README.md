## Inspiration
Biking—an everyday form of travel for students and professionals across the globe. On-campus, back home, and with the people that we know the most, we see bike accidents occur all too often. We wanted to create a navigation app that's different from traditional services, one that prioritizes safety over all other aspects.

## What it does
SafeCycle uses open-source mapping data to determine the safest and most optimal route from one place to another. It finds all the possible routes in the area and chooses based on road type, distance, and designated biking paths. Users can select custom start and end locations, or have the app automatically map the best route from their current location.

## How we built it
### Backend
To fetch the map, we used OpenStreetMap and created queries to get all accessible roads within a user-specified area. We parsed this mapping data into a graph data structure of connected nodes, and wrote a comprehensive pathfinding algorithm to determine the best route.

### Frontend
We built an intuitive user interface using React Native various UI and functional libraries. We created a homepage to receive user input, which routes to a map page that gets the path from the backend and plots it.

## Challenges we ran into
- Determining which types of roads are safer than others. Using the OpenStreetMap documentation, we designed two queries that separated safe roads from less safe roads.
- Parsing the GeoJSON data fetched from OpenStreetMap. We wrote an algorithm that organizes the data into intuitive and easily extensible format.
- Calculating bounds and distance with geographic coordinates. We installed a few libraries and wrote an algorithm that combines the functions of these libraries.

## Accomplishments that we're proud of
- Used a weighted graph data structure and a modified Dijkstra's algorithm to perform the route-finding logic.
- Balanced the priority of each road segment based on its calculated safety weight.
- Implemented a live location-tracking feature that updates the user's current location on the map.

## What we learned
- Using React Native to develop cross-platform mobile apps.
- Learning about geolocation and mapping libraries.
- Applying data structures and pathfinding algorithms to a real-world datset.

## What's next for SafeCycle
We want to expand the coverage and efficiency of SafeCycle by optimizing the backend adding additional safety criteria.
