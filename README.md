# wssplay
Using ffplay to play or dump video streaming from websocket

# 使用說明
影像來源是 websocket 時沒辦法直接呼叫ffmpeg播放, 透過工具讓 ffplay 可以播放影像

# play streaming
node index.js -i [websocket source]


# websocket to stdout
node index.js -i [websocket source] -r
