/* eslint-disable object-shorthand */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const express = require("express");
const queryOverpass = require("query-overpass");
const geolib = require("geolib");
const geohash = require("ngeohash");

const router = express.Router();

const buildGraph = (data) => {
  const graph = {};
  for (const f of data.features) {
    const feature = f.geometry;
    for (let i = 0; i < feature.coordinates.length; i += 1) {
      const coordinate = feature.coordinates[i];
      const long = coordinate[0];
      const lat = coordinate[1];
      const id = geohash.encode(lat, long, 9);
      graph[id] = {
        lat: lat,
        long: long,
        adj: [],
      };
      if (i > 0 && i < feature.coordinates.length - 1) {
        const prevCoordinate = feature.coordinates[i - 1];
        const prevId = geohash.encode(prevCoordinate[1], prevCoordinate[0], 9);
        graph[id].adj.push({ prevId });
        const nextCoordinate = feature.coordinates[i + 1];
        const nextId = geohash.encode(nextCoordinate[1], nextCoordinate[0], 9);
        graph[id].adj.push({ nextId });
      } else if (i === 0) {
        const nextCoordinate = feature.coordinates[i + 1];
        const nextId = geohash.encode(nextCoordinate[1], nextCoordinate[0], 9);
        graph[id].adj.push({ nextId });
      } else if (i === feature.coordinates.length - 1) {
        const prevCoordinate = feature.coordinates[i - 1];
        const prevId = geohash.encode(prevCoordinate[1], prevCoordinate[0], 9);
        graph[id].adj.push({ prevId });
      }
    }
  }
  return graph;
};

// const adjId = geohash.encode(adj[0], adj[1], 9);
// graph[id].adj.push({id: adjId});

// const graph = {
//   123: {
//     lat: 34321,
//     long: 31423,
//     adj: [
//       {
//         id: 234,
//         weight: 2,
//       },
//       {
//         id: 32,
//         weight: 4,
//       },
//     ],
//   },
//   234: {
//     adj: [],
//   },
// };

const getExpandedBounds = (lat1, long1, lat2, long2) => {
  // NW
  // let westLat, eastLat, southLong, northLong;
  // if (lat1 > lat2) {
  //   westLat = lat1
  //   eastLat = lat2
  // } else {
  //   westLat = lat2
  //   eastLat = lat1
  // }
  // if (long1 > long2) {
  //   southLong = long1
  //   northLong = long2
  // } else {
  //   southLong = long2
  //   northLong = long1
  // }
  // westLat += 0.01
  // eastLat -= 0.01
  // southLong += 0.01
  // northLong -= 0.01
  // return [westLat, southLong, eastLat, northLong]
  // ADD ALL HEMISPHERE LATER
  const bounds = geolib.getBounds([
    {
      latitude: lat1,
      longitude: long1,
    },
    {
      latitude: lat2,
      longitude: long2,
    },
  ]);
  return [
    bounds.minLat - 0.01,
    bounds.minLng - 0.01,
    bounds.maxLat + 0.01,
    bounds.maxLng + 0.01,
  ];
};

const getAllPathsGeoJSON = (bounds) => {
  const query = `
  /*
  This shows the cycleway and cycleroute network.
  */
  
  [out:json];
  
  (
    // get cycle route relations
    relation[route=bicycle](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    // get cycleways
    way[cycleway=lane](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[cycleway=track](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=cycleway](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=path][bicycle=designated](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=path][bicycle=yes](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=footway][bicycle=designated](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=footway][bicycle=yes](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=living_street][bicycle=yes](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=residential][bicycle!=no](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    
    
    // unsafe
    way[highway=secondary][bicycle!=no](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=secondary_link][bicycle!=no](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=tertiary][bicycle!=no](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=tertiary_link][bicycle!=no](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=track][bicycle!=no](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=service][bicycle!=no](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
  );
  
  out body;
  >;
  out skel qt;
  `;
  return new Promise((resolve, reject) => {
    queryOverpass(query, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

const getBikePathsGeoJSON = async (bounds) => {
  const query = `
  /*
  This shows the cycleway and cycleroute network.
  */
  
  [out:json];
  
  (
    // get cycle route relations
    relation[route=bicycle](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    // get cycleways
    way[cycleway=lane](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[cycleway=track](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=cycleway](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=path][bicycle=designated](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=path][bicycle=yes](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=footway][bicycle=designated](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=footway][bicycle=yes](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=residential][bicycle!=no](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
    way[highway=living_street][bicycle!=no](${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]});
  );
  
  out body;
  >;
  out skel qt;
  `;
  return new Promise((resolve, reject) => {
    queryOverpass(query, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

// GET - get path coordinates for safest path
router.get("/safest", async (req, res) => {
  const { lat1, long1, lat2, long2 } = req.body;

  // build graph
  const allPathsGeoJSON = await getAllPathsGeoJSON(
    getExpandedBounds(lat1, long1, lat2, long2)
  );
  res.send(buildGraph(allPathsGeoJSON));
  const bikePathsGeoJSON = await getBikePathsGeoJSON(
    getExpandedBounds(lat1, long1, lat2, long2)
  );
  console.log(bikePathsGeoJSON);

  // find safest path based on graph

  // res.send(path)
  // const path = [
  //   {
  //     lat: 0.0,
  //     long: 0.0,
  //   },
  // ];
});

module.exports = router;
