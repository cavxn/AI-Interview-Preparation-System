import React from 'react';
import Sidebar from '../Dashboard/Sidebar';
import PageWrapper from '/Users/cavins/Desktop/project/ai-interview-system/frontend/src/Components/Pagewrapper/PageWrapper.js';
import './SettingsPage.css';

const SettingsPage = () => {
  return (
    <PageWrapper>
      <div className="dashboard-wrapper">
        <Sidebar />
        <div className="settings-fullscreen">
          <h1 className="settings-title">⚙️ System Settings</h1>

          <div className="settings-grid">
            {/* Profile */}
            <div className="settings-card">
              <h3>👤 Profile</h3>
              <label>Display Name: <input type="text" defaultValue="Cavin" /></label>
              <label>Email: <input type="email" defaultValue="cavin@example.com" /></label>
            </div>

            {/* AI Settings */}
            <div className="settings-card">
              <h3>🧠 AI Analysis</h3>
              <label><input type="checkbox" defaultChecked /> Real-Time Emotion Detection</label>
              <label><input type="checkbox" defaultChecked /> Voice-to-Text Transcription</label>
              <label><input type="checkbox" /> GPT Feedback Analysis</label>
            </div>

            {/* Camera Settings */}
            <div className="settings-card">
              <h3>🎥 Camera Settings</h3>
              <label><input type="checkbox" defaultChecked /> Auto Start Webcam</label>
              <label>
                Camera Quality:
                <select defaultValue="Medium">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </label>
            </div>

            {/* Microphone */}
            <div className="settings-card">
              <h3>🎤 Microphone Settings</h3>
              <label><input type="checkbox" defaultChecked /> Auto Start Mic</label>
              <label>Sensitivity: <input type="range" min="1" max="10" defaultValue="5" /></label>
            </div>

            {/* UI Preferences */}
            <div className="settings-card">
              <h3>🎨 UI Preferences</h3>
              <label>
                Theme:
                <select defaultValue="Dark">
                  <option>Dark</option>
                  <option>Light</option>
                  <option>Auto</option>
                </select>
              </label>
              <label><input type="checkbox" /> Enable Animations</label>
              <label><input type="checkbox" defaultChecked /> Show Emojis</label>
            </div>

            {/* Notifications */}
            <div className="settings-card">
              <h3>🔔 Notifications</h3>
              <label><input type="checkbox" defaultChecked /> Notify when session ends</label>
              <label><input type="checkbox" /> Daily Interview Tips</label>
            </div>

            {/* Danger Zone */}
            <div className="settings-card danger">
              <h3>🚨 Danger Zone</h3>
              <button className="danger-btn">Logout from All Devices</button>
              <button className="danger-btn">Delete Account</button>
            </div>
          </div>

          <div className="save-settings">
            <button className="save-btn">💾 Save All Changes</button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SettingsPage;
