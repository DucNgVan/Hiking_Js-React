import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useMapController } from '../../controllers/useMapController';

export const MapView = () => {
  const {
    userGps,
    gpsStatus,
    isLocating,
    errorMsg,
    mapHtml,
    webViewRef,
    handleGetLocation
  } = useMapController();

  const latStr = userGps ? `${userGps.lat.toFixed(6)}°` : '16.082230°';
  const lngStr = userGps ? `${userGps.lng.toFixed(6)}°` : '108.235937°';
  const accuracyStr = userGps ? `±${Math.round(userGps.accuracy || 5)}m` : '±5m';

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={{ fontSize: 22, marginRight: 8 }}>🎯</Text>
          <Text style={styles.headerTitle}>Live GPS Tracker</Text>
        </View>

        <View style={styles.liveBadge}>
          <View style={styles.greenDot} />
          <Text style={styles.liveBadgeText}>{gpsStatus || 'Live GPS Tracking'}</Text>
        </View>
      </View>

      {/* Mapbox Live Map Container */}
      <View style={styles.mapContainer}>
        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: mapHtml }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        )}
      </View>

      {/* Live Device Coordinates Section */}
      <View style={styles.coordSection}>
        <Text style={styles.blueSectionTitle}>LIVE DEVICE COORDINATES</Text>

        <View style={styles.coordCard}>
          <View style={styles.coordCol}>
            <Text style={styles.coordLabel}>LATITUDE</Text>
            <Text style={styles.coordValue}>{latStr}</Text>
          </View>
          <View style={styles.coordCol}>
            <Text style={styles.coordLabel}>LONGITUDE</Text>
            <Text style={styles.coordValue}>{lngStr}</Text>
          </View>
          <View style={styles.coordCol}>
            <Text style={styles.coordLabel}>ACCURACY</Text>
            <Text style={styles.coordValue}>{accuracyStr}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.refreshBtn}
          onPress={handleGetLocation}
          disabled={isLocating}
          activeOpacity={0.85}
        >
          {isLocating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.refreshBtnText}>🎯 Recenter Live GPS</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  liveBadgeText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  webview: {
    flex: 1,
  },
  errorBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    fontSize: 14,
  },
  coordSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  blueSectionTitle: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  coordCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  coordCol: {
    flex: 1,
    alignItems: 'center',
  },
  coordLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  coordValue: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '800',
  },
  refreshBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  refreshBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
