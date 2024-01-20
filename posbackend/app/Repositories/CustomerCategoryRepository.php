<?php
namespace App\Repositories;

use App\Models\Customer;
use App\Models\CustomerCategory;
use App\Models\Product;
use stdClass;
use Exception;

class CustomerCategoryRepository 
{
    public function Get()
    {
        return CustomerCategory::all();
    }

    public function GetById($id)
    {
        return CustomerCategory::where('id', $id)->first();
    }

    public function Insert(CustomerCategory $Customercategory)
    {
        $res = new stdClass();
        
        try {
            $duplicateCustomerCategory = CustomerCategory::where('name', $Customercategory->name)->first();

            if($duplicateCustomerCategory) {
                $res->code = 409;
                $res->message = $duplicateCustomerCategory->name . " already exists";
                return $res;
            }

            $Customercategory->added_by = app('userId');
            $Customercategory->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Update(CustomerCategory $Customercategory)
    {
        $res = new stdClass();

        try {
            $duplicateCustomerCategory = CustomerCategory::where('name', $Customercategory->name)->where('id', '!=', $Customercategory->id)->first();

            if($duplicateCustomerCategory) {
                $res->code = 409;
                $res->message = $duplicateCustomerCategory->name . " already exists";
                return $res;
            }

            $Customercategory->updated_by = app('userId');
            $Customercategory->save();

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
            $count = Customer::where('customer_category_id', $id)->count();
            if($count > 0) {
                $res->code = 451;
                $res->message = "Unable to delete. Customer exist for this category";
                return $res;
            }

            $Customercategory = $this->GetById($id);
            $Customercategory->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        return $res;
    }
}
