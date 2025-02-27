require ("dotenv").config();
const express = require ("express");
const mongoose = require ("mongoose");
const cors = require ("cors");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const server = http.createServer (app);
const io = new Server (server, {
cors: {origin: "*" },
3) ;
app.use (cors ());
app.use(express.json ());
mongoose.connect(process.env.MONGO_URI, {
useNewUrlParser: true, useUnifiedTopology: true,
3);
const LocationSchema = new mongoose.Schema ({
latitude: Number, longitude: Number,
timestamp: { type: Date, default: Date. now 3,
}) ;
const Location = mongoose.model("Location"
, LocationSchema);
// Store new GPS location
app.post("/track", async (rea, res) →> {
try <
const location = new Location (req. body);
await location.save();
io.emit ("newLocation", location); res. status (201). json(location);
} catch (err) {
res. status (500). json(err);
}) ;
// Get all stored locations
app.get("/track", async (req, res) →> {
try {
const locations = await Location.find().sort({ timestamp: 1 });
res. json(locations);
} catch (err) {
res. status (500). json(res. status (500). json (err);
3);
// Get all stored locations
app.get("/track", async (req, res) →> {
try {
const locations = await Location.find().sort({ timestamp: 1 });
res. json (locations);
} catch (err) {
res. status (500). json(err);
}
}) ;
io.on ("connection", (socket) => {
console.1oq("New client connected");
socket.on ("disconnect"
, () => console.1og("Client disconnected"));
const PORT = process.env.PORT || 5000;
server.listen(PORT, () = console. 10g( Server running on port S{PORT}'))
