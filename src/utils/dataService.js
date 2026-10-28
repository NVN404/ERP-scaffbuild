// Supabase Multi-User Cloud Data Service
// Seamlessly connects React UI to PostgreSQL Supabase tables with optimistic updates and offline cache fallback

import { getSupabase } from './supabaseClient';
import { getDbCollection, saveDbCollection } from '../data/database';
import { 
  INITIAL_INVENTORY, 
  INITIAL_CHALLANS, 
  INITIAL_INVOICES 
} from '../data/defaultData';
import { 
  INITIAL_QUOTATIONS, 
  INITIAL_WORKER_LOGS 
} from '../data/database';

// -----------------------------------------------------------------------------
// 1. INVENTORY SERVICE
// -----------------------------------------------------------------------------
export async function loadInventory() {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('inventory')
        .select('*')
        .order('name');
      
      if (!error && data && data.length > 0) {
        return data.map(r => ({
          id: r.id,
          name: r.name,
          category: r.category,
          hsn: r.hsn,
          unit: r.unit || 'Pcs',
          weightKg: Number(r.weight_kg) || 0,
          totalStock: Number(r.total_stock) || 0,
          onRent: Number(r.on_rent) || 0,
          underRepair: Number(r.under_repair) || 0,
          dailyRent: Number(r.daily_rent) || 0,
          monthlyRent: Number(r.monthly_rent) || 0,
          replacementCost: Number(r.replacement_cost) || 0,
          location: r.location || 'Yard 1'
        }));
      }
    } catch (e) {
      console.warn('Could not load inventory from Supabase, using local store:', e);
    }
  }
  return getDbCollection('inventory', INITIAL_INVENTORY);
}

export async function syncInventoryItem(item) {
  const client = getSupabase();
  if (client) {
    try {
      await client.from('inventory').upsert({
        id: item.id,
        name: item.name,
        category: item.category,
        hsn: item.hsn,
        unit: item.unit,
        weight_kg: item.weightKg,
        total_stock: item.totalStock,
        on_rent: item.onRent,
        under_repair: item.underRepair,
        daily_rent: item.dailyRent,
        monthly_rent: item.monthlyRent,
        replacement_cost: item.replacementCost,
        location: item.location
      });
    } catch (e) {
      console.warn('Supabase inventory sync warning:', e);
    }
  }
}

// -----------------------------------------------------------------------------
// 2. CHALLANS SERVICE
// -----------------------------------------------------------------------------
export async function loadChallans() {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('challans')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(r => ({
          id: r.id,
          challanNo: r.challan_no,
          type: r.type,
          clientId: r.client_id,
          clientName: r.client_name,
          siteId: r.site_id,
          siteName: r.site_name,
          date: r.date,
          returnDate: r.return_date,
          vehicleNo: r.vehicle_no,
          driverName: r.driver_name,
          driverPhone: r.driver_phone,
          totalWeightKg: Number(r.total_weight_kg) || 0,
          items: r.items || [],
          status: r.status,
          remarks: r.remarks
        }));
      }
    } catch (e) {
      console.warn('Could not load challans from Supabase, using local store:', e);
    }
  }
  return getDbCollection('challans', INITIAL_CHALLANS);
}

export async function syncCreateChallan(challan) {
  const client = getSupabase();
  if (client) {
    try {
      await client.from('challans').insert({
        id: challan.id,
        challan_no: challan.challanNo,
        type: challan.type || 'outward',
        client_id: challan.clientId?.startsWith('usr_') ? null : challan.clientId,
        client_name: challan.clientName,
        site_name: challan.siteName,
        date: challan.date,
        return_date: challan.returnDate || null,
        vehicle_no: challan.vehicleNo,
        driver_name: challan.driverName,
        driver_phone: challan.driverPhone,
        total_weight_kg: challan.totalWeightKg || 0,
        items: challan.items || [],
        status: challan.status || 'active',
        remarks: challan.remarks || null
      });
    } catch (e) {
      console.warn('Supabase challan sync warning:', e);
    }
  }
}

// -----------------------------------------------------------------------------
// 3. QUOTATIONS SERVICE
// -----------------------------------------------------------------------------
export async function loadQuotations() {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(r => ({
          id: r.id,
          quotationNo: r.quotation_no,
          clientId: r.client_id,
          clientName: r.client_name,
          contactPerson: r.contact_person,
          siteId: r.site_id,
          siteName: r.site_name,
          status: r.status,
          workOrderNo: r.work_order_no,
          requestedAreaSqft: Number(r.requested_area_sqft) || 0,
          requestedVolumeCum: Number(r.requested_volume_cum) || 0,
          items: r.items || [],
          transportFreight: Number(r.transport_freight) || 0,
          loadingHamali: Number(r.loading_hamali) || 0,
          taxableAmount: Number(r.taxable_amount) || 0,
          gstRate: Number(r.gst_rate) || 18,
          gstAmount: Number(r.gst_amount) || 0,
          grandTotal: Number(r.grand_total) || 0,
          clientNotes: r.client_notes,
          ownerReply: r.owner_reply,
          date: r.created_at ? r.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10)
        }));
      }
    } catch (e) {
      console.warn('Could not load quotations from Supabase, using local store:', e);
    }
  }
  return getDbCollection('quotations', INITIAL_QUOTATIONS);
}

export async function syncCreateQuotation(quot) {
  const client = getSupabase();
  if (client) {
    try {
      await client.from('quotations').insert({
        id: quot.id,
        quotation_no: quot.quotationNo,
        client_id: quot.clientId?.startsWith('usr_') ? null : quot.clientId,
        client_name: quot.clientName,
        contact_person: quot.contactPerson || null,
        site_name: quot.siteName,
        status: quot.status || 'requested',
        work_order_no: quot.workOrderNo || null,
        requested_area_sqft: quot.requestedAreaSqft || 0,
        requested_volume_cum: quot.requestedVolumeCum || 0,
        items: quot.items || [],
        transport_freight: quot.transportFreight || 0,
        loading_hamali: quot.loadingHamali || 0,
        taxable_amount: quot.taxableAmount || 0,
        gst_rate: quot.gstRate || 18,
        gst_amount: quot.gstAmount || 0,
        grand_total: quot.grandTotal || 0,
        client_notes: quot.clientNotes || null,
        owner_reply: quot.ownerReply || null
      });
    } catch (e) {
      console.warn('Supabase quotation sync warning:', e);
    }
  }
}

export async function syncUpdateQuotation(quot) {
  const client = getSupabase();
  if (client) {
    try {
      await client.from('quotations').update({
        status: quot.status,
        work_order_no: quot.workOrderNo,
        items: quot.items,
        taxable_amount: quot.taxableAmount,
        gst_amount: quot.gstAmount,
        grand_total: quot.grandTotal,
        owner_reply: quot.ownerReply,
        updated_at: new Date().toISOString()
      }).eq('id', quot.id);
    } catch (e) {
      console.warn('Supabase quotation update warning:', e);
    }
  }
}

// -----------------------------------------------------------------------------
// 4. WORKER LOGS SERVICE
// -----------------------------------------------------------------------------
export async function loadWorkerLogs() {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('worker_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(r => ({
          id: r.id,
          workerId: r.worker_id,
          workerName: r.worker_name,
          workerPhone: r.worker_phone,
          clientId: r.client_id,
          siteId: r.site_id,
          siteName: r.site_name,
          floorLevel: r.floor_level,
          workType: r.work_type,
          workCompletedSummary: r.work_summary,
          areaCompletedSqft: Number(r.area_completed_sqft) || 0,
          volumeCompletedCum: Number(r.volume_completed_cum) || 0,
          laborCount: Number(r.labor_count) || 1,
          hoursWorked: Number(r.hours_worked) || 8.0,
          photoUrl: r.photo_url,
          status: r.status,
          approvedBy: r.approved_by,
          approvalTimestamp: r.approval_timestamp,
          approvalComments: r.approval_comments,
          date: r.created_at ? r.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10)
        }));
      }
    } catch (e) {
      console.warn('Could not load worker logs from Supabase, using local store:', e);
    }
  }
  return getDbCollection('worker_logs', INITIAL_WORKER_LOGS);
}

export async function syncCreateWorkerLog(log) {
  const client = getSupabase();
  if (client) {
    try {
      await client.from('worker_logs').insert({
        id: log.id,
        worker_id: log.workerId?.startsWith('usr_') ? null : log.workerId,
        worker_name: log.workerName,
        worker_phone: log.workerPhone,
        client_id: log.clientId?.startsWith('usr_') ? null : log.clientId,
        site_name: log.siteName,
        floor_level: log.floorLevel,
        work_type: log.workType,
        work_summary: log.workCompletedSummary,
        area_completed_sqft: log.areaCompletedSqft || 0,
        volume_completed_cum: log.volumeCompletedCum || 0,
        labor_count: log.laborCount || 1,
        hours_worked: log.hoursWorked || 8.0,
        photo_url: log.photoUrl,
        status: log.status || 'pending_approval'
      });
    } catch (e) {
      console.warn('Supabase worker log sync warning:', e);
    }
  }
}

export async function syncApproveWorkerLog(logId, { status, approvedBy, approvalComments, approvalTimestamp }) {
  const client = getSupabase();
  if (client) {
    try {
      await client.from('worker_logs').update({
        status: status || 'approved',
        approved_by: approvedBy,
        approval_comments: approvalComments,
        approval_timestamp: approvalTimestamp || new Date().toISOString()
      }).eq('id', logId);
    } catch (e) {
      console.warn('Supabase worker log approval sync warning:', e);
    }
  }
}

// -----------------------------------------------------------------------------
// 5. INVOICES SERVICE
// -----------------------------------------------------------------------------
export async function loadInvoices() {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(r => ({
          id: r.id,
          invoiceNo: r.invoice_no,
          billingType: r.billing_type,
          clientId: r.client_id,
          clientName: r.client_name,
          tradeName: r.trade_name,
          clientGstin: r.client_gstin,
          date: r.date,
          dueDate: r.due_date,
          items: r.items || [],
          subtotal: Number(r.subtotal) || 0,
          taxableAmount: Number(r.taxable_amount) || 0,
          cgst: Number(r.cgst) || 0,
          sgst: Number(r.sgst) || 0,
          igst: Number(r.igst) || 0,
          grandTotal: Number(r.grand_total) || 0,
          irn: r.irn,
          ackNo: r.ack_no,
          ewayBillNo: r.eway_bill_no,
          status: r.status
        }));
      }
    } catch (e) {
      console.warn('Could not load invoices from Supabase, using local store:', e);
    }
  }
  return getDbCollection('invoices', INITIAL_INVOICES);
}

export async function syncCreateInvoice(inv) {
  const client = getSupabase();
  if (client) {
    try {
      await client.from('invoices').insert({
        id: inv.id,
        invoice_no: inv.invoiceNo,
        billing_type: inv.billingType || 'with_gst',
        client_id: inv.clientId?.startsWith('usr_') ? null : inv.clientId,
        client_name: inv.clientName,
        trade_name: inv.tradeName,
        client_gstin: inv.clientGstin,
        date: inv.date,
        due_date: inv.dueDate,
        items: inv.items || [],
        subtotal: inv.subtotal || 0,
        taxable_amount: inv.taxableAmount || 0,
        cgst: inv.cgst || 0,
        sgst: inv.sgst || 0,
        igst: inv.igst || 0,
        grand_total: inv.grandTotal || 0,
        irn: inv.irn || null,
        ack_no: inv.ackNo || null,
        eway_bill_no: inv.ewayBillNo || null,
        status: inv.status || 'unpaid'
      });
    } catch (e) {
      console.warn('Supabase invoice sync warning:', e);
    }
  }
}

// -----------------------------------------------------------------------------
// 6. REALTIME SUBSCRIPTION HELPER
// -----------------------------------------------------------------------------
export function setupRealtimeSync({
  onChallanChange,
  onQuotationChange,
  onWorkerLogChange,
  onInvoiceChange,
  onInventoryChange
}) {
  const client = getSupabase();
  if (!client) return () => {};

  const channel = client.channel('scaffbuild-realtime-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'challans' }, () => {
      if (onChallanChange) onChallanChange();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'quotations' }, () => {
      if (onQuotationChange) onQuotationChange();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'worker_logs' }, () => {
      if (onWorkerLogChange) onWorkerLogChange();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => {
      if (onInvoiceChange) onInvoiceChange();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => {
      if (onInventoryChange) onInventoryChange();
    })
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}
