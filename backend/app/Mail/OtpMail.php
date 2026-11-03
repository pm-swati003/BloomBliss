<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public $otp;
    public $purpose;

    public function __construct($otp, $purpose)
    {
        $this->otp = $otp;
        $this->purpose = $purpose;
    }

    public function build()
    {
        $subject = $this->purpose === 'email_verification'
            ? 'Verify Your Email - Bloom & Bliss'
            : 'Password Reset OTP - Bloom & Bliss';

        return $this->subject($subject)
                    ->view('emails.otp')
                    ->with([
                        'otp' => $this->otp,
                        'purpose' => $this->purpose,
                    ]);
    }
}