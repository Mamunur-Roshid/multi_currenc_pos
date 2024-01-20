<?php
namespace App\Repositories;

use App\Models\Category;
use App\Models\Product;
use stdClass;
use Exception;

class CategoryRepository 
{
    public function Get()
    {
        return Category::where('branch_id', app('branchId'))->get();
    }

    public function GetById($id)
    {
        return Category::where('id', $id)->where('branch_id', app('branchId'))->first();
    }

    public function Insert(Category $category)
    {
        $res = new stdClass();
        
        try {
            $duplicateCategory = Category::where('name', $category->name)->where('branch_id', app('branchId'))->first();

            if($duplicateCategory) {
                $res->code = 409;
                $res->message = $duplicateCategory->name . " already exists";
                return $res;
            }

            $category->branch_id = app('branchId');
            $category->added_by = app('userId');
            $category->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Update(Category $category)
    {
        $res = new stdClass();

        try {
            $duplicateCategory = Category::where('name', $category->name)->where('id', '!=', $category->id)->where('branch_id', app('branchId'))->first();

            if($duplicateCategory) {
                $res->code = 409;
                $res->message = $duplicateCategory->name . " already exists";
                return $res;
            }

            $category->branch_id = app('branchId');
            $category->updated_by = app('userId');
            $category->save();

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
            $count = Product::where('category_id', $id)->count();
            if($count > 0) {
                $res->code = 451;
                $res->message = "Unable to delete. Product entry already used";
                return $res;
            }

            $category = $this->GetById($id);
            $category->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }
}
