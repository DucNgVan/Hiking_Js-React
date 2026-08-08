import React, { useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '../theme';
import { MAPBOX_ACCESS_TOKEN } from '../config';

// Default Vietnam location (Center of Vietnam / Da Nang area)
const VIETNAM_DEFAULT_LAT = 16.047079;
const VIETNAM_DEFAULT_LNG = 108.206230;

export const MiniMap = ({
  lat = VIETNAM_DEFAULT_LAT,
  lng = VIETNAM_DEFAULT_LNG,
  title = 'Start Location',
  subtitle = 'Vietnam',
  height = 220,
  showControls = true,
  onMapTap = null
}) => {
  const webViewRef = useRef(null);

  const startLat = (typeof lat === 'number' && !isNaN(lat)) ? lat : parseFloat(lat) || VIETNAM_DEFAULT_LAT;
  const startLng = (typeof lng === 'number' && !isNaN(lng)) ? lng : parseFloat(lng) || VIETNAM_DEFAULT_LNG;

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        if (window.updateMarkerLocation) {
          window.updateMarkerLocation(${startLat}, ${startLng});
        }
        true;
      `);
    }
  }, [startLat, startLng]);

  const mapHtml = useMemo(() => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link href="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.css" rel="stylesheet" />
  <script src="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.js"></script>
  <style>
    * { box-sizing: border-box; }
    html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background: #F6F8F5; touch-action: pan-x pan-y; }
    .mapboxgl-map { font-family: system-ui, -apple-system, sans-serif; }

    /* Dual-Layer Red Marker Pin & Pulse Halo */
    .red-marker-wrapper {
      position: relative;
      width: 40px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      cursor: pointer;
    }
    .red-marker-pulse {
      position: absolute;
      bottom: 0px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.4);
      box-shadow: 0 0 16px #ef4444, inset 0 0 10px #dc2626;
      animation: pulse-ring 1.8s infinite ease-in-out;
      pointer-events: none;
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.6); opacity: 0.9; }
      50% { transform: scale(1.35); opacity: 0.3; }
      100% { transform: scale(0.6); opacity: 0.9; }
    }
    .red-marker-icon {
      width: 34px;
      height: 44px;
      z-index: 2;
      filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.5));
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    mapboxgl.accessToken = '${MAPBOX_ACCESS_TOKEN.replace(/'/g, "\\'")}';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [${startLng}, ${startLat}],
      zoom: 13,
      attributionControl: false
    });

    // Dual layer HD Red Marker Pin with IconAnchor BOTTOM
    var markerEl = document.createElement('div');
    markerEl.className = 'red-marker-wrapper';

    var pulseEl = document.createElement('div');
    pulseEl.className = 'red-marker-pulse';
    markerEl.appendChild(pulseEl);

    var pinSvg = document.createElement('div');
    pinSvg.className = 'red-marker-icon';
    pinSvg.innerHTML = '<svg width="34" height="44" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="#EF4444" stroke="#991B1B" stroke-width="1.5"/><circle cx="12" cy="12" r="5" fill="#FFFFFF"/></svg>';
    markerEl.appendChild(pinSvg);

    var currentMarker = new mapboxgl.Marker({ element: markerEl, anchor: 'bottom' })
      .setLngLat([${startLng}, ${startLat}])
      .addTo(map);

    // Tap Map to drop / move Red Marker Pin
    map.on('click', function(e) {
      var lat = e.lngLat.lat;
      var lng = e.lngLat.lng;
      currentMarker.setLngLat([lng, lat]);
      map.flyTo({ center: [lng, lat], speed: 1.2 });

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'MAP_TAP',
          lat: lat,
          lng: lng
        }));
      }
    });

    window.updateMarkerLocation = function(lat, lng) {
      if (currentMarker) {
        currentMarker.setLngLat([lng, lat]);
        map.flyTo({ center: [lng, lat], zoom: 14, speed: 1.3 });
      }
    };

    window.zoomInMap = function() { map.zoomIn(); };
    window.zoomOutMap = function() { map.zoomOut(); };
    window.recenterMap = function() { map.flyTo({ center: [${startLng}, ${startLat}], zoom: 14, speed: 1.2 }); };
  </script>
</body>
</html>
  `, [startLat, startLng, title, subtitle]);

  const mapSource = useMemo(() => ({ html: mapHtml }), [mapHtml]);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'MAP_TAP' && onMapTap) {
        onMapTap(data.lat, data.lng);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleZoomIn = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript('window.zoomInMap(); true;');
    }
  };

  const handleZoomOut = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript('window.zoomOutMap(); true;');
    }
  };

  const handleRecenter = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript('window.recenterMap(); true;');
    }
  };

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={mapSource}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={COLORS.primary} size="large" />
          </View>
        )}
      />

      {showControls && (
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomIn}>
            <Text style={styles.zoomBtnText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomOut}>
            <Text style={styles.zoomBtnText}>−</Text>
          </TouchableOpacity>
        </View>
      )}

      {showControls && (
        <TouchableOpacity style={styles.recenterBtn} onPress={handleRecenter}>
          <Text style={styles.recenterText}>🎯</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  webView: {
    flex: 1,
    backgroundColor: '#F6F8F5',
  },
  loadingBox: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F6F8F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomControls: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  zoomBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  zoomBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 22,
  },
  recenterBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  recenterText: {
    fontSize: 16,
  },
});
