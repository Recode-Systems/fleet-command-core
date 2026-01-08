import React from 'react';

export default function TopBar({ onSelect, activePage }) {
  const pages = [
    { key: 'overview', label: 'Overview' },
    { key: 'repairs', label: 'File Repair' },
    { key: 'fleet', label: 'Fleet Status' },
    { key: 'register', label: 'Register Vehicle' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: '60px', // leaves space for SidebarRail
        right: 0,
        height: '60px',
        background: '#111',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        zIndex: 10,
        borderBottom: '1px solid #333'
      }}
    >
      {pages.map(page => (
        <div
          key={page.key}
          onClick={() => onSelect(page.key)}
          style={{
            marginRight: '24px',
            cursor: 'pointer',
            color: activePage === page.key ? '#EF4444' : '#fff',
            fontWeight: activePage === page.key ? 'bold' : 'normal'
          }}
        >
          {page.label}
        </div>
      ))}
    </div>
  );
}
