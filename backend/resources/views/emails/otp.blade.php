<!DOCTYPE html>
<html>
<head>
    <title>OTP Verification</title>
</head>
<body>
    <h2>Your OTP Code</h2>
    <p>Your one-time password (OTP) is: <strong>{{ $otp }}</strong></p>
    <p>This OTP is valid for 10 minutes.</p>
    @if($purpose === 'email_verification')
        <p>Please enter this code to verify your email address and activate your account.</p>
    @else
        <p>Please enter this code to reset your password.</p>
    @endif
</body>
</html>