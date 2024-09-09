import { useState } from 'react';

export default function App() {
  const videoCodecs = RTCRtpSender.getCapabilities('video')
  const audioCodecs = RTCRtpSender.getCapabilities('audio')
  const [devices, setDevices] = useState(null)
  const [capabilities, setCapabilities] = useState(null)
  const [deviceId, setDeviceId] = useState(null)
  const [settings, setSettings] = useState(null)

  const selectDevice = async (device) => {
    if (device.kind === "audiooutput") {
      setCapabilities(null)
      setSettings(null)  
    } else {
      const media = await navigator.mediaDevices.getUserMedia(device.kind === "videoinput" ? { video: { exact: { deviceId: device.deviceId }}} : { audio: { exact: {deviceId: device.deviceId }}})
  
      setCapabilities(media.getTracks().map(t => 'getCapabilities' in t && t.getCapabilities()))
      setSettings(media.getTracks().map(t => t.getSettings()))
    }
    setDeviceId(device.deviceId)
  }

  const getCapabilities = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    setDevices(devices)
    await selectDevice(devices[0])
  }

  return (
    <div>
      <h1>Video Codecs</h1>
      <div>{videoCodecs?.codecs.sort().map(codec => <div key={JSON.stringify(codec)}>{JSON.stringify(codec, null, 4)}</div>)}</div>
      <h1>Audio Codecs</h1>
      <div>{audioCodecs?.codecs.sort().map(codec => <div key={JSON.stringify(codec)}>{JSON.stringify(codec, null, 4)}</div>)}</div>
      <h1>Supported Constraints</h1>
      <pre>{JSON.stringify(navigator.mediaDevices.getSupportedConstraints(), null, 4)}</pre>
      <h1>Big button</h1>
      <button onClick={getCapabilities}>Get capabilities</button>

      <select onChange={async (e) => {
          const device = JSON.parse(e.target.value)
          await selectDevice(device)
      }}>
        {devices && devices.map(d => <option key={d.deviceId} value={JSON.stringify(d)}>{d.label}</option>)}
      </select>
      <h1>Selected Device</h1>
      <pre>{devices && JSON.stringify(devices.find(d => d.deviceId === deviceId), null, 4)}</pre>

      <h1>Capabilities</h1>
      <pre style={{}}>{capabilities && JSON.stringify(capabilities, null, 4)}</pre>
      
      <h1>Settings</h1>
      <pre>{settings && JSON.stringify(settings, null, 4)}</pre>
    </div>
  );
}

