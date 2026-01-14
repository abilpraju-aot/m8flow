import { ObjectWithStringKeysAndValues } from '../interfaces';

const appVersionInfo = () => {
  const versionInfoFromHtmlMetaTag = document.querySelector(
    'meta[name="version-info"]',
  );
  let versionInfo: ObjectWithStringKeysAndValues = {};
  if (versionInfoFromHtmlMetaTag) {
    const versionInfoContentString =
      versionInfoFromHtmlMetaTag.getAttribute('content');
    if (
      versionInfoContentString &&
      versionInfoContentString !== '%VITE_VERSION_INFO%'
    ) {
      try {
        versionInfo = JSON.parse(versionInfoContentString);
      } catch (error) {
        console.warn('Failed to parse version info:', versionInfoContentString, error);
        // Return empty object on parse error
        versionInfo = {};
      }
    }
  }

  return versionInfo;
};

export default appVersionInfo;
