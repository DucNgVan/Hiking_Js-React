import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthController } from '../../controllers/useAuthController';
import { COLORS } from '../../theme';

export const SignInView = () => {
  const {
    isRegisterMode,
    setIsRegisterMode,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    phone,
    setPhone,
    showPassword,
    setShowPassword,
    handleSubmit
  } = useAuthController();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Bar Icon */}
        <View style={styles.topBar}>
          <View style={styles.menuIconContainer}>
            <Text style={styles.menuIcon}>☰</Text>
          </View>
        </View>

        {/* Logo & Header */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={{ fontSize: 36 }}>🧭</Text>
          </View>
          <Text style={styles.brandTitle}>M-Hike</Text>
          <Text style={styles.brandTagline}>Your journey, your path</Text>
        </View>

        {/* Input Fields Form */}
        <View style={styles.formContainer}>
          {isRegisterMode && (
            <>
              <View style={styles.inputOutlineGroup}>
                <Text style={styles.floatingLabel}>Full Name</Text>
                <View style={styles.inputInner}>
                  <Text style={styles.fieldIcon}>👤</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#A0AEC0"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              <View style={styles.inputOutlineGroup}>
                <Text style={styles.floatingLabel}>Phone Number</Text>
                <View style={styles.inputInner}>
                  <Text style={styles.fieldIcon}>📞</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#A0AEC0"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              </View>
            </>
          )}

          <View style={styles.inputOutlineGroup}>
            <Text style={styles.floatingLabel}>Email</Text>
            <View style={styles.inputInner}>
              <Text style={styles.fieldIcon}>👥</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#A0AEC0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.inputOutlineGroup}>
            <Text style={styles.floatingLabel}>Password</Text>
            <View style={styles.inputInner}>
              <Text style={styles.fieldIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A0AEC0"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {!isRegisterMode && (
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
            <Text style={styles.submitBtnText}>
              {isRegisterMode ? 'CREATE ACCOUNT' : 'SIGN IN'}
            </Text>
          </TouchableOpacity>

          {/* Social Logins */}
          {!isRegisterMode && (
            <>
              <Text style={styles.orText}>OR CONTINUE WITH</Text>
              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn}>
                  <Text style={styles.socialText}>G</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <Text style={styles.socialText}>f</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Toggle Mode */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            {isRegisterMode ? 'Already have an account? ' : "Don't have an account? "}
          </Text>
          <TouchableOpacity onPress={() => setIsRegisterMode(!isRegisterMode)}>
            <Text style={styles.toggleText}>
              {isRegisterMode ? 'Sign In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  topBar: {
    paddingTop: 12,
    paddingBottom: 20,
    alignItems: 'flex-start',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    fontSize: 20,
    color: '#4A5568',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
  },
  brandTagline: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputOutlineGroup: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 18,
    position: 'relative',
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: 16,
    backgroundColor: COLORS.bgMain,
    paddingHorizontal: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    zIndex: 2,
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  fieldIcon: {
    fontSize: 16,
    marginRight: 10,
    color: '#A0AEC0',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A202C',
  },
  eyeBtn: {
    padding: 6,
  },
  eyeIcon: {
    fontSize: 16,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  orText: {
    textAlign: 'center',
    color: '#A0AEC0',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 16,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  socialText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A5568',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#718096',
    fontSize: 14,
  },
  toggleText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
