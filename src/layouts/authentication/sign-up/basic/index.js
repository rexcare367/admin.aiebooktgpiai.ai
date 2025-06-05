import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import Separator from "layouts/authentication/components/Separator";
import { useAuth } from "hooks/useAuth";
import sktp from "assets/images/SKTP.png";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { signUp, confirmSignUp, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      await signUp(email, password);
      setIsConfirming(true);
    } catch (err) {
      console.error("Sign up error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmSignUp(email, verificationCode);
      // Redirect to sign in page after successful confirmation
      window.location.href = "/authentication/sign-in/basic";
    } catch (err) {
      console.error("Confirmation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicLayout
      title="Join AI eBook Library"
      description="Create your account to access our library"
      image={sktp}
    >
      <Card>
        <SoftBox p={3} mb={1} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            {isConfirming ? "Verify Your Email" : "Sign up"}
          </SoftTypography>
        </SoftBox>
        <SoftBox p={3}>
          {!isConfirming ? (
            <SoftBox component="form" role="form" onSubmit={handleSubmit}>
              <SoftBox mb={2}>
                <SoftInput
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </SoftBox>
              <SoftBox mb={2}>
                <SoftInput
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </SoftBox>
              <SoftBox mb={2}>
                <SoftInput
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </SoftBox>
              {error && (
                <SoftBox mb={2}>
                  <SoftTypography variant="caption" color="error">
                    {error}
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
                  {loading ? "Creating Account..." : "Sign up"}
                </SoftButton>
              </SoftBox>
            </SoftBox>
          ) : (
            <SoftBox component="form" role="form" onSubmit={handleConfirmation}>
              <SoftBox mb={2}>
                <SoftTypography variant="button" fontWeight="regular" color="text">
                  Please check your email for the verification code
                </SoftTypography>
              </SoftBox>
              <SoftBox mb={2}>
                <SoftInput
                  type="text"
                  placeholder="Verification Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </SoftBox>
              {error && (
                <SoftBox mb={2}>
                  <SoftTypography variant="caption" color="error">
                    {error}
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
                  {loading ? "Verifying..." : "Verify Email"}
                </SoftButton>
              </SoftBox>
            </SoftBox>
          )}
          <Separator />
          <SoftBox mt={1} mb={3}>
            <SoftButton
              component={Link}
              to="/authentication/sign-in/basic"
              variant="gradient"
              color="dark"
              fullWidth
            >
              Back to Sign in
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default SignUp;