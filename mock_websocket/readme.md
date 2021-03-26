## test code (1024 x 1024)

```bash
./send_websocket.py --port 8072 --input-file pref1024.tiff --pixel-dwell-time 1 --count 20 --frequency 10
```

## abu setting for test

```json
{
  "daServer": {
    "enabled": false,
    "host": "0.0.0.0",
    "path": "/da/mock",
    "port": 9090
  },
  "udp": {
    "bufferNum": 4096,
    "bufferSize": 64020,
    "count": 246393,
    "enabled": true,
    "host": "192.168.2.100",
    "port": 60000,
    "samplingRate": 6.25,
    "extraCount": 300
  },
  "fileSave": {
    "debug": "octo_test/0320/",
    "enabled": true,
    "rawData": "octo_test/0320/",
    "rawDataSave": false,
    "tiffSave": true
  },
  "globalConfig": { "verbosity": true, "galvo": false },
  "image": { "dataChan": 0, "pixelDataNum": 10, "threshold": 100 },
  "imageCalc": {
    "sizeX": 1024,
    "sizeY": 1024,
    "sizeZ": 4,
    "xFSteps": 4096,
    "xBSteps": 4096,
    "yFStepSeqs": 1024,
    "yFStepsPerSeq": 1,
    "yBSteps": 1024,
    "zFStepSeqs": 4,
    "zFStepsPerSeq": 25,
    "zBSteps": 100
  },
  "websocket": {
    "enabled": true,
    "host": "0.0.0.0",
    "interval": 100,
    "port": 8072
  },
  "scanConfig": {
    "lengthX": 1024,
    "lengthY": 1024,
    "lengthZ": 100,
    "yFLengthPerSeq": 1,
    "zFLengthPerSeq": 25,
    "xyRepeatNum": 1,
    "xyzRepeatNum": 1,
    "aomOpenUs": 1,
    "stepPeriodX": 75,
    "stepPeriodY": 500,
    "stepPeriodZ": 500
  },
  "scanDetailedConfig": {
    "bbai": { "host": "0.0.0.0", "port": 8090 },
    "invert": 1,
    "aomOpenHl": 1,
    "sReso": {
      "xFResolution": 0.25,
      "xBResolution": 0.25,
      "yFResolution": 1,
      "yBResolution": 1,
      "zFResolution": 1,
      "zBResolution": 1
    },
    "pinConfig": [
      { "name": "plsPin1", "value": 1 },
      { "name": "dirPin1", "value": 2 },
      { "name": "plsPin2", "value": 3 },
      { "name": "dirPin2", "value": 4 },
      { "name": "plsPin3", "value": 5 },
      { "name": "dirPin3", "value": 6 },
      { "name": "aomPin", "value": 7 },
      { "name": "aomRef", "value": 8 }
    ]
  },
  "prudaq": { "host": "192.168.2.104", "port": 8070 },
  "receiver": { "host": "0.0.0.0", "port": "8070" },
  "omeMetaData": {
    "baseOme": "atto488",
    "laserPower": 0,
    "pmtGain": 0,
    "objectiveName": "PAL-20-NIR-HR-LC00",
    "filterName": "D535/40M",
    "dichroicName": "Di03-R635-t1",
    "imageName": "test00",
    "detectroName": "",
    "description": "test",
    "detectorName": "PMT2101/M"
  },
  "minMax": { "minimum": 510, "maximum": 1024 },
  "position": [0, 0, 0],
  "command": "receiver",
  "uuid": "qg20210323-175832",
  "_id": "odUwlNtvOwqlh4tM",
  "createdAt": "2021-03-23T08:58:32.455Z",
  "updatedAt": "2021-03-23T09:40:49.311Z"
}
```

# test with mock udp sender

```json
{
  "daServer": {
    "enabled": false,
    "host": "0.0.0.0",
    "path": "/da/mock",
    "port": 9090
  },
  "udp": {
    "bufferNum": 4096,
    "bufferSize": 64020,
    "count": 187592,
    "enabled": true,
    "host": "192.168.2.100",
    "port": 60000,
    "samplingRate": 10,
    "extraCount": 0
  },
  "fileSave": {
    "debug": "octo_test/0320/",
    "enabled": true,
    "rawData": "octo_test/0320/",
    "rawDataSave": false,
    "tiffSave": true
  },
  "globalConfig": { "verbosity": false, "galvo": false },
  "image": { "dataChan": 0, "pixelDataNum": 10, "threshold": 100 },
  "imageCalc": {
    "sizeX": 500,
    "sizeY": 500,
    "sizeZ": 4,
    "xFSteps": 2000,
    "xBSteps": 500,
    "yFStepSeqs": 500,
    "yFStepsPerSeq": 1,
    "yBSteps": 500,
    "zFStepSeqs": 4,
    "zFStepsPerSeq": 1,
    "zBSteps": 4
  },
  "websocket": {
    "enabled": true,
    "host": "0.0.0.0",
    "interval": 100,
    "port": 8072
  },
  "scanConfig": {
    "lengthX": 500,
    "lengthY": 500,
    "lengthZ": 4,
    "yFLengthPerSeq": 1,
    "zFLengthPerSeq": 1,
    "xyRepeatNum": 1,
    "xyzRepeatNum": 1,
    "aomOpenUs": 32,
    "stepPeriodX": 60,
    "stepPeriodY": 60,
    "stepPeriodZ": 60
  },
  "scanDetailedConfig": {
    "bbai": { "host": "0.0.0.0", "port": 8090 },
    "invert": 1,
    "aomOpenHl": 1,
    "sReso": {
      "xFResolution": 0.25,
      "xBResolution": 1,
      "yFResolution": 1,
      "yBResolution": 1,
      "zFResolution": 1,
      "zBResolution": 1
    },
    "pinConfig": [
      { "name": "plsPin1", "value": 1 },
      { "name": "dirPin1", "value": 2 },
      { "name": "plsPin2", "value": 3 },
      { "name": "dirPin2", "value": 4 },
      { "name": "plsPin3", "value": 5 },
      { "name": "dirPin3", "value": 6 },
      { "name": "aomPin", "value": 7 },
      { "name": "aomRef", "value": 8 }
    ]
  },
  "prudaq": { "host": "192.168.2.104", "port": 8070 },
  "receiver": { "host": "0.0.0.0", "port": "8070" },
  "omeMetaData": {
    "baseOme": "atto488",
    "laserPower": 0,
    "pmtGain": 0,
    "objectiveName": "PAL-20-NIR-HR-LC00",
    "filterName": "D535/40M",
    "dichroicName": "Di03-R635-t1",
    "imageName": "test00",
    "detectroName": "",
    "description": "test",
    "detectorName": "PMT2101/M"
  },
  "minMax": { "minimum": 32704, "maximum": 40000 },
  "position": [0, 0, 0],
  "command": "receiver",
  "uuid": "aw20210323-225248",
  "_id": "Hf5zLBBtXI0BXLhG",
  "createdAt": "2021-03-23T13:52:49.146Z",
  "updatedAt": "2021-03-23T13:52:49.146Z"
}
```


```bash
./createPulseDummy.out hokkaido_chiba_osaka_500.json 
```

## hokkaido_chiba_osaka_500.json

```json
{
  "imgFileName": "dummy_tiff/hokkaido_chiba_osaka_500.tiff",
  "aomUs": 10,
  "pulseFreqUs": 100,
  "udpEnabled": true,
  "udpAddress": "0.0.0.0",
  "udpPort": 60000,
  "interval": 0,
  "xFSteps": 2000
}
```
