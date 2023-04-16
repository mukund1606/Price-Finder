import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

const Html5QrcodePlugin = (props) => {
  useEffect(() => {
    let html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, {
      fps: 24,
    });
    html5QrcodeScanner.render(props.qrCodeSuccessCallback, () => {});
  }, []);

  return <div id={qrcodeRegionId} className={props.className}></div>;
};

export default Html5QrcodePlugin;
