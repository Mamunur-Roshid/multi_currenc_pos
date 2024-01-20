<?php
namespace App\Repositories;

use App\Models\Brand;
use App\Models\Product;
use stdClass;
use Exception;

class BrandRepository 
{
    public function Get()
    {
        return Brand::where('branch_id', app('branchId'))->get();
    }

    public function GetById($id)
    {
        return Brand::where('id', $id)->where('branch_id', app('branchId'))->first();
    }

    public function Insert(Brand $brand)
    {
        $res = new stdClass();
        
        try {
            $duplicateBrand = Brand::where('name', $brand->name)->where('branch_id', app('branchId'))->first();

            if($duplicateBrand) {
                $res->code = 409;
                $res->message = $duplicateBrand->name . " already exists";
                return $res;
            }

            $brand->added_by = app('userId');
            $brand->branch_id = app('branchId');
            $brand->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Update(brand $brand)
    {
        $res = new stdClass();

        try {
            $duplicateBrand = brand::where('name', $brand->name)->where('id', '!=', $brand->id)->where('branch_id', app('branchId'))->first();

            if($duplicateBrand) {
                $res->code = 409;
                $res->message = $duplicateBrand->name . " already exists";
                return $res;
            }

            $brand->updated_by = app('userId');
            $brand->branch_id = app('branchId');
            $brand->save();

            $res->code = 200;
            $res->message = "Updated successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Delete($id)
    {
        $res = new stdClass();

        try {
            $count = Product::where('brand_id', $id)->count();
            if($count > 0) {
                $res->code = 451;
                $res->message = "Unable to delete. Product entry already used";
                return $res;
            }

            $brand = $this->GetById($id);
            $brand->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }
}
