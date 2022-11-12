import React from "react";

export default function PrivacyPolicy({ content }) {
  const html = `<a href="https://www.iubenda.com/privacy-policy/65910312" class="iubenda-white no-brand iubenda-noiframe iubenda-embed iub-legal-only iubenda-noiframe iub-body-embed" title="Privacy Policy">Privacy Policy</a><script type="text/javascript">(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src="https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);</script>`;
  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
}
