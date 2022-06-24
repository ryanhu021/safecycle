/* eslint-disable no-shadow */
/* eslint-disable prefer-destructuring */
const sqlite3 = require("spatialite");
const geohash = require("ngeohash");
const haversine = require("haversine");
const { Heap } = require("heap-js");

const GEOHASH_PRECISION = 10;
// const LESS_SAFE_MULTIPLIER = 1.5;
const UNSAFE_MULTIPLIER = 1.5;
const LENGTH_THRESHOLD = 100;

// things to check during pathfinding:
// - meet tag requirements
// - if current way is one way, must be going in right direction

// const isLessSafeClass = (c) => c === "designated";

const isUnsafeClass = (c) =>
  c === "secondary" ||
  c === "secondary_link" ||
  c === "tertiary" ||
  c === "tertiary_link" ||
  c === "track" ||
  c === "service";

const getMultiplier = (row) => {
  if (row.length > LENGTH_THRESHOLD) {
    if (isUnsafeClass(row.class)) {
      return UNSAFE_MULTIPLIER;
    }
  }
  return 1;
};

/**
 *
 * @param {*} db the spatialite database
 * @param {*} startLoc { lat, lon } of the user's starting location
 * @param {*} endLoc { lat, lon } of the user's ending location
 * @param {*} minLat minimum latitude of the bounding box
 * @param {*} minLon minimum longitude of the bounding box
 * @param {*} maxLat maximum latitude of the bounding box
 * @param {*} maxLon maximum longitude of the bounding box
 * @returns {Promise<{}>} a promise that resolves to a graph of the map and the start/end node keys
 *
 */
const buildGraph = (db, startLoc, endLoc, minLat, minLon, maxLat, maxLon) =>
  new Promise((resolve, reject) => {
    const graph = new Map();

    // track closest start and end points
    const start = { lat: 0, lon: 0, minDist: Infinity };
    const end = { lat: 0, lon: 0, minDist: Infinity };
    db.spatialite((err) => {
      if (err) {
        reject(err);
      }
      // get all roads within bounding box (if any part of the geometry is within the bounding box)
      db.each(
        "SELECT class, oneway_fromto, oneway_tofrom, length, AsGeoJSON(geometry) as geom FROM road WHERE MbrMaxY(geometry) >= ? AND MbrMinY(geometry) <= ? AND MbrMaxX(geometry) >= ? AND MbrMinX(geometry) <= ?",
        [minLat, maxLat, minLon, maxLon],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            const { coordinates } = JSON.parse(row.geom);
            const fromHash = geohash.encode(
              coordinates[0][1],
              coordinates[0][0],
              GEOHASH_PRECISION
            );
            const toHash = geohash.encode(
              coordinates[coordinates.length - 1][1],
              coordinates[coordinates.length - 1][0],
              GEOHASH_PRECISION
            );

            // add from -> to edge to graph
            if (row.oneway_fromto === 1) {
              if (!graph.has(fromHash)) {
                graph.set(fromHash, []);
              }
              graph.get(fromHash).push({
                to: toHash,
                length: row.length * getMultiplier(row),
                path: coordinates,
              });

              // update start/end (using from coord as start and to coord as end)
              let dist = haversine(startLoc, {
                latitude: coordinates[0][1],
                longitude: coordinates[0][0],
              });
              if (dist < start.minDist) {
                start.lat = coordinates[0][1];
                start.lon = coordinates[0][0];
                start.minDist = dist;
              }
              dist = haversine(endLoc, {
                latitude: coordinates[coordinates.length - 1][1],
                longitude: coordinates[coordinates.length - 1][0],
              });
              if (dist < end.minDist) {
                end.lat = coordinates[coordinates.length - 1][1];
                end.lon = coordinates[coordinates.length - 1][0];
                end.minDist = dist;
              }
            }

            // add to -> from edge to graph
            if (row.oneway_tofrom === 1) {
              if (!graph.has(toHash)) {
                graph.set(toHash, []);
              }
              graph.get(toHash).push({
                to: fromHash,
                length: row.length * getMultiplier(row),
                path: [...coordinates].reverse(),
              });

              // update start/end (using to coord as start and from coord as end)
              let dist = haversine(startLoc, {
                latitude: coordinates[coordinates.length - 1][1],
                longitude: coordinates[coordinates.length - 1][0],
              });
              if (dist < start.minDist) {
                start.lat = coordinates[coordinates.length - 1][1];
                start.lon = coordinates[coordinates.length - 1][0];
                start.minDist = dist;
              }
              dist = haversine(endLoc, {
                latitude: coordinates[0][1],
                longitude: coordinates[0][0],
              });
              if (dist < end.minDist) {
                end.lat = coordinates[0][1];
                end.lon = coordinates[0][0];
                end.minDist = dist;
              }
            }
          }
        },
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              graph,
              start: geohash.encode(start.lat, start.lon, GEOHASH_PRECISION),
              end: geohash.encode(end.lat, end.lon, GEOHASH_PRECISION),
            });
          }
        }
      );
    });
  });

const heuristic = (a, b) => haversine(a, b, { unit: "meter" });

const withinReach = (a, b, distance) => {
  if (distance <= 0) {
    return a === b;
  }
  return heuristic(geohash.decode(a), geohash.decode(b)) < distance;
};

const reconstructPath = (prevMap, start, end) => {
  const path = [];
  let curr = end;
  let currEdge;
  while (curr !== start) {
    const { key, edge } = prevMap.get(curr);
    curr = key;
    currEdge = edge;
    // eslint-disable-next-line no-plusplus
    for (let i = edge.path.length - 1; i >= 1; i--) {
      path.push(edge.path[i][0], edge.path[i][1]);
    }
  }
  path.push(currEdge.path[0][0], currEdge.path[0][1]);
  return path.reverse();
};

/**
 *
 * @param {*} graph the graph of the map
 * @param {*} start the start node geohash
 * @param {*} end the end node geohash
 *
 */
const buildPathAStar = (graph, start, end) => {
  // initialize g and f maps
  const gMap = new Map();
  const fMap = new Map();

  // initialize previous map
  // maps node key to previous node key and edge object
  const prevMap = new Map();

  // initialize open and closed sets
  const openQueue = new Heap((a, b) => fMap.get(a) - fMap.get(b));
  const openSet = new Set();
  const closedSet = new Set();

  // set g-value for start to 0 and f-value to heuristic
  gMap.set(start, 0);
  fMap.set(start, heuristic(geohash.decode(start), geohash.decode(end)));

  // add start to open list
  openQueue.push(start);
  openSet.add(start);

  // while open list is not empty
  while (openQueue.length > 0) {
    // remove node with the lowest f-value from open list
    const curr = openQueue.pop();
    openSet.delete(curr);

    // if current node within reach of the end node, reconstruct path and return
    if (withinReach(curr, end, 0)) {
      return reconstructPath(prevMap, start, curr);
    }

    // add curr to closed list
    closedSet.add(curr);

    // for each edge in curr's adjacency list
    graph.get(curr).forEach((edge) => {
      const { to, length } = edge;

      // if edge dest is not in closed list
      if (!closedSet.has(to) && graph.has(to)) {
        // if edge dest is in open list
        if (openSet.has(to)) {
          // remove edge dest from open list
          openQueue.remove(to);
          openSet.delete(to);
        }

        // set g-value for edge dest to to g-value of curr + edge length
        const g = gMap.get(curr) + length;
        if (gMap.get(to) === undefined || g < gMap.get(to)) {
          gMap.set(to, g);
          fMap.set(to, g + heuristic(geohash.decode(to), geohash.decode(end)));
          prevMap.set(to, { key: curr, edge });
        }

        // add edge dest to open list
        openQueue.push(to);
        openSet.add(to);
      }
    });
  }
  return [];
};

const route = async (dbPath, startLoc, endLoc, bbox) => {
  const time0 = new Date();
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
  const time1 = new Date();
  console.log(`[route] took ${time1 - time0}ms to open db`);

  const { graph, start, end } = await buildGraph(db, startLoc, endLoc, ...bbox);
  const time2 = new Date();
  console.log(
    `[route] took ${time2 - time1}ms to build graph of size ${graph.size}`
  );
  console.log(`[route] start: ${start}`);
  console.log(`[route] end: ${end}`);

  const time3 = new Date();
  const path = buildPathAStar(graph, start, end);
  // console.log(path);
  const time4 = new Date();
  console.log(`[route] took ${time4 - time3}ms to find path`);

  console.log(`\n[route] took ${time4 - time0}ms to complete`);
  db.close();
  return path;
};

module.exports = route;

// // const bbox = [39.137433, -75.569527, 39.189062, -75.492966]; // delaware - random
// // const bbox = [47.473531, -122.44455, 47.769659, -121.963898]; // washington - random
// // const bbox = [35.213414, -120.789253, 35.384015, -120.494682]; // california - slo
// // const bbox = [37.199269, -122.579956, 37.872252, -121.717529]; // california - bay area
// // const bbox = [33.576184, -122.893068, 38.253711, -117.685549]; // california - bay area to la
// const bbox = [47.538673, -122.022623, 47.550463, -121.991509]; // washington - issaquah highlands
// route("./databases/washington-latest-all.db", bbox);
