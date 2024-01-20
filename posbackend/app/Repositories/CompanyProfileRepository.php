<?php
namespace App\Repositories;

use stdClass;
use Exception;
use App\Models\CompanyProfile;

class CompanyProfileRepository
{
    public function Get()
    {
        return CompanyProfile::select(['company_name', 'address', 'contact_us', 'email', 'image', 'dolor_rate', 'type', 'point', 'rate', 'id'])->first();
    }

    public function Update($req, $image)
    {
        $res = new stdClass();

        try {
            $companyProfile = CompanyProfile::first();
            $data = $req;
            if (!empty($image)) $data['image'] = $image;
            $companyProfile->update($data);

            $res->code = 200;
            $res->message = "Update successfully";
        } catch(Exception $ex) {
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        return $res;
    }
    
    public function UpdateRate($req)
    {
        $res = new stdClass();

        try {
            $companyProfile = CompanyProfile::first();
            $data = $req;
            $companyProfile->update($data);

            $res->code = 200;
            $res->message = "Update successfully";
        } catch(Exception $ex) {
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        return $res;
    }
}
