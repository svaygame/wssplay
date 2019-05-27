# wssplay
Using ffplay to play or dump video streaming from websocket

# readme
When the video source is websocket, there is no way to directly call ffmpeg/ffplay to play.
This tool can warp websocket to stdout , then you can dump data or play video.


# install
```
git clone https://github.com/svaygame/wssplay.git
cd wsplay
npm install
```

# play streaming
```
node index.js -i [websocket source]
```

# websocket to stdout
```
node index.js -i [websocket source] -r
```

# save flv websocket stream and play
```
node index.js -i [websocket source] -r > [filename].flv
npm ffplay [filename].flv
```

# save ts websocket stream and play
```
node index.js -i [websocket source] -r > [filename].ts
npm ffplay [filename].ts
```
