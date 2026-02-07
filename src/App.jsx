import React, { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const tabs = {
  url: "URL",
  text: "텍스트",
  contact: "연락처",
};

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function buildVCard(contact) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${contact.name}`,
    `TEL:${contact.phone}`,
    `EMAIL:${contact.email}`,
    `ORG:${contact.organization}`,
    `ADR:;;${contact.address};;;;`,
    "END:VCARD",
  ];

  return lines.join("\n");
}

export default function App() {
  const [activeTab, setActiveTab] = useState("url");
  const [url, setUrl] = useState("https://example.com");
  const [text, setText] = useState("원하는 텍스트를 입력하세요.");
  const [contact, setContact] = useState({
    name: "홍길동",
    phone: "010-1234-5678",
    email: "hong@example.com",
    organization: "Example Inc.",
    address: "서울특별시 중구 세종대로 110",
  });

  const qrValue = useMemo(() => {
    if (activeTab === "url") {
      return normalizeUrl(url);
    }

    if (activeTab === "text") {
      return text.trim();
    }

    return buildVCard(contact);
  }, [activeTab, url, text, contact]);

  const canRenderQr = qrValue.length > 0;

  return (
    <main className="container">
      <h1>QR 코드 생성기</h1>
      <p className="description">
        URL, 텍스트, 연락처 정보를 QR 코드로 변환합니다.
      </p>

      <div className="tabs" role="tablist" aria-label="QR 타입 선택">
        {Object.entries(tabs).map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            className={activeTab === key ? "tab active" : "tab"}
            onClick={() => setActiveTab(key)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <section className="panel">
        {activeTab === "url" && (
          <label className="field">
            URL 입력
            <input
              type="text"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com"
            />
            <small>
              프로토콜(https://)이 없으면 자동으로 추가되어 스캔 시 검색이 아닌 해당 URL로 이동합니다.
            </small>
          </label>
        )}

        {activeTab === "text" && (
          <label className="field">
            텍스트 입력
            <textarea
              rows={5}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="텍스트를 입력하세요"
            />
          </label>
        )}

        {activeTab === "contact" && (
          <div className="contact-grid">
            <label className="field">
              이름
              <input
                type="text"
                value={contact.name}
                onChange={(event) =>
                  setContact((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </label>
            <label className="field">
              전화번호
              <input
                type="text"
                value={contact.phone}
                onChange={(event) =>
                  setContact((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
            </label>
            <label className="field">
              이메일
              <input
                type="email"
                value={contact.email}
                onChange={(event) =>
                  setContact((prev) => ({ ...prev, email: event.target.value }))
                }
              />
            </label>
            <label className="field">
              회사명
              <input
                type="text"
                value={contact.organization}
                onChange={(event) =>
                  setContact((prev) => ({ ...prev, organization: event.target.value }))
                }
              />
            </label>
            <label className="field full-width">
              주소
              <input
                type="text"
                value={contact.address}
                onChange={(event) =>
                  setContact((prev) => ({ ...prev, address: event.target.value }))
                }
              />
            </label>
          </div>
        )}
      </section>

      <section className="qr-preview" aria-live="polite">
        {canRenderQr ? (
          <>
            <QRCodeSVG value={qrValue} size={220} includeMargin />
            <p className="value">인코딩 값: {qrValue}</p>
          </>
        ) : (
          <p>QR 코드를 생성하려면 값을 입력하세요.</p>
        )}
      </section>
    </main>
  );
}
