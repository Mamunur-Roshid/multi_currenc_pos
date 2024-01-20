<?php

namespace App\Repositories;

use App\Models\Product;
use stdClass;
use Exception;
use App\Models\Unit;
use Illuminate\Support\Facades\DB;

class ReportRepository
{
    public function GetProfitLoss($request)
    {
        $res = new stdClass;
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        // Get Data From Sale Table
        $discountTransport = DB::table('sales');
        $discountTransport->select(DB::raw('SUM(discount) as total_discount, SUM(transport) as total_transport, SUM(vat) as total_vat'));
        $discountTransport->where('status', 'a');
        if ($start_date != '' && $end_date != '') {
            $discountTransport->whereBetween('date', [$start_date, $end_date]);
        }
        if ($start_date != '' && $end_date == '') {
            $discountTransport->where('date', $start_date);
        }
        if ($start_date == '' && $end_date != '') {
            $discountTransport->where('date', $end_date);
        }
        $discountTransportResult = $discountTransport->get();




        // Get Data From Sale Details Table
        $saleCostOfSale = DB::table('sale_details as sd');
        $saleCostOfSale->select(DB::raw('SUM(sd.total) as total_sale_amount, SUM(sd.purchase_rate * sd.quantity) as total_cost_of_sale'));
        $saleCostOfSale->join('sales as s', 's.id', '=', 'sd.sale_id');
        $saleCostOfSale->where('sd.status', 'a');
        if ($start_date != '' && $end_date != '') {
            $saleCostOfSale->whereBetween('s.date', [$start_date, $end_date]);
        }
        if ($start_date != '' && $end_date == '') {
            $saleCostOfSale->where('s.date', $start_date);
        }
        if ($start_date == '' && $end_date != '') {
            $saleCostOfSale->where('s.date', $end_date);
        }
        $saleCostOfSaleResult = $saleCostOfSale->get();


        // Sale Return
        $saleReturn = DB::table('sale_returndetails as srd');
        $saleReturn->select(DB::raw('SUM(srd.return_amount * srd.quantity) as total_return_amount'));
        $saleReturn->join('sale_returns as sr', 'sr.id', '=', 'srd.sale_return_id');
        $saleReturn->where('srd.status', 'a');
        if ($start_date != '' && $end_date != '') {
            $saleReturn->whereBetween('sr.date', [$start_date, $end_date]);
        }
        if ($start_date != '' && $end_date == '') {
            $saleReturn->where('sr.date', $start_date);
        }
        if ($start_date == '' && $end_date != '') {
            $saleReturn->where('sr.date', $end_date);
        }
        $saleReturnResult = $saleReturn->get();



        // Damage 
        $damage = DB::table('damage_details as dd');
        $damage->select(DB::raw('SUM(dd.rate * dd.quantity) as total_damage_amount'));
        $damage->join('damages as d', 'd.id', '=', 'dd.damage_id');
        $damage->where('dd.status', 'a');
        if ($start_date != '' && $end_date != '') {
            $damage->whereBetween('d.date', [$start_date, $end_date]);
        }
        if ($start_date != '' && $end_date == '') {
            $damage->where('d.date', $start_date);
        }
        if ($start_date == '' && $end_date != '') {
            $damage->where('d.date', $end_date);
        }
        $damageResult = $damage->get();

        $grossProfit = (
            $saleCostOfSaleResult[0]->total_sale_amount + 
            $discountTransportResult[0]->total_vat - 
            $saleCostOfSaleResult[0]->total_cost_of_sale + 
            $discountTransportResult[0]->total_transport) - 
            ($discountTransportResult[0]->total_discount - $saleReturnResult[0]->total_return_amount - 
            $damageResult[0]->total_damage_amount
        );

        $res->code = 200;
        $res->profitloss = [
            'gross_profit' => $grossProfit | 0,
            'total_sale' => $saleCostOfSaleResult[0]->total_sale_amount | 0,
            'total_vat' => $discountTransportResult[0]->total_vat | 0,
            'total_cost_of_sale' => $saleCostOfSaleResult[0]->total_cost_of_sale | 0,
            'total_transport' => $discountTransportResult[0]->total_transport | 0,
            'total_discount' => $discountTransportResult[0]->total_discount | 0,
            'total_return_amount' => $saleReturnResult[0]->total_return_amount | 0,
            'total_damage_amount' => $damageResult[0]->total_damage_amount | 0,
        ];

        return $res;
    }
}
