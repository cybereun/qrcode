import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './index.css';

const App = () => {
  const [url, setUrl] = useState(''); // 초기값은 비워두어 플레이스홀더가 보이게 함
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(200);
  const qrRef = useRef(null);

  // QR 코드 다운로드 함수
  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = '내-귀여운-qr.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  // 색상 팔레트 정의
  const colors = [
    '#000000', // 기본 검정
    '#FF9AA2', // 소프트 핑크
    '#B5EAD7', // 민트 그린
    '#C7CEEA', // 라벤더
    '#FFDAC1', // 살구색
    '#E2F0CB', // 파스텔 라임
  ];

  return (
    <div className="card">
      <div className="badge">✨ 나만의 QR 만들기 ✨</div>
      <h1 className="title">Cute QR Maker</h1>

      {/* 입력 섹션 */}
      <div className="input-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FF9AA2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        <input
          type="text"
          placeholder="https://example.com"
          className="cute-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      {/* QR 표시 영역 */}
      <div
        ref={qrRef}
        style={{
          background: '#FFF',
          padding: '1.5rem',
          borderRadius: '24px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {url ? (
          <QRCodeCanvas
            value={url}
            size={size}
            fgColor={color}
            bgColor={"#FFFFFF"}
            level={"H"}
            includeMargin={false}
          />
        ) : (
          <div style={{ color: '#DDD', textAlign: 'center', fontSize: '0.9rem' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🧇</span>
            주소를 입력해주세요...
          </div>
        )}
      </div>

      {/* 컨트롤 패널 */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* 색상 선택 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          {colors.map((c) => (
            <div
              key={c}
              className={`color-option ${color === c ? 'selected' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>

        {/* 크기 조절 슬라이더 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'bold' }}>작게</span>
          <input
            type="range"
            min="128"
            max="300"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'bold' }}>크게</span>
        </div>

      </div>

      {/* 다운로드 버튼 */}
      <button className="download-btn" onClick={downloadQR} disabled={!url} style={{ opacity: url ? 1 : 0.5, cursor: url ? 'pointer' : 'not-allowed' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        PNG 다운로드
      </button>

      <footer style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#AAA' }}>
        Made with 💖 by Eun
      </footer>
    </div>
  )
}

export default App
