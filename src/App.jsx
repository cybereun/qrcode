import React, { useState, useRef, useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './index.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('url'); // 'url', 'text', 'contact'

  // 상태 관리
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [contact, setContact] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    address: '',
    note: ''
  });

  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(200);
  const qrRef = useRef(null);

  const [showMore, setShowMore] = useState(false); // 추가 정보 토글 상태

  // QR 코드 값 계산 (메모이제이션)
  const qrValue = useMemo(() => {
    if (activeTab === 'url') {
      if (!url.trim()) return '';
      // URL 모드일 때 스키마 자동 추가
      return /^https?:\/\//i.test(url) ? url : `https://${url}`;
    }
    if (activeTab === 'text') {
      return text;
    }
    if (activeTab === 'contact') {
      const { name, phone, email, company, address, note } = contact;
      // 필수값 체크는 없지만 하나라도 있으면 생성
      if (!name && !phone && !email && !company && !address && !note) return '';

      // vCard 3.0 포맷 생성
      // ADR 포맷: ADR:;;Street Address;City;Region;Postal Code;Country
      // 여기서는 심플하게 전체 주소를 Street Address 자리에 넣습니다.
      return `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${phone}
EMAIL:${email}
ORG:${company}
ADR:;;${address};;;;
NOTE:${note}
END:VCARD`;
    }
    return '';
  }, [activeTab, url, text, contact]);

  // QR 코드 다운로드 함수
  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `my-cute-qr-${activeTab}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

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

      {/* 탭 메뉴 */}
      <div className="tab-container">
        <button
          className={`tab-btn ${activeTab === 'url' ? 'active' : ''}`}
          onClick={() => setActiveTab('url')}
        >
          🔗 URL
        </button>
        <button
          className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          📝 텍스트
        </button>
        <button
          className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          👤 연락처
        </button>
      </div>

      {/* 입력 섹션: 탭에 따라 다르게 표시 */}
      <div className="input-container">

        {activeTab === 'url' && (
          <div style={{ position: 'relative', width: '100%' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="#FF9AA2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <input
              type="text"
              placeholder="https://example.com"
              className="cute-input with-icon"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        )}

        {activeTab === 'text' && (
          <textarea
            className="cute-textarea"
            placeholder="여기에 텍스트를 입력하세요..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}

        {activeTab === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
            {/* 기본 정보 */}
            <input
              type="text"
              placeholder="이름 (Name)"
              className="cute-input"
              value={contact.name}
              onChange={(e) => setContact({ ...contact, name: e.target.value })}
            />
            <input
              type="tel"
              placeholder="전화번호 (Phone)"
              className="cute-input"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            />
            <input
              type="email"
              placeholder="이메일 (Email)"
              className="cute-input"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
            />

            {/* 추가 정보 토글 버튼 */}
            <button
              onClick={() => setShowMore(!showMore)}
              style={{
                background: 'transparent',
                color: '#888',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                border: '1px dashed #ddd',
                borderRadius: '12px'
              }}
            >
              {showMore ? '간단히 입력하기 ▲' : '직장, 주소, 메모 추가하기 ▼'}
            </button>

            {/* 추가 정보 (조건부 렌더링) */}
            {showMore && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', animation: 'fadeIn 0.3s ease' }}>
                <input
                  type="text"
                  placeholder="직장명 (Company)"
                  className="cute-input"
                  value={contact.company}
                  onChange={(e) => setContact({ ...contact, company: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="주소 (Address)"
                  className="cute-input"
                  value={contact.address}
                  onChange={(e) => setContact({ ...contact, address: e.target.value })}
                />
                <textarea
                  placeholder="메모 (Note)"
                  className="cute-textarea"
                  style={{ minHeight: '80px' }}
                  value={contact.note}
                  onChange={(e) => setContact({ ...contact, note: e.target.value })}
                />
              </div>
            )}
          </div>
        )}

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
        {qrValue ? (
          <QRCodeCanvas
            value={qrValue}
            size={size}
            fgColor={color}
            bgColor={"#FFFFFF"}
            level={"H"}
            includeMargin={false}
          />
        ) : (
          <div style={{ color: '#DDD', textAlign: 'center', fontSize: '0.9rem' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🧇</span>
            정보를 입력해주세요...
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
      <button className="download-btn" onClick={downloadQR} disabled={!qrValue} style={{ opacity: qrValue ? 1 : 0.5, cursor: qrValue ? 'pointer' : 'not-allowed' }}>
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
