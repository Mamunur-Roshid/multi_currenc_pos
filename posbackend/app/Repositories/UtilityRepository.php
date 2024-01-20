<?php
namespace App\Repositories;

class UtilityRepository
{
    private $regMobile = "/^01[13-9][\d]{8}$/";
    private $regEmail = "/^[\w][\w\.\-]{1,}[\w]@[\w][\w\.\-]{1,}[\w]\.[a-zA-Z]{2,}$/";

    public function ValidateMobile($mobile)
    {
        return preg_match($this->regMobile, $mobile);
    }

    public function ValidateEmail($email)
    {
        return preg_match($this->regEmail, $email);
    }
}