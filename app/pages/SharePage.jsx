"use client";

import Script from "next/script";
import React from "react";

const SharePage = () => {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            body {
              margin: 0;
              padding: 0;
              background-color: #ffffff;
            }
            .page-wrap {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #ffffff;
              color: #222222;
              display: flex;
              flex-direction: column;
              justify-content: left;
              align-items: flex-start;
              max-width: 600px;
              margin: 10% auto 0 auto;
              padding: 20px;
              box-sizing: border-box;
            }
            .page-wrap h1 {
              font-size: 2.2rem;
              font-weight: 500;
              margin-top: 0;
              margin-bottom: 8px;
            }
            .page-wrap h1+p {
              font-size: 1.5rem;
              font-weight: 400;
              margin-top: 0;
              margin-bottom: 30px;
            }
            .page-wrap::after {
              content: "";
              display: block;
              width: 32px;
              height: 32px;
              border: 3px solid transparent;
              border-top-color: #222222;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin-bottom: 45px;
              order: 2;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .page-wrap p:nth-of-type(2) {
              font-size: 1.15rem;
              color: #555555;
              line-height: 1.5;
              order: 3;
            }
            #ray-id {
              font-family: monospace;
              font-size: 0.85rem;
              color: #777777;
              margin-top: 20px;
              order: 4;
            }
            #btn-send {
              background-color: #222222;
              color: #ffffff;
              border: none;
              padding: 10px 20px;
              font-size: 1rem;
              cursor: pointer;
              border-radius: 4px;
              margin-top: 15px;
              order: 5;
              transition: background-color 0.2s;
            }
            #btn-send:hover {
              background-color: #444444;
            }
            .send-result {
              font-size: 0.95rem;
              margin-top: 10px;
              order: 6;
            }
          `,
        }}
      />

      <div className="page-wrap">
        <h1>devesh.is-a.dev</h1>
        <p>Checking if the site connection is secure</p>
        <p>
          devesh.is-a.dev needs to review the security of your connection before
          proceeding.
        </p>

        <p id="ray-id">
          Ray ID: <span id="ray-id-value"></span>
        </p>

        <button 
          id="btn-send" 
          style={{ display: "none" }} 
          onClick={() => {
            if (typeof window !== "undefined" && window.handleContinue) {
              window.handleContinue();
            }
          }}
        >
          Continue →
        </button>
        <p id="send-result" className="send-result"></p>
      </div>

      <Script 
        src="/js/cf.js" 
        strategy="lazyOnload" 
      />
    </>
  );
};

export default SharePage;