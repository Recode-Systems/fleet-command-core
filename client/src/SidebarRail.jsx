import React from 'react';
import { FaHome, FaCog, FaBell, FaUser } from 'react-icons/fa';

export default function SidebarRail({ onSelect }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '60px',
        background: '#111',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        zIndex: 10
      }}
    >
      {/* Logo */}
      <div style={{ color: '#EF4444', fontWeight: 'bold', fontSize: '20px' }}>
        RC
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }}></div>

      {/* Bottom Icons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <FaCog
          size={24}
          style={{ cursor: 'pointer', color: '#fff' }}
          onClick={() => onSelect('settings')}
        />
        <FaBell
          size={24}
          style={{ cursor: 'pointer', color: '#fff' }}
          onClick={() => onSelect('notifications')}
        />
        <FaUser
          size={24}
          style={{ cursor: 'pointer', color: '#fff' }}
          onClick={() => onSelect('profile')}
        />
      </div>
    </div>
  );
}
