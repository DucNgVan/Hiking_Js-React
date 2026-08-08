import React, { useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useMapController } from '../../controllers/useMapController';
import { COLORS } from '../../theme';
import { MAPBOX_ACCESS_TOKEN } from '../../config';

const VIETNAM_LAT = 16.047079;
const VIETNAM_LNG = 108.206230;

export const MapView = () => {
  const {
    userGps,
    gpsStatus,
    isLocating,
    setIsMapReady,
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResult,
    webViewRef,
    handleSearchLocation,
    handleRecenterGps,
    handleZoomIn,
    handleZoomOut,
    handleMapMessage
  } = useMapController();

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
    html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background: #0f172a; touch-action: pan-x pan-y; }
    .mapboxgl-map { font-family: system-ui, -apple-system, sans-serif; }
    .user-pulse {
      width: 24px;
      height: 24px;
      background: #2563eb;
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 16px rgba(37, 99, 235, 0.9);
    }
    .red-marker-wrapper {
      position: relative;
      width: 40px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
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
      center: [${VIETNAM_LNG}, ${VIETNAM_LAT}],
      zoom: 12,
      attributionControl: false
    });

    var userMarker = null;
    var redMarker = null;
    var hasCentered = false;

    window.updateUserLocation = function(lat, lng, accuracy, autoRecenter) {
      var coords = [lng, lat];
      if (userMarker) {
        userMarker.setLngLat(coords);
      } else {
        var markerEl = document.createElement('div');
        markerEl.className = 'user-pulse';
        userMarker = new mapboxgl.Marker({ element: markerEl, anchor: 'center' })
          .setLngLat(coords)
          .addTo(map);
      }

      if (autoRecenter || !hasCentered) {
        map.flyTo({ center: coords, zoom: 15, speed: 1.4 });
        hasCentered = true;
      }
    };

    window.placeRedMarker = function(lat, lng, name) {
      var coords = [lng, lat];
      if (redMarker) {
        redMarker.setLngLat(coords);
      } else {
        var markerEl = document.createElement('div');
        markerEl.className = 'red-marker-wrapper';

        var pulseEl = document.createElement('div');
        pulseEl.className = 'red-marker-pulse';
        markerEl.appendChild(pulseEl);

        var pinSvg = document.createElement('div');
        pinSvg.className = 'red-marker-icon';
        pinSvg.innerHTML = '<svg width="34" height="44" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="#EF4444" stroke="#991B1B" stroke-width="1.5"/><circle cx="12" cy="12" r="5" fill="#FFFFFF"/></svg>';
        markerEl.appendChild(pinSvg);

        redMarker = new mapboxgl.Marker({ element: markerEl, anchor: 'bottom' })
          .setLngLat(coords)
          .addTo(map);
      }
      map.flyTo({ center: coords, zoom: 14, speed: 1.3 });
    };

    map.on('click', function(e) {
      var lat = e.lngLat.lat;
      var lng = e.lngLat.lng;
      window.placeRedMarker(lat, lng, '');
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'MAP_TAP',
          lat: lat,
          lng: lng
        }));
      }
    });

    window.recenterUser = function() {
      if (userMarker) {
        map.flyTo({ center: userMarker.getLngLat(), zoom: 16, speed: 1.4 });
      } else {
        map.flyTo({ center: [${VIETNAM_LNG}, ${VIETNAM_LAT}], zoom: 12, speed: 1.2 });
      }
    };

    window.zoomInMap = function() { map.zoomIn(); };
    window.zoomOutMap = function() { map.zoomOut(); };
  </script>
</body>
</html>
  `, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Banner */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>🎯 Vietnam Map & GPS</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>
            {isLocating ? '⏳ Fetching GPS...' : `🟢 ${gpsStatus}`}
          </Text>
        </View>
      </View>

      {/* 3-Tier Geocoding Fallback Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search location (e.g. Đà Nẵng, Hà Nội, Sapa)"
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchLocation}
        />
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={handleSearchLocation}
          disabled={isSearching}
        >
          {isSearching ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.searchBtnText}>🔍 Find</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Main Map */}
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: mapHtml }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoad={() => setIsMapReady(true)}
          onMessage={handleMapMessage}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={COLORS.primary || '#2563eb'} />
              <Text style={{ marginTop: 10, color: '#64748b', fontWeight: '600' }}>
                Loading Mapbox Streets...
              </Text>
            </View>
          )}
        />

        {/* Floating Zoom & Recenter Controls */}
        <View style={styles.controlsOverlay}>
          <TouchableOpacity style={styles.controlBtn} onPress={handleZoomIn} activeOpacity={0.8}>
            <Text style={styles.controlBtnText}>➕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={handleZoomOut} activeOpacity={0.8}>
            <Text style={styles.controlBtnText}>➖</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlBtn, styles.recenterBtn]}
            onPress={handleRecenterGps}
            activeOpacity={0.8}
          >
            <Text style={styles.controlBtnText}>🎯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Selected Location / GPS Overlay */}
      <View style={styles.bottomGpsCard}>
        {searchResult ? (
          <View style={styles.searchResultBox}>
            <Text style={styles.gpsCardTitle}>📌 RED PIN LOCATION</Text>
            <Text style={styles.searchResultName}>{searchResult.displayName}</Text>
            <Text style={styles.searchResultMeta}>
              Lat: {searchResult.lat.toFixed(6)}° | Lng: {searchResult.lng.toFixed(6)}° ({searchResult.source})
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.gpsCardTitle}>LIVE DEVICE COORDINATES</Text>
            {userGps ? (
              <View style={styles.coordsRow}>
                <View style={styles.coordBox}>
                  <Text style={styles.coordLabel}>LATITUDE</Text>
                  <Text style={styles.coordVal}>{userGps.lat.toFixed(6)}°</Text>
                </View>
                <View style={styles.coordBox}>
                  <Text style={styles.coordLabel}>LONGITUDE</Text>
                  <Text style={styles.coordVal}>{userGps.lng.toFixed(6)}°</Text>
                </View>
                <View style={styles.coordBox}>
                  <Text style={styles.coordLabel}>ACCURACY</Text>
                  <Text style={styles.coordVal}>±{Math.round(userGps.accuracy || 0)}m</Text>
                </View>
              </View>
            ) : (
              <View style={{ paddingVertical: 8, alignItems: 'center' }}>
                <Text style={{ color: '#64748b', fontSize: 13 }}>Map centered at Vietnam center (Da Nang area)...</Text>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  searchBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0f172a',
  },
  searchBtn: {
    backgroundColor: '#10b981',
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingBox: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsOverlay: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    gap: 8,
  },
  controlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recenterBtn: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  controlBtnText: {
    fontSize: 18,
    color: '#0F172A',
  },
  bottomGpsCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 6,
  },
  gpsCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  searchResultBox: {
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15803d',
    marginBottom: 4,
  },
  searchResultMeta: {
    fontSize: 11,
    color: '#166534',
  },
  coordsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  coordBox: {
    alignItems: 'center',
    flex: 1,
  },
  coordLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 2,
  },
  coordVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
});
