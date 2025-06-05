import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { useAuth } from "hooks/useAuth";
import { getCurrentUser } from '@aws-amplify/auth';
import sktp from "assets/images/SKTP.png";

function AdminSignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const { signIn, completeSignIn, error: authError, isAuthenticated, checkAuthState } = useAuth('admin');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          console.log('User is already authenticated');
          navigate('/dashboards/default');
        }
      } catch (error) {
        console.log('No authenticated user');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signIn(email, password);
      console.log('Sign in result:', result);
      
      if (!result.isSignedIn && result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setShowNewPasswordForm(true);
      } else if (result.nextStep?.signInStep === 'COMPLETE_PROFILE') {
        setShowProfileForm(true);
      }
    } catch (err) {
      console.error('Sign in failed:', err);
      if (err.name === 'UserAlreadyAuthenticatedException') {
        try {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            await checkAuthState();
            navigate('/dashboards/default');
            return;
          }
        } catch (innerError) {
          console.error('Error checking current user:', innerError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await completeSignIn(newPassword, {
        name,
        phone_number: phoneNumber,
      });
      
      if (result.isSignedIn) {
        console.log('Successfully changed password and completed sign in');
        navigate('/dashboards/default');
      } else if (result.nextStep?.signInStep === 'COMPLETE_PROFILE') {
        setShowProfileForm(true);
        setShowNewPasswordForm(false);
      }
    } catch (err) {
      console.error('Password change failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboards/default');
    }
  }, [isAuthenticated, navigate]);

  return (
    <BasicLayout
      title="AI eBook Library Admin"
      description="Admin Dashboard Access"
      image={sktp}
    >
      <Card>
        <SoftBox p={3} mb={1} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            {showNewPasswordForm ? "Change Password" : "Admin Sign In"}
          </SoftTypography>
        </SoftBox>
        <SoftBox p={3}>
          {!showNewPasswordForm ? (
            <SoftBox component="form" role="form" onSubmit={handleSubmit}>
              <SoftBox mb={2}>
                <SoftInput
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                />
              </SoftBox>
              <SoftBox mb={2}>
                <SoftInput
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                />
              </SoftBox>
              {authError && (
                <SoftBox mb={2}>
                  <SoftTypography variant="caption" color="error">
                    {authError}
                  </SoftTypography>
                </SoftBox>
              )}
              <SoftBox display="flex" alignItems="center">
                <Switch
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <SoftTypography
                  variant="button"
                  fontWeight="regular"
                  sx={{ cursor: "pointer", userSelect: "none" }}
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  &nbsp;&nbsp;Remember me
                </SoftTypography>
              </SoftBox>
              <SoftBox mt={4} mb={1}>
                <SoftButton
                  type="submit"
                  variant="gradient"
                  color="info"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </SoftButton>
              </SoftBox>
            </SoftBox>
          ) : (
            <SoftBox component="form" role="form" onSubmit={handlePasswordChange}>
              <SoftBox mb={2}>
                <SoftInput
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  fullWidth
                />
                <SoftTypography variant="caption" color="text">
                  Password must be at least 8 characters long and contain numbers, special characters, and both upper and lowercase letters.
                </SoftTypography>
              </SoftBox>
              <SoftBox mb={2}>
                <SoftInput
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                />
              </SoftBox>
              <SoftBox mb={2}>
                <SoftInput
                  type="tel"
                  placeholder="Phone Number (e.g., +1234567890)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  fullWidth
                />
              </SoftBox>
              {authError && (
                <SoftBox mb={2}>
                  <SoftTypography variant="caption" color="error">
                    {authError}
                  </SoftTypography>
                </SoftBox>
              )}
              <SoftBox mt={4} mb={1}>
                <SoftButton
                  type="submit"
                  variant="gradient"
                  color="info"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password & Profile"}
                </SoftButton>
              </SoftBox>
            </SoftBox>
          )}
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default AdminSignIn;