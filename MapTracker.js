import React, & useEffect, useState & from "react";
import import
{ MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
"leaflet/dist/leaflet.css";
import
axios from "axios";
import
¿ io} from "socket.io-client";
const
socket = 10( "http://localhost:5000");
const MovingMarker = ({ position }) →> {
const map = useMap ();
const markerRef = React.useRef (null);
useEffect ( () → {
if (markerRef.current) {
markerRef.current.setLatLng (position);
map.setView(position, map.getZoom(), { animate: true });
}
}, [position, mapl);
return
<Marker ref={markerRef} position={position}›
‹Popup>Replaying Movement</Рорир>
</Marker>
);
};
const MapTracker = ( ) → {
const [locations, setLocations] = useState ([]);
[currentLocation, setCurrentLocation]
= useState (null);
[replayMode, setReplayMode] = useState(false) ;
[replayIndex, setReplayIndex] = useState (0);
[replayPath,
setReplayPath] = useState([]);
[animatedPosition,
setAnimatedPosition] = useState(null);
[replaySpeed, setReplaySpeed] = useState (1000); // Default 1 second interval
// Fetch stored GPS data
useEffect (()
const fetchLocations = async ( → {
const response = await axios.get("http://localhost:5000/track");
setLocations (response.data);
} catch (error) {
console.error ("Error fetching locations:" error);
}
};
fetchLocations ();
socket.on("newLocation",
(newLocation) => {
setLocations ((prevLocations) → [newLocation, ...prevLocations]);
return () => socket.off("newLocation");
3, []);
// Get live GPS location
useEffect (() = {
if ("geolocation" in navigator) {
navigator.geolocation.watchPosition(
(position) = {
const newLocation = 1 lat: position.coords.latitude, lon: position.coords.long:
setCurrentLocation (newLocation);
setLocations ((prev) = l...prev, i latitude: newLocation.lat, longitude: newLor
(error) => console.error ("Error getting location:", error)
}, []);
// Start replay
const startReplay = ( →> { if (locations.length < 2) return;
setReplayMode (true) ;
setReplayIndex (0);
setReplayPath([]);
setAnimatedPosition ([locations[0].latitude, locations[0].longitudel);
let index = 0;
const interval = setInterval(() => {
if (index ‹ locations.length - 1) {
setReplayIndex (index) ;
setReplayPath(locations.slice(0, index + 1).map(1oc => Lloc.latitude, loc. longiti
setAnimatedPosition([locationslindex].latitude, locations[index].longitude]);
clearInterval(interval);
setReplayMode (false);
}, replaySpeed);
};
return (
‹div>
<h2>Live GPS Tracking with Replay</h2>
‹button onClick={startReplay} disabled={replayMode}>Replay</button>
< label> Speed:
‹select onChange={(e) => setReplaySpeed(Number(e.target.value))} disabled={replay
<option value="500">Fast</option>
<option value="1000" selected>Normal</option>
value="2000">Slow</option>
</label>
‹MapContainer center={currentLocation? [currentLocation.lat, currentLocation.lon]
<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
{currentLocation && replayMode && <Marker position={[currentLocation.lat, currer {locations.map ((loc, index) => <Marker key={index} position={[loc.latitude,
¿locations. length > 1 && |replayMode 8& «Polyline positions= locations-mapl Loc.
{replayMode && ‹Polyline positions={replayPath} color="red" />} {replayMode && animatedPosition && <MovingMarker position={animatedPosition} />}
</MapContainer>
</div>
};
export default MapTracker;